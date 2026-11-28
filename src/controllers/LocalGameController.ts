import type { BoardApi, BoardSize, Intersection, Stone, StoneColor } from "weiqi-board";
import type { EngineGame, EngineModule, EngineMoveResult, EnginePosition } from "@/engine/bindings";
import {
	illegalMoveMessage,
	moveLabel,
	reconcileBoard,
	stonesFromCells,
	toEngineColor,
	toIntersection,
	toPoint,
	toStoneColor,
} from "@/engine/moveHelpers";

export interface LocalMove {
	readonly number: number;
	readonly color: StoneColor;
	readonly label: string;
	readonly point: Readonly<Intersection> | null;
	readonly captureCount: number;
}

export interface LocalGameSnapshot {
	readonly boardSize: BoardSize;
	readonly stones: readonly Stone[];
	readonly turnColor: StoneColor;
	readonly captures: Readonly<Record<StoneColor, number>>;
	readonly moves: readonly LocalMove[];
	readonly latestMoveIndex: number;
	readonly viewedMoveIndex: number;
	/** Legal placements for the side to move; empty whenever the board is not playable. */
	readonly legalPoints: readonly Intersection[];
	readonly canPlay: boolean;
	readonly canUndo: boolean;
	readonly error: string | null;
}

const noLegalPoints: readonly Intersection[] = Object.freeze([]);

export class LocalGameController {
	private readonly game: EngineGame;
	private readonly boardSize: BoardSize;
	private readonly listeners = new Set<() => void>();
	private positions: EnginePosition[] = [];
	private moves: readonly LocalMove[] = [];
	private legalPoints: readonly Intersection[] = noLegalPoints;
	private viewed = 0;
	private disposed = false;
	private snapshot!: LocalGameSnapshot;

	constructor(module: EngineModule, boardSize: BoardSize) {
		this.boardSize = boardSize;
		this.game = new module.Game({
			boardSize,
			startingPlayer: "Black",
			rules: { superko: "None", suicide: "Forbidden", passEnding: "NoAutomaticEnd" },
		});
		try {
			this.refresh();
		} catch (error) {
			this.game.delete();
			throw error;
		}
	}

	getSnapshot = (): LocalGameSnapshot => this.snapshot;

	subscribe = (listener: () => void): (() => void) => {
		if (this.disposed) return () => {};
		this.listeners.add(listener);
		return () => {
			this.listeners.delete(listener);
		};
	};

	/** The board has already committed the move and DOM before this event arrives. */
	play = (point: Intersection, color: StoneColor, board: BoardApi): void => {
		try {
			if (!this.disposed && this.snapshot.canPlay)
				this.accept(this.game.play({ type: "play", color: toEngineColor(color), point: toPoint(point) }));
		} finally {
			// Always check, even when a rejection leaves the authoritative position unchanged.
			this.reconcile(board);
		}
	};

	/** Reconciliation never calls the engine, emits a move, or advances the turn. */
	reconcile = (board: BoardApi): void => {
		const snapshot = this.snapshot;
		reconcileBoard(board, {
			boardSize: snapshot.boardSize,
			stones: snapshot.stones,
			turnColor: snapshot.turnColor,
			lastMove: snapshot.moves[snapshot.viewedMoveIndex - 1]?.point ?? null,
			readOnly: !snapshot.canPlay,
		});
	};

	pass = (): void => {
		if (!this.disposed && this.snapshot.canPlay) this.accept(this.game.pass());
	};

	undo = (): void => {
		if (this.disposed || !this.snapshot.canUndo) return;
		this.game.undo();
		this.refresh();
	};

	viewMove = (index: number): void => {
		if (this.disposed || !Number.isInteger(index) || index < 0 || index >= this.positions.length) return;
		if (index === this.viewed && this.snapshot.error === null) return;
		this.viewed = index;
		this.publish();
	};

	dispose = (): void => {
		if (this.disposed) return;
		this.disposed = true;
		this.listeners.clear();
		this.game.delete();
	};

	private accept(result: EngineMoveResult): void {
		if (result.ok) this.refresh();
		else this.publish(illegalMoveMessage(result.reason));
	}

	private refresh(): void {
		this.positions = this.game.positions();
		this.moves = Object.freeze(
			this.game.history().map(({ move, capturedStones }, index) =>
				Object.freeze({
					number: index + 1,
					color: toStoneColor(move.color),
					label: moveLabel(move, this.boardSize),
					point: move.type === "pass" ? null : Object.freeze(toIntersection(move.point)),
					captureCount: capturedStones.length,
				}),
			),
		);
		this.legalPoints = Object.freeze(
			this.game.moves().flatMap((move) => (move.type === "play" ? [Object.freeze(toIntersection(move.point))] : [])),
		);
		this.viewed = this.positions.length - 1;
		this.publish();
	}

	private publish(error: string | null = null): void {
		const position = this.positions[this.viewed];
		const stones = stonesFromCells(position, this.boardSize);
		const latest = this.positions.length - 1;
		const captures = { black: 0, white: 0 };
		for (let index = 0; index < this.viewed; index++) {
			const move = this.moves[index];
			captures[move.color] += move.captureCount;
		}
		const canPlay = this.viewed === latest;
		this.snapshot = Object.freeze({
			boardSize: this.boardSize,
			stones: Object.freeze(stones),
			turnColor: toStoneColor(position.currentPlayer),
			captures: Object.freeze(captures),
			moves: this.moves,
			latestMoveIndex: latest,
			viewedMoveIndex: this.viewed,
			legalPoints: canPlay ? this.legalPoints : noLegalPoints,
			canPlay,
			canUndo: latest > 0,
			error,
		});
		this.listeners.forEach((listener) => listener());
	}
}
