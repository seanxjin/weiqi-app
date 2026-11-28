import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import type { LocalGameSnapshot } from "@/controllers/LocalGameController";
import headingDivider from "@/assets/icons/game/heading-divider.svg";
import blackKey from "@/assets/icons/game/black-key.svg";
import whiteKey from "@/assets/icons/game/white-key.svg";
import currentMove from "@/assets/icons/game/current-move.svg";
import skipBack from "@/assets/icons/game/skip-back.svg";
import previous from "@/assets/icons/game/chevron-left.svg";
import next from "@/assets/icons/game/chevron-right.svg";
import skipForward from "@/assets/icons/game/skip-forward.svg";
import undo from "@/assets/icons/game/undo.svg";

interface Props {
	snapshot: LocalGameSnapshot | null;
	onView?: (index: number) => void;
	onUndo?: () => void;
}

export function MoveHistoryPanel({ snapshot, onView, onUndo }: Props) {
	const { t } = useTranslation("game");
	const scroll = useRef<HTMLDivElement>(null);
	const viewed = snapshot?.viewedMoveIndex ?? 0;
	const latest = snapshot?.latestMoveIndex ?? 0;
	const moves = snapshot?.moves ?? [];
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
						{Array.from({ length: Math.ceil(moves.length / 2) }, (_, pair) => (
							<tr key={pair}>
								<th scope="row">{pair + 1}.</th>
								{[moves[pair * 2], moves[pair * 2 + 1]].map((move, column) => (
									<td key={column}>
										{move && (
											<button
												type="button"
												aria-current={viewed === move.number ? "step" : undefined}
												aria-label={t("history.move", {
													number: move.number,
													color: t(`colors.${move.color}`),
													move: move.point ? move.label : t("pass"),
												})}
												onClick={() => onView?.(move.number)}
											>
												{move.point ? move.label : t("pass")}
												{viewed === move.number && <img src={currentMove} alt="" />}
											</button>
										)}
									</td>
								))}
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
								disabled={!snapshot || control.disabled}
								onClick={() => onView?.(control.index)}
							>
								<img className="directional-icon" src={control.icon} alt="" />
							</button>
							<span aria-hidden="true">{control.label}</span>
						</div>
					))}
				</nav>
				<button className="local-game__undo" type="button" disabled={!snapshot?.canUndo} onClick={onUndo}>
					<img src={undo} alt="" />
					{t("history.undo")}
				</button>
				<p className="local-game__encouragement">{t("history.encouragement")}</p>
			</div>
		</aside>
	);
}
