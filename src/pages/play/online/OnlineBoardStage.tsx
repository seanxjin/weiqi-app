import { useLayoutEffect, useMemo, useRef } from "react";
import type { BoardApi, MovableConfig, PremovableConfig } from "weiqi-board";
import { createBoardGeometry } from "weiqi-board";
import lastMoveSymbol from "../../../assets/local-game/last-move-symbol.svg";
import turnMarker from "../../../assets/local-game/turn-marker.svg";
import { Board } from "../../../components/board";
import type { BoardProps } from "../../../components/board/Board";
import { columnLabels } from "../../../game/moveHelpers";
import type { OnlineGameController, OnlineGameSnapshot } from "../../../game/online/OnlineGameController";

type Props = Pick<BoardProps, "boardTheme" | "stoneStyle"> & {
	snapshot: OnlineGameSnapshot;
	controller: OnlineGameController;
};
const premovable: PremovableConfig = { enabled: false };
const colorName = (color: string) => (color === "black" ? "Black" : "White");

function turnText(snapshot: OnlineGameSnapshot): string {
	if (snapshot.viewedMoveIndex !== snapshot.latestMoveIndex) return "Reviewing · Return to Current to play";
	switch (snapshot.phase.kind) {
		case "awaitingPlayers":
			return "Waiting for an opponent";
		case "awaitingScoring":
			return "Play has ended · Scoring isn’t supported yet";
		case "finished":
			return "Game over";
		case "playing":
			if (snapshot.moves.at(-1)?.pending) return "Sending move…";
			if (snapshot.connection !== "open") return "Waiting for connection";
			return snapshot.turnColor === snapshot.myColor ? "Your move" : `${colorName(snapshot.turnColor)} to play`;
	}
}

export function OnlineBoardStage({ snapshot, controller, ...appearance }: Props) {
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
	const lastMove = snapshot.moves[snapshot.viewedMoveIndex - 1];
	return (
		<>
			<div className="local-game__board-stage">
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
				<svg className="local-game__board-overlay" viewBox="0 0 744 744" aria-hidden="true" focusable="false">
					<g className="local-game__coordinates">
						{Array.from({ length: boardSize }, (_, index) => {
							const coordinate = geometry.inset + index * geometry.spacing;
							return (
								<g key={columnLabels[index]}>
									<text x={coordinate} y={22}>
										{columnLabels[index]}
									</text>
									<text x={coordinate} y={722}>
										{columnLabels[index]}
									</text>
									<text x={22} y={coordinate}>
										{boardSize - index}
									</text>
									<text x={722} y={coordinate}>
										{boardSize - index}
									</text>
								</g>
							);
						})}
					</g>
				</svg>
			</div>
			<div className="local-game__board-footer">
				<p className="local-game__turn" role="status" aria-live="polite" aria-atomic="true">
					<img src={turnMarker} alt="" />
					{turnText(snapshot)}
				</p>
				<button className="local-game__pass" type="button" disabled={!snapshot.canPass} onClick={controller.pass}>
					Pass
				</button>
				<p className="local-game__last-move">
					<img src={lastMoveSymbol} alt="" />
					{lastMove ? `Last move: ${colorName(lastMove.color)} ${lastMove.label}` : "Starting position"}
				</p>
			</div>
		</>
	);
}
