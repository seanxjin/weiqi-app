import { useTranslation } from "react-i18next";
import type { BoardConfig } from "weiqi-board";
import { useLocalGame } from "@/hooks/useLocalGame";
import { usePreferences } from "@/hooks/usePreferences";
import { LocalPlayers } from "./LocalPlayers";
import { LocalBoardStage } from "./LocalBoardStage";
import { MoveHistoryPanel } from "./MoveHistoryPanel";
import "@/styles/local-board.css";

export type LocalBoardProps = Pick<BoardConfig, "size" | "boardSize">;

export function LocalBoard({ boardSize = 19, size }: LocalBoardProps) {
	return <LocalGameBoard key={boardSize} size={size} boardSize={boardSize} />;
}

function LocalGameBoard({ boardSize = 19, size }: LocalBoardProps) {
	const { t } = useTranslation(["game", "common"]);
	const { preferences } = usePreferences();
	const { controller, snapshot, error, retry } = useLocalGame(boardSize);
	return (
		<section className="local-game" aria-label={t("game:local.label")}>
			<div className="local-game__playing-area" style={{ maxWidth: size }}>
				<LocalBoardStage
					boardTheme={preferences.boardTheme}
					stoneStyle={preferences.stoneStyle}
					showCoordinates={preferences.coordinates}
					showLastMove={preferences.showLastMove}
					boardSize={boardSize}
					snapshot={snapshot}
					controller={controller}
				/>
				<div className="local-game__feedback">
					<p role="status" aria-live="polite">
						{error ?? (!snapshot ? t("game:local.loadingEngine") : "")}
					</p>
					{error && (
						<button type="button" onClick={retry}>
							{t("common:actions.retry")}
						</button>
					)}
					<p className="local-game__error" role="alert">
						{snapshot?.error}
					</p>
				</div>
			</div>
			<LocalPlayers snapshot={snapshot} controller={controller} stoneStyle={preferences.stoneStyle} />
			<div className="local-game__sidebar">
				<MoveHistoryPanel snapshot={snapshot} onView={controller?.viewMove} onUndo={controller?.undo} />
			</div>
		</section>
	);
}
