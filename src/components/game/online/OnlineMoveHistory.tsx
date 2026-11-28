import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import blackKey from "@/assets/icons/game/black-key.svg";
import previous from "@/assets/icons/game/chevron-left.svg";
import next from "@/assets/icons/game/chevron-right.svg";
import currentMove from "@/assets/icons/game/current-move.svg";
import headingDivider from "@/assets/icons/game/heading-divider.svg";
import skipBack from "@/assets/icons/game/skip-back.svg";
import skipForward from "@/assets/icons/game/skip-forward.svg";
import whiteKey from "@/assets/icons/game/white-key.svg";
import type { OnlineGameSnapshot, OnlineMove } from "@/controllers/OnlineGameController";

interface Props {
	snapshot: OnlineGameSnapshot;
	onView: (index: number) => void;
}

/** The local MoveHistoryPanel experience without Undo; optimistic moves are marked as pending. */
export function OnlineMoveHistory({ snapshot, onView }: Props) {
	const { t } = useTranslation("game");
	const scroll = useRef<HTMLDivElement>(null);
	const { viewedMoveIndex: viewed, latestMoveIndex: latest, moves } = snapshot;
	// biome-ignore lint/correctness/useExhaustiveDependencies: keeps the viewed move scrolled into view whenever it changes.
	useEffect(() => {
		const panel = scroll.current;
		const selected = panel?.querySelector<HTMLElement>('[aria-current="step"]');
		if (!panel) return;
		if (!selected) {
			panel.scrollTop = 0;
			return;
		}
		const bounds = selected.getBoundingClientRect();
		const visible = panel.getBoundingClientRect();
		const headerHeight = panel.querySelector("thead")?.getBoundingClientRect().height ?? 0;
		if (bounds.top < visible.top + headerHeight) panel.scrollTop -= visible.top + headerHeight - bounds.top;
		else if (bounds.bottom > visible.bottom) panel.scrollTop += bounds.bottom - visible.bottom;
	}, [viewed, latest]);

	const navigation = [
		{ label: t("history.navigation.start"), icon: skipBack, index: 0, disabled: viewed === 0 },
		{ label: t("history.navigation.previous"), icon: previous, index: viewed - 1, disabled: viewed === 0 },
		{ label: t("history.navigation.next"), icon: next, index: viewed + 1, disabled: viewed === latest },
		{ label: t("history.navigation.current"), icon: skipForward, index: latest, disabled: viewed === latest },
	];
	const pairs = Array.from({ length: Math.ceil(moves.length / 2) }, (_, pair) => ({
		number: pair + 1,
		moves: [moves[pair * 2], moves[pair * 2 + 1]] as const,
	}));
	const moveButton = (move: OnlineMove | undefined) =>
		move && (
			<button
				type="button"
				className={move.pending ? "online-game__pending-move" : undefined}
				aria-current={viewed === move.number ? "step" : undefined}
				aria-label={t(move.pending ? "history.pendingMove" : "history.move", {
					number: move.number,
					color: t(`colors.${move.color}`),
					move: move.point ? move.label : t("pass"),
				})}
				onClick={() => onView(move.number)}
			>
				{move.point ? move.label : t("pass")}
				{viewed === move.number && <img src={currentMove} alt="" />}
			</button>
		);

	return (
		<aside className="local-game__history" aria-label={t("history.label")}>
			<div className="local-game__history-heading">
				<h2>{t("history.heading")}</h2>
				<span>{t("history.moveCount", { count: latest })}</span>
			</div>
			<img className="local-game__heading-divider" src={headingDivider} alt="" />
			<div className="local-game__move-scroll" ref={scroll}>
				<table className="local-game__move-table" aria-label={t("history.tableLabel")}>
					<colgroup>
						<col className="local-game__pair-column" />
						<col />
						<col />
					</colgroup>
					<thead>
						<tr>
							<th scope="col">
								<span aria-hidden="true">#</span>
								<span className="local-game__sr-only">{t("history.pair")}</span>
							</th>
							<th scope="col">
								<span>
									<img className="stone-key" src={blackKey} alt="" />
									{t("colors.black")}
								</span>
							</th>
							<th scope="col">
								<span>
									<img className="stone-key" src={whiteKey} alt="" />
									{t("colors.white")}
								</span>
							</th>
						</tr>
					</thead>
					<tbody>
						{pairs.map((pair) => (
							<tr key={pair.number}>
								<th scope="row">{pair.number}.</th>
								<td>{moveButton(pair.moves[0])}</td>
								<td>{moveButton(pair.moves[1])}</td>
							</tr>
						))}
						{!moves.length && (
							<tr>
								<td colSpan={3} className="local-game__empty">
									{t("history.empty")}
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>
			<div className="local-game__review-controls">
				<div className="local-game__position" role="status" aria-live="polite" aria-atomic="true">
					<span>{t("history.position", { viewed, latest })}</span>
					<span>{viewed === latest ? t("history.currentPosition") : t("history.reviewing")}</span>
				</div>
				<nav className="local-game__navigation" aria-label={t("history.navigationLabel")}>
					{navigation.map((control) => (
						<div key={control.label}>
							<button
								type="button"
								aria-label={control.label}
								disabled={control.disabled}
								onClick={() => onView(control.index)}
							>
								<img className="directional-icon" src={control.icon} alt="" />
							</button>
							<span aria-hidden="true">{control.label}</span>
						</div>
					))}
				</nav>
				<p className="local-game__encouragement">{t("history.keyboardHint")}</p>
			</div>
		</aside>
	);
}
