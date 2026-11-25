import { useEffect } from "react";
import type { BoardConfig } from "weiqi-board";
import type { OnlineGameController, OnlineGameSnapshot } from "../../../game/online/OnlineGameController";
import { OnlineBoardStage } from "./OnlineBoardStage";
import { OnlineGameActions } from "./OnlineGameActions";
import { OnlineMoveHistory } from "./OnlineMoveHistory";
import { OnlinePlayers } from "./OnlinePlayers";
import "../LocalBoard.css";
import "./OnlineBoard.css";

type Props = Pick<BoardConfig, "boardTheme" | "stoneStyle" | "size"> & {
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

export function OnlineBoard({ snapshot, controller, size, ...appearance }: Props) {
	useHistoryKeys(controller);
	return (
		<section className="local-game" aria-label="Online Go game">
			<div className="local-game__playing-area" style={{ maxWidth: size }}>
				<OnlinePlayers snapshot={snapshot} stoneStyle={appearance.stoneStyle} />
				<OnlineBoardStage {...appearance} snapshot={snapshot} controller={controller} />
				<OnlineGameActions snapshot={snapshot} controller={controller} />
				<div className="local-game__feedback">
					<p className="local-game__error" role="alert">
						{snapshot.error}
					</p>
				</div>
			</div>
			<OnlineMoveHistory snapshot={snapshot} onView={controller.viewMove} />
		</section>
	);
}
