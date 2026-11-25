export type EngineColor = "Black" | "White";
type Cell = EngineColor | "Empty";
export type Point = { x: number; y: number };
export type EngineMove = { type: "play"; color: EngineColor; point: Point } | { type: "pass"; color: EngineColor };

export interface EngineRules {
	superko: "None" | "Positional" | "Situational";
	suicide: "Forbidden" | "MultiStoneOnly" | "Allowed";
	passEnding: "TwoConsecutivePasses" | "NoAutomaticEnd";
}

export interface EngineMoveRecord {
	move: EngineMove;
	capturedStones: Point[];
	selfCapturedStones: Point[];
}

export interface EnginePosition {
	board: { size: number; cells: Cell[] };
	currentPlayer: EngineColor;
	moveNumber: number;
	consecutivePasses: number;
	koPoint: Point | null;
}

export type IllegalMoveReason = "OutOfBounds" | "Occupied" | "WrongPlayer" | "Suicide" | "Ko" | "GameEnded" | "Superko";

export type EngineMoveResult = { ok: true; nextPosition: EnginePosition } | { ok: false; reason: IllegalMoveReason };

export interface EngineGame {
	play(move: EngineMove): EngineMoveResult;
	pass(): EngineMoveResult;
	turn(): EngineColor;
	/** Legal placements for the side to move in row-major order; excludes pass, empty once ended. */
	moves(): EngineMove[];
	status(): "Playing" | "Ended";
	undo(): EngineMoveRecord | null;
	history(): EngineMoveRecord[];
	positions(): EnginePosition[];
	delete(): void;
}

export interface EngineModule {
	Game: new (config: { boardSize: number; startingPlayer: EngineColor; rules: EngineRules }) => EngineGame;
}

export type EngineFactory = (options: { locateFile(path: string, prefix: string): string }) => Promise<EngineModule>;
