import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router";
import type { BoardSize } from "weiqi-board";
import arrow from "@/assets/icons/common/local-arrow.svg";
import { SetupBoard } from "@/components/setup/SetupBoard";
import { GameConfiguration } from "@/components/setup/GameConfiguration";
import { useCreateOnlineGame } from "@/hooks/useCreateOnlineGame";
import "@/styles/setup.css";

export default function GameSetupPage({ mode }: { mode: "local" | "online" }) {
	const { t } = useTranslation(["setup", "game", "common"]);
	const navigate = useNavigate();
	const [boardSize, setBoardSize] = useState<BoardSize>(19);
	const online = useCreateOnlineGame();
	const title = t(`setup:page.title.${mode}`);
	useEffect(() => {
		document.title = t("common:pageTitle", { title });
	}, [t, title]);
	return (
		<main className="game-setup" id="main-content" aria-label={t(`setup:page.label.${mode}`)}>
			<Link className="setup-back" to="/play">
				<img className="directional-icon" src={arrow} alt="" />
				{t("setup:page.backToMenu")}
			</Link>
			<div className="setup-layout">
				<SetupBoard mode={mode} boardSize={boardSize} />
				<section className="setup-controls" aria-label={t("setup:page.settingsLabel")}>
					<GameConfiguration mode={mode} boardSize={boardSize} onBoardSizeChange={setBoardSize} />
					<button
						className="setup-play"
						type="button"
						disabled={online.creating}
						onClick={() => {
							if (mode === "local") navigate(`/play/local?size=${boardSize}`);
							else void online.create(boardSize, "Random");
						}}
					>
						{online.creating ? t("setup:page.creating") : t("setup:page.startGame")}
						<img className="directional-icon" src={arrow} alt="" />
					</button>
					<div className="setup-notice" role="status" aria-live="polite" aria-atomic="true">
						{online.error && <p className="setup-error">{online.error}</p>}
					</div>
				</section>
			</div>
		</main>
	);
}
