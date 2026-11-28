import { useLayoutEffect, useMemo, useRef } from "react";
import { createBoardGeometry } from "weiqi-board";
import type { BoardApi, BoardSize, Intersection, MovableConfig, PremovableConfig } from "weiqi-board";
import { Board, BoardCoordinates } from "@/components/board";
import type { BoardProps } from "@/components/board/Board";
import type { LocalGameController, LocalGameSnapshot } from "@/controllers/LocalGameController";

type Props = Pick<BoardProps, "boardTheme" | "stoneStyle"> & {
	showCoordinates: boolean;
	showLastMove: boolean;
	boardSize: BoardSize;
	snapshot: LocalGameSnapshot | null;
	controller?: LocalGameController;
};
const premovable: PremovableConfig = { enabled: false };
const noLegalPoints: readonly Intersection[] = [];

export function LocalBoardStage({
	showCoordinates,
	showLastMove,
	boardSize,
	snapshot,
	controller,
	...appearance
}: Props) {
	const board = useRef<BoardApi | null>(null);
	useLayoutEffect(() => {
		if (!board.current) return;
		board.current.cancelPremove();
		controller?.reconcile(board.current);
	}, [controller, snapshot]);
	const turnColor = snapshot?.turnColor ?? "black";
	const legalPoints = snapshot?.legalPoints ?? noLegalPoints;
	// Only legal points are listed, so hover, ghost stones and clicks never offer an illegal move.
	const movable = useMemo<MovableConfig>(
		() => ({ color: turnColor, free: false, dests: new Map([[turnColor, legalPoints]]) }),
		[turnColor, legalPoints],
	);
	const geometry = useMemo(
		() => ({
			...createBoardGeometry(boardSize),
			size: 744,
			inset: 48,
			spacing: 648 / (boardSize - 1),
			lineWidth: 0.7,
			edgeWidth: 0.7,
			starRadius: 2.5,
		}),
		[boardSize],
	);
	return (
		<div className="local-game__board-stage" data-last-move={showLastMove ? "shown" : "hidden"}>
			<Board
				{...appearance}
				ref={board}
				boardSize={boardSize}
				geometry={geometry}
				movable={movable}
				premovable={premovable}
				readOnly={!snapshot?.canPlay}
				onPlace={(point, color) => {
					if (board.current) controller?.play(point, color, board.current);
				}}
			/>
			{showCoordinates && <BoardCoordinates geometry={geometry} boardTheme={appearance.boardTheme} />}
		</div>
	);
}
