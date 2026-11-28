import type { BoardApi, BoardSize, Intersection, Stone, StoneColor } from "weiqi-board";
import { samePoint } from "weiqi-board";
import type { EngineColor, EngineMove, EnginePosition, IllegalMoveReason, Point } from "./bindings";
import i18n from "@/i18n";

export const columnLabels = "ABCDEFGHJKLMNOPQRST";

const illegalMoveKeys = {
	OutOfBounds: "game:errors.illegalMove.outOfBounds",
	Occupied: "game:errors.illegalMove.occupied",
	WrongPlayer: "game:errors.illegalMove.wrongPlayer",
	Suicide: "game:errors.illegalMove.suicide",
	Ko: "game:errors.illegalMove.ko",
	Superko: "game:errors.illegalMove.superko",
	GameEnded: "game:errors.illegalMove.gameEnded",
} as const satisfies Record<IllegalMoveReason, string>;

export const illegalMoveMessage = (reason: IllegalMoveReason): string => i18n.t(illegalMoveKeys[reason]);

export const toStoneColor = (color: EngineColor): StoneColor => (color === "Black" ? "black" : "white");
export const toEngineColor = (color: StoneColor): EngineColor => (color === "black" ? "Black" : "White");
export const toPoint = (point: Intersection): Point => ({ x: point.column, y: point.row });
export const toIntersection = (point: Point): Intersection => ({ column: point.x, row: point.y });

export function moveLabel(move: EngineMove, boardSize: number): string {
	return move.type === "pass" ? "Pass" : `${columnLabels[move.point.x]}${boardSize - move.point.y}`;
}

export function stonesFromCells(position: EnginePosition, boardSize: number): Stone[] {
	const stones: Stone[] = [];
	position.board.cells.forEach((color, index) => {
		if (color !== "Empty")
			stones.push(
				Object.freeze({
					column: index % boardSize,
					row: Math.floor(index / boardSize),
					color: toStoneColor(color),
				}),
			);
	});
	return stones;
}

export interface BoardView {
	readonly boardSize: BoardSize;
	readonly stones: readonly Stone[];
	readonly turnColor: StoneColor;
	readonly lastMove: Readonly<Intersection> | null;
	readonly readOnly: boolean;
}

/** Pushes the view into the board only when it differs. Never calls the engine or emits a move. */
export function reconcileBoard(board: BoardApi, view: BoardView): void {
	const current = board.getState();
	const { lastMove } = view;
	const sameLastMove =
		current.lastMove === null ? lastMove === null : lastMove !== null && samePoint(current.lastMove, lastMove);
	const stones = new Map(view.stones.map((stone) => [`${stone.column},${stone.row}`, stone.color]));
	const sameStones =
		current.stones.length === stones.size &&
		current.stones.every((stone) => stones.get(`${stone.column},${stone.row}`) === stone.color);
	if (
		sameStones &&
		sameLastMove &&
		current.turnColor === view.turnColor &&
		current.readOnly === view.readOnly &&
		current.boardSize === view.boardSize
	)
		return;
	board.set({
		boardSize: view.boardSize,
		stones: view.stones,
		turnColor: view.turnColor,
		lastMove,
		readOnly: view.readOnly,
	});
}
