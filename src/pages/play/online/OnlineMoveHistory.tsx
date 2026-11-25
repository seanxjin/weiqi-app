import { useEffect, useRef } from "react";
import blackKey from "../../../assets/local-game/black-key.svg";
import previous from "../../../assets/local-game/chevron-left.svg";
import next from "../../../assets/local-game/chevron-right.svg";
import currentMove from "../../../assets/local-game/current-move.svg";
import headingDivider from "../../../assets/local-game/heading-divider.svg";
import skipBack from "../../../assets/local-game/skip-back.svg";
import skipForward from "../../../assets/local-game/skip-forward.svg";
import whiteKey from "../../../assets/local-game/white-key.svg";
import type { OnlineGameSnapshot, OnlineMove } from "../../../game/online/OnlineGameController";

interface Props {
	snapshot: OnlineGameSnapshot;
	onView: (index: number) => void;
}

/** The local MoveHistoryPanel experience without Undo; optimistic moves are marked as pending. */
export function OnlineMoveHistory({ snapshot, onView }: Props) {
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
		{ label: "Start", icon: skipBack, index: 0, disabled: viewed === 0 },
		{ label: "Previous", icon: previous, index: viewed - 1, disabled: viewed === 0 },
		{ label: "Next", icon: next, index: viewed + 1, disabled: viewed === latest },
		{ label: "Current", icon: skipForward, index: latest, disabled: viewed === latest },
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
				aria-label={`Move ${move.number}, ${move.color === "black" ? "Black" : "White"}, ${move.label}${move.pending ? ", sending" : ""}`}
				onClick={() => onView(move.number)}
			>
				{move.label}
				{viewed === move.number && <img src={currentMove} alt="" />}
			</button>
		);

	return (
		<aside className="local-game__history" aria-label="Move history">
			<div className="local-game__history-heading">
				<h2>Moves</h2>
				<span>
					{latest} {latest === 1 ? "MOVE" : "MOVES"}
				</span>
			</div>
			<img className="local-game__heading-divider" src={headingDivider} alt="" />
			<div className="local-game__move-scroll" ref={scroll}>
				<table className="local-game__move-table" aria-label="Black and White moves">
					<colgroup>
						<col className="local-game__pair-column" />
						<col />
						<col />
					</colgroup>
					<thead>
						<tr>
							<th scope="col">
								<span aria-hidden="true">#</span>
								<span className="local-game__sr-only">Pair</span>
							</th>
							<th scope="col">
								<span>
									<img src={blackKey} alt="" />
									Black
								</span>
							</th>
							<th scope="col">
								<span>
									<img src={whiteKey} alt="" />
									White
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
									No moves yet.
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>
			<div className="local-game__review-controls">
				<div className="local-game__position" role="status" aria-live="polite" aria-atomic="true">
					<span>
						Move {viewed} of {latest}
					</span>
					<span>{viewed === latest ? "CURRENT POSITION" : "REVIEWING"}</span>
				</div>
				<nav className="local-game__navigation" aria-label="Move history navigation">
					{navigation.map((control) => (
						<div key={control.label}>
							<button
								type="button"
								aria-label={control.label}
								disabled={control.disabled}
								onClick={() => onView(control.index)}
							>
								<img src={control.icon} alt="" />
							</button>
							<span aria-hidden="true">{control.label}</span>
						</div>
					))}
				</nav>
				<p className="local-game__encouragement">Use ← → to step through moves, ↑ ↓ for start and current.</p>
			</div>
		</aside>
	);
}
