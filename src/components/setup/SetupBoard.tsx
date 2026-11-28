import { useEffect, useState } from "react";
import { createBoardGeometry, welcomeBoardGeometry } from "weiqi-board";
import type { BoardSize } from "weiqi-board";
import { useTranslation } from "react-i18next";
import { AnimatedBoardScene } from "@/components/board/AnimatedBoardScene";
import { boardLoopSeconds, welcomeMoves } from "@/data/welcomeScene";
import { usePreferences } from "@/hooks/usePreferences";
import { PlayerPlaceholder } from "./PlayerPlaceholder";
import type { AnimatedBoardMove } from "@/types/boardScene.ts";

const noMoves: AnimatedBoardMove[] = [];

/** Previews the chosen board size in the player's board and stone style; the demo game only fits the 19 × 19 board. */
export function SetupBoard({ mode, boardSize }: { mode: "local" | "online"; boardSize: BoardSize }) {
	const { t } = useTranslation("setup");
	const { preferences } = usePreferences();
	const [visible, setVisible] = useState(() => !window.matchMedia("(max-width: 46rem)").matches);
	useEffect(() => {
		const query = window.matchMedia("(max-width: 46rem)");
		const update = () => setVisible(!query.matches);
		update();
		query.addEventListener("change", update);
		return () => query.removeEventListener("change", update);
	}, []);
	return visible ? (
		<div className="setup-board">
			<PlayerPlaceholder name={mode === "local" ? t("players.player2") : t("players.opponent")} />
			<AnimatedBoardScene
				boardTheme={preferences.boardTheme}
				stoneStyle={preferences.stoneStyle}
				geometry={boardSize === 19 ? welcomeBoardGeometry : createBoardGeometry(boardSize)}
				moves={boardSize === 19 ? welcomeMoves : noMoves}
				duration={boardLoopSeconds}
				paused={false}
				reducedMotion={false}
				showCaption={false}
			/>
			<PlayerPlaceholder name={mode === "local" ? t("players.player1") : t("players.guest")} />
		</div>
	) : null;
}
