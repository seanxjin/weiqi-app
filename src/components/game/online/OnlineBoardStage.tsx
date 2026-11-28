import { useLayoutEffect, useMemo, useRef } from "react";
import type { BoardApi, MovableConfig, PremovableConfig } from "weiqi-board";
import { createBoardGeometry } from "weiqi-board";
import { Board, BoardCoordinates } from "@/components/board";
import type { BoardProps } from "@/components/board/Board";
import type { OnlineGameController, OnlineGameSnapshot } from "@/controllers/OnlineGameController";

type Props = Pick<BoardProps, "boardTheme" | "stoneStyle"> & {
	showCoordinates: boolean;
	showLastMove: boolean;
	snapshot: OnlineGameSnapshot;
	controller: OnlineGameController;
};
const premovable: PremovableConfig = { enabled: false };
export function OnlineBoardStage({ showCoordinates, showLastMove, snapshot, controller, ...appearance }: Props) {
	const board = useRef<BoardApi | null>(null);
	const { boardSize, myColor, legalPoints } = snapshot;
	// biome-ignore lint/correctness/useExhaustiveDependencies: every new snapshot must be reconciled into the board.
	useLayoutEffect(() => {
		if (!board.current) return;
		board.current.cancelPremove();
		controller.reconcile(board.current);
	}, [controller, snapshot]);
	// Only legal points are listed, so hover, ghost stones and clicks never offer an illegal move.
	const movable = useMemo<MovableConfig>(
		() => ({ color: myColor, free: false, dests: new Map([[myColor, legalPoints]]) }),
		[myColor, legalPoints],
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
				readOnly={!snapshot.canPlay}
				onPlace={(point, color) => {
					if (board.current) controller.play(point, color, board.current);
				}}
			/>
			{showCoordinates && <BoardCoordinates geometry={geometry} boardTheme={appearance.boardTheme} />}
		</div>
	);
}
