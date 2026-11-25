// Copies of the game server's wire types. Keep in sync with weiqi-websocket/protocol.ts, game.ts and engine.ts.

export type Color = "Black" | "White";
export type BoardSize = 9 | 13 | 19;
export type Cell = Color | "Empty";

export interface Point {
	readonly x: number;
	readonly y: number;
}

export type Move =
	| { readonly type: "play"; readonly color: Color; readonly point: Point }
	| { readonly type: "pass"; readonly color: Color };

export interface RuleConfig {
	readonly superko: "None" | "Positional" | "Situational";
	readonly suicide: "Forbidden" | "MultiStoneOnly" | "Allowed";
	readonly passEnding: "TwoConsecutivePasses" | "NoAutomaticEnd";
}

export type IllegalMoveReason = "OutOfBounds" | "Occupied" | "WrongPlayer" | "Suicide" | "Ko" | "GameEnded" | "Superko";

export interface GameConfig {
	readonly boardSize: BoardSize;
	readonly rules: RuleConfig;
	readonly komi: number;
	readonly startingPlayer: Color;
	readonly setup: { readonly kind: "empty" };
}

export type Seats = Readonly<Record<Color, { readonly claimed: boolean }>>;

export type GameResult =
	| { readonly kind: "resignation"; readonly winner: Color; readonly resigned: Color }
	| { readonly kind: "noResult"; readonly reason: "aborted" | "unscored"; readonly endedBy: Color };

export type GamePhase =
	| { readonly kind: "awaitingPlayers" }
	| { readonly kind: "playing" }
	| { readonly kind: "awaitingScoring"; readonly scoring: "unsupported" }
	| { readonly kind: "finished"; readonly result: GameResult };

export type CommandRejection =
	| { readonly reason: "staleRevision" | "wrongPhase" | "seatTaken" | "notYourTurn" | "abortUnavailable" }
	| { readonly reason: "illegalMove"; readonly illegalMoveReason: IllegalMoveReason };

export interface Position {
	readonly board: { readonly size: BoardSize; readonly cells: readonly Cell[] };
	readonly currentPlayer: Color;
	readonly moveNumber: number;
	readonly consecutivePasses: number;
	readonly koPoint: Point | null;
}

export interface PublicMove {
	readonly moveNumber: number;
	readonly move: Move;
	readonly capturedStones: readonly Point[];
	readonly selfCapturedStones: readonly Point[];
}

export interface PublicGameSnapshot {
	readonly id: string;
	readonly revision: number;
	readonly createdAt: number;
	readonly updatedAt: number;
	readonly config: GameConfig;
	readonly seats: Seats;
	readonly phase: GamePhase;
	readonly position: Position;
	readonly captures: {
		readonly stonesCapturedBy: Readonly<Record<Color, number>>;
		readonly stonesSelfCapturedBy: Readonly<Record<Color, number>>;
	};
	readonly moves: readonly PublicMove[];
}

export type ClientMessage =
	| { readonly type: "play"; readonly point: Point; readonly expectedRevision?: number }
	| { readonly type: "pass" | "resign" | "abort"; readonly expectedRevision?: number };

export type ServerMessage =
	| { readonly type: "joined"; readonly color: Color; readonly seatToken: string; readonly game: PublicGameSnapshot }
	| { readonly type: "state"; readonly game: PublicGameSnapshot }
	| { readonly type: "rejected"; readonly rejection: CommandRejection; readonly revision: number }
	| { readonly type: "error"; readonly message: string };

/** HTTP response from weiqi-backend when a seat is created or claimed. */
export interface SeatGrant {
	readonly gameId: string;
	readonly color: Color;
	readonly seatToken: string;
	readonly game: PublicGameSnapshot;
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
	typeof value === "object" && value !== null && !Array.isArray(value);
const isColor = (value: unknown): value is Color => value === "Black" || value === "White";
const isCount = (value: unknown): value is number => Number.isSafeInteger(value) && (value as number) >= 0;
const isPoint = (value: unknown): value is Point =>
	isRecord(value) && Number.isInteger(value.x) && Number.isInteger(value.y);
const isMove = (value: unknown): value is Move =>
	isRecord(value) && isColor(value.color) && (value.type === "pass" || (value.type === "play" && isPoint(value.point)));

/** Checks the fields the client relies on; the rest is trusted as server output. */
export function isGameSnapshot(value: unknown): value is PublicGameSnapshot {
	if (!isRecord(value)) return false;
	const { id, revision, config, seats, phase, moves } = value;
	return (
		typeof id === "string" &&
		isCount(revision) &&
		isRecord(config) &&
		[9, 13, 19].includes(config.boardSize as number) &&
		isColor(config.startingPlayer) &&
		isRecord(config.rules) &&
		isRecord(seats) &&
		isRecord(phase) &&
		typeof phase.kind === "string" &&
		Array.isArray(moves) &&
		moves.every((entry) => isRecord(entry) && isMove(entry.move))
	);
}

export function parseServerMessage(text: string): ServerMessage | null {
	let value: unknown;
	try {
		value = JSON.parse(text);
	} catch {
		return null;
	}
	if (!isRecord(value)) return null;
	switch (value.type) {
		case "joined":
			return isColor(value.color) && typeof value.seatToken === "string" && isGameSnapshot(value.game)
				? (value as ServerMessage)
				: null;
		case "state":
			return isGameSnapshot(value.game) ? (value as ServerMessage) : null;
		case "rejected":
			return isRecord(value.rejection) && typeof value.rejection.reason === "string" && isCount(value.revision)
				? (value as ServerMessage)
				: null;
		case "error":
			return typeof value.message === "string" ? (value as ServerMessage) : null;
		default:
			return null;
	}
}
