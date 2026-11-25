import type { BoardApi, BoardSize, Intersection, Stone, StoneColor } from "weiqi-board";
import type { EngineGame, EngineModule, EnginePosition } from "../bindings";
import {
	illegalMoveMessages,
	moveLabel,
	reconcileBoard,
	stonesFromCells,
	toIntersection,
	toPoint,
	toStoneColor,
} from "../moveHelpers";
import type { ConnectionStatus } from "./gameSocket";
import type {
	ClientMessage,
	Color,
	CommandRejection,
	GameConfig,
	GamePhase,
	Point,
	PublicGameSnapshot,
	Seats,
	ServerMessage,
} from "./protocol";
import { planSync } from "./syncPlan";

export interface OnlineMove {
	readonly number: number;
	readonly color: StoneColor;
	readonly label: string;
	readonly point: Readonly<Intersection> | null;
	readonly captureCount: number;
	/** Applied optimistically and not yet confirmed by the server. */
	readonly pending: boolean;
}

export interface OnlineGameSnapshot {
	readonly connection: ConnectionStatus;
	readonly gameId: string;
	readonly myColor: StoneColor;
	readonly phase: GamePhase;
	/** Last revision confirmed by the server. */
	readonly revision: number;
	readonly seats: Seats;
	readonly config: GameConfig;
	readonly boardSize: BoardSize;
	readonly stones: readonly Stone[];
	readonly turnColor: StoneColor;
	readonly lastMove: Readonly<Intersection> | null;
	readonly captures: Readonly<Record<StoneColor, number>>;
	readonly moves: readonly OnlineMove[];
	readonly latestMoveIndex: number;
	readonly viewedMoveIndex: number;
	readonly legalPoints: readonly Intersection[];
	readonly canPlay: boolean;
	readonly canPass: boolean;
	readonly canResign: boolean;
	readonly canAbort: boolean;
	readonly error: string | null;
}

type MoveCommand = { readonly type: "play"; readonly point: Point } | { readonly type: "pass" };
type Command = MoveCommand | { readonly type: "resign" | "abort" };
type PendingCommand = Command & { readonly baseRevision: number };

export interface OnlineGameOptions {
	readonly game: PublicGameSnapshot;
	readonly myColor: Color;
	readonly send: (message: ClientMessage) => boolean;
	/** Fetches a full snapshot and passes it to `onServerGame`. */
	readonly requestResync: () => void;
}

const rejectionMessages: Record<Exclude<CommandRejection["reason"], "illegalMove">, string> = {
	staleRevision: "The game changed before your move arrived, so it was not played.",
	wrongPhase: "That isn’t possible at this stage of the game.",
	seatTaken: "That seat is already taken.",
	notYourTurn: "It is the other player’s turn.",
	abortUnavailable: "The game can no longer be aborted.",
};

export class OnlineGameController {
	private readonly module: EngineModule;
	private readonly myColor: Color;
	private readonly send: OnlineGameOptions["send"];
	private readonly requestResync: () => void;
	private readonly listeners = new Set<() => void>();
	private engine: EngineGame;
	/** The last state the server confirmed; optimistic moves roll back to it. */
	private confirmed: PublicGameSnapshot;
	private pending: PendingCommand | null = null;
	private positions: EnginePosition[] = [];
	private moves: readonly OnlineMove[] = [];
	private viewed = 0;
	private connection: ConnectionStatus = "connecting";
	private disposed = false;
	private snapshot!: OnlineGameSnapshot;

	constructor(module: EngineModule, options: OnlineGameOptions) {
		this.module = module;
		this.myColor = options.myColor;
		this.send = options.send;
		this.requestResync = options.requestResync;
		this.confirmed = options.game;
		this.engine = this.createEngine(options.game);
		this.refreshHistory();
		this.viewed = this.positions.length - 1;
		this.publish();
	}

	getSnapshot = (): OnlineGameSnapshot => this.snapshot;

	subscribe = (listener: () => void): (() => void) => {
		if (this.disposed) return () => {};
		this.listeners.add(listener);
		return () => {
			this.listeners.delete(listener);
		};
	};

	/** The board has already committed the stone before this event arrives; see LocalGameController.play. */
	play = (point: Intersection, color: StoneColor, board: BoardApi): void => {
		try {
			if (color === this.snapshot.myColor) this.submitMove({ type: "play", point: toPoint(point) });
		} finally {
			this.reconcile(board);
		}
	};

	pass = (): void => this.submitMove({ type: "pass" });

	resign = (): void => {
		if (!this.disposed && this.snapshot.canResign) this.submit({ type: "resign" });
	};

	abort = (): void => {
		if (!this.disposed && this.snapshot.canAbort) this.submit({ type: "abort" });
	};

	viewMove = (index: number): void => {
		if (this.disposed || !Number.isInteger(index) || index < 0 || index >= this.positions.length) return;
		if (index === this.viewed && this.snapshot.error === null) return;
		this.viewed = index;
		this.publish();
	};

	first = (): void => this.viewMove(0);
	previous = (): void => this.viewMove(this.viewed - 1);
	next = (): void => this.viewMove(this.viewed + 1);
	last = (): void => this.viewMove(this.positions.length - 1);

	reconcile = (board: BoardApi): void => {
		const { boardSize, stones, turnColor, lastMove, canPlay } = this.snapshot;
		reconcileBoard(board, { boardSize, stones, turnColor, lastMove, readOnly: !canPlay });
	};

	onMessage = (message: ServerMessage): void => {
		if (this.disposed) return;
		try {
			switch (message.type) {
				case "joined":
					// A new connection: anything still pending was never received on the old socket.
					this.applyServerGame(message.game, true);
					break;
				case "state":
					this.applyServerGame(message.game, false);
					break;
				case "rejected":
					this.rollback(this.rejectionMessage(message.rejection));
					// Messages arrive in order, so a newer revision here means we missed a state.
					if (message.revision > this.confirmed.revision) this.requestResync();
					break;
				case "error":
					this.rollback(message.message);
					break;
			}
		} catch (error) {
			console.error(error);
			this.publish("This game could not be replayed locally. Please reload the page.");
		}
	};

	/** Applies a snapshot fetched over HTTP. A command sent since then is still answered on the socket. */
	onResync = (game: PublicGameSnapshot): void => {
		if (this.disposed) return;
		try {
			this.applyServerGame(game, this.pending === null);
		} catch (error) {
			console.error(error);
			this.publish("This game could not be replayed locally. Please reload the page.");
		}
	};

	onConnection = (status: ConnectionStatus): void => {
		if (this.disposed || status === this.connection) return;
		this.connection = status;
		this.publish(this.snapshot.error);
	};

	dispose = (): void => {
		if (this.disposed) return;
		this.disposed = true;
		this.listeners.clear();
		this.engine.delete();
	};

	/** The server always wins. `sameRevision` also accepts a snapshot at the confirmed revision. */
	private applyServerGame(game: PublicGameSnapshot, sameRevision: boolean): void {
		const { revision } = this.confirmed;
		if (game.id !== this.confirmed.id || game.revision < revision || (game.revision === revision && !sameRevision))
			return;
		const atLatest = this.viewed === this.positions.length - 1;
		this.confirmed = game;
		this.pending = null;
		this.syncEngineTo(game);
		const latest = this.positions.length - 1;
		// As on Lichess, a player reviewing history stays on the move they are looking at.
		this.viewed = atLatest ? latest : Math.min(this.viewed, latest);
		this.publish();
	}

	private submitMove(command: MoveCommand): void {
		if (this.disposed || !this.snapshot.canPlay) return;
		const result =
			command.type === "play"
				? this.engine.play({ type: "play", color: this.myColor, point: command.point })
				: this.engine.pass();
		if (!result.ok) {
			this.publish(illegalMoveMessages[result.reason]);
			return;
		}
		this.refreshHistory(true);
		this.viewed = this.positions.length - 1;
		this.submit(command);
	}

	private submit(command: Command): void {
		const expectedRevision = this.confirmed.revision;
		this.pending = { ...command, baseRevision: expectedRevision };
		this.publish();
		if (!this.send({ ...command, expectedRevision })) this.rollback("Not connected to the game server.");
	}

	/** Drops any optimistic change and returns to the last confirmed state. */
	private rollback(error: string): void {
		this.pending = null;
		this.syncEngineTo(this.confirmed);
		this.viewed = Math.min(this.viewed, this.positions.length - 1);
		this.publish(error);
	}

	private syncEngineTo(game: PublicGameSnapshot): void {
		const server = game.moves.map(({ move }) => move);
		const plan = planSync(
			this.engine.history().map(({ move }) => move),
			server,
		);
		if (plan.kind === "append" && !server.slice(plan.from).every((move) => this.engine.play(move).ok))
			this.rebuildEngine(game);
		else if (plan.kind === "rebuild") this.rebuildEngine(game);
		this.refreshHistory();
	}

	private rebuildEngine(game: PublicGameSnapshot): void {
		const engine = this.createEngine(game);
		this.engine.delete();
		this.engine = engine;
	}

	/** Client and server must agree on rules, so the engine is always built from the server's config. */
	private createEngine(game: PublicGameSnapshot): EngineGame {
		const { boardSize, startingPlayer, rules } = game.config;
		const engine = new this.module.Game({ boardSize, startingPlayer, rules });
		for (const { move, moveNumber } of game.moves) {
			if (engine.play(move).ok) continue;
			engine.delete();
			throw new Error(`Server move ${moveNumber} could not be replayed locally.`);
		}
		return engine;
	}

	private refreshHistory(includesPending = false): void {
		const confirmedCount = this.confirmed.moves.length;
		const size = this.confirmed.config.boardSize;
		this.positions = this.engine.positions();
		this.moves = Object.freeze(
			this.engine.history().map(({ move, capturedStones }, index) =>
				Object.freeze({
					number: index + 1,
					color: toStoneColor(move.color),
					label: moveLabel(move, size),
					point: move.type === "pass" ? null : Object.freeze(toIntersection(move.point)),
					captureCount: capturedStones.length,
					pending: includesPending && index >= confirmedCount,
				}),
			),
		);
	}

	private rejectionMessage(rejection: CommandRejection): string {
		return rejection.reason === "illegalMove"
			? `The server rejected the move. ${illegalMoveMessages[rejection.illegalMoveReason]}`
			: rejectionMessages[rejection.reason];
	}

	private publish(error: string | null = null): void {
		const game = this.confirmed;
		const latest = this.positions.length - 1;
		const position = this.positions[this.viewed];
		const phase = game.phase.kind;
		const idle = this.connection === "open" && this.pending === null;
		const canPlay =
			idle && phase === "playing" && this.positions[latest].currentPlayer === this.myColor && this.viewed === latest;
		const captures = { black: 0, white: 0 };
		for (const move of this.moves.slice(0, this.viewed)) captures[move.color] += move.captureCount;
		this.snapshot = Object.freeze({
			connection: this.connection,
			gameId: game.id,
			myColor: toStoneColor(this.myColor),
			phase: game.phase,
			revision: game.revision,
			seats: game.seats,
			config: game.config,
			boardSize: game.config.boardSize,
			stones: Object.freeze(stonesFromCells(position, game.config.boardSize)),
			turnColor: toStoneColor(position.currentPlayer),
			lastMove: this.moves[this.viewed - 1]?.point ?? null,
			captures: Object.freeze(captures),
			moves: this.moves,
			latestMoveIndex: latest,
			viewedMoveIndex: this.viewed,
			legalPoints: Object.freeze(
				canPlay
					? this.engine.moves().flatMap((move) => (move.type === "play" ? [toIntersection(move.point)] : []))
					: [],
			),
			canPlay,
			canPass: canPlay,
			canResign: idle && (phase === "playing" || phase === "awaitingScoring"),
			canAbort:
				idle &&
				(phase === "awaitingPlayers" || phase === "awaitingScoring" || (phase === "playing" && game.moves.length < 2)),
			error,
		});
		for (const listener of this.listeners) listener();
	}
}
