import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import type { BoardConfig } from "weiqi-board";
import type { OnlineGameController, OnlineGameSnapshot } from "@/controllers/OnlineGameController";
import { usePreferences } from "@/hooks/usePreferences";
import { OnlineBoardStage } from "./OnlineBoardStage";
import { OnlineGameActions } from "./OnlineGameActions";
import { OnlineMoveHistory } from "./OnlineMoveHistory";
import { OnlinePlayers } from "./OnlinePlayers";
import "@/styles/local-board.css";
import "@/styles/online-board.css";

type Props = Pick<BoardConfig, "size"> & {
	snapshot: OnlineGameSnapshot;
	controller: OnlineGameController;
};

function isTyping(target: EventTarget | null): boolean {
	return (
		target instanceof HTMLElement &&
		(target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName))
	);
}

/** History keys as on Lichess: ← → step, ↑/Home first, ↓/End current. */
function useHistoryKeys(controller: OnlineGameController) {
	useEffect(() => {
		const actions: Record<string, () => void> = {
			ArrowLeft: controller.previous,
			ArrowRight: controller.next,
			ArrowUp: controller.first,
			Home: controller.first,
			ArrowDown: controller.last,
			End: controller.last,
		};
		const onKeyDown = (event: KeyboardEvent) => {
			const action = actions[event.key];
			if (!action || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey || isTyping(event.target)) return;
			event.preventDefault();
			action();
		};
		window.addEventListener("keydown", onKeyDown);
		return () => window.removeEventListener("keydown", onKeyDown);
	}, [controller]);
}

export function OnlineBoard({ snapshot, controller, size }: Props) {
	const { t } = useTranslation("game");
	const { preferences } = usePreferences();
	useHistoryKeys(controller);
	return (
		<section className="local-game" aria-label={t("online.label")}>
			<div className="local-game__playing-area" style={{ maxWidth: size }}>
				<OnlineBoardStage
					boardTheme={preferences.boardTheme}
					stoneStyle={preferences.stoneStyle}
					showCoordinates={preferences.coordinates}
					showLastMove={preferences.showLastMove}
					snapshot={snapshot}
					controller={controller}
				/>
				<div className="local-game__feedback">
					<p className="local-game__error" role="alert">
						{snapshot.error}
					</p>
				</div>
			</div>
			<OnlinePlayers snapshot={snapshot} controller={controller} stoneStyle={preferences.stoneStyle} />
			<div className="local-game__sidebar">
				<OnlineGameActions snapshot={snapshot} controller={controller} />
				<OnlineMoveHistory snapshot={snapshot} onView={controller.viewMove} />
			</div>
		</section>
	);
}
