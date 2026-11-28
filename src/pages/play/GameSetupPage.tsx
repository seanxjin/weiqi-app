import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import type { BoardSize } from "weiqi-board";
import arrow from "@/assets/icons/common/local-arrow.svg";
import type { Color } from "@/api/protocol";
import { SetupBoard } from "@/components/setup/SetupBoard";
import { TimeControlSelector } from "@/components/setup/TimeControlSelector";
import { useCreateOnlineGame } from "@/hooks/useCreateOnlineGame";
import "@/styles/setup.css";

export default function GameSetupPage({ mode }: { mode: "local" | "online" }) {
	const navigate = useNavigate();
	const [boardSize, setBoardSize] = useState<BoardSize>(19);
	const [color, setColor] = useState<Color | "Random">("Random");
	const online = useCreateOnlineGame();
	useEffect(() => {
		document.title = `Baduk — ${mode === "local" ? "Local" : "Online"} Game Setup`;
	}, [mode]);
	const boardSizeField = (
		<label className="setup-field setup-board-size">
			<span>BOARD SIZE</span>
			<select value={boardSize} onChange={(event) => setBoardSize(Number(event.target.value) as BoardSize)}>
				<option value={9}>9 × 9</option>
				<option value={13}>13 × 13</option>
				<option value={19}>19 × 19</option>
			</select>
		</label>
	);
	return (
		<main className="game-setup" id="main-content" aria-label={`${mode === "local" ? "Local" : "Online"} game setup`}>
			<Link className="setup-back" to="/play">
				<img src={arrow} alt="" />
				Back to menu
			</Link>
			<div className="setup-layout">
				<SetupBoard mode={mode} />
				<section className="setup-controls" aria-label="Game settings">
					{mode === "online" ? (
						<>
							<TimeControlSelector />
							<p className="setup-notice">Time limits aren’t enforced yet.</p>
							{boardSizeField}
							<label className="setup-field setup-board-size">
								<span>YOUR COLOR</span>
								<select value={color} onChange={(event) => setColor(event.target.value as Color | "Random")}>
									<option value="Random">Random</option>
									<option value="Black">Black</option>
									<option value="White">White</option>
								</select>
							</label>
						</>
					) : (
						boardSizeField
					)}
					<button
						className="setup-play"
						type="button"
						disabled={online.creating}
						onClick={() => {
							if (mode === "local") navigate(`/play/local?size=${boardSize}`);
							else void online.create(boardSize, color);
						}}
					>
						{online.creating ? "Creating game…" : "Play Go"}
						<img src={arrow} alt="" />
					</button>
					<div className="setup-notice" role="status" aria-live="polite" aria-atomic="true">
						{online.error && <p className="setup-error">{online.error}</p>}
					</div>
				</section>
			</div>
		</main>
	);
}
