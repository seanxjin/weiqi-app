import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import { AnimatedBoardScene } from "@/components/board/AnimatedBoardScene";
import { StoneMark } from "@/components/ui/StoneMark";
import { LanguagePicker } from "@/components/ui/LanguagePicker";
import { SakuraBranches } from "@/components/sakura/SakuraBranches";
import { welcomeBoardGeometry } from "weiqi-board";
import { boardLoopSeconds, welcomeAppearance, welcomeMoves } from "@/data/welcomeScene";
import "@/styles/welcome.css";

export default function WelcomePage() {
	const { t } = useTranslation(["welcome", "common"]);
	const [paused, setPaused] = useState(false);
	const [visit, setVisit] = useState(0);
	useEffect(() => {
		document.title = t("common:pageTitle", { title: t("welcome:pageTitle") });
	}, [t]);
	useEffect(() => {
		// Browser history can restore the completed DOM without mounting React again.
		const replayVisit = (event: PageTransitionEvent) => {
			if (!event.persisted) return;
			setPaused(false);
			setVisit((value) => value + 1);
		};
		window.addEventListener("pageshow", replayVisit);
		return () => window.removeEventListener("pageshow", replayVisit);
	}, []);
	return (
		<div className="welcome-page" data-node-id="26:936" data-paused={paused}>
			<aside className="welcome-rail" aria-label={t("welcome:railLabel")}>
				<Link className="welcome-brand" to="/" aria-label={t("common:homeLink")}>
					<StoneMark style={welcomeAppearance.stoneStyle} size={34} />
					<span>{t("common:brand")}</span>
				</Link>
				<nav className="welcome-navigation" aria-label={t("welcome:mainNavigation")}>
					<Link to="/play">
						<StoneMark style={welcomeAppearance.stoneStyle} size={24} compact />
						<span>{t("welcome:play")}</span>
					</Link>
				</nav>
				<LanguagePicker className="language-button welcome-language" />
			</aside>
			<main className="welcome-content" id="main-content">
				<div className="welcome-introduction">
					<p className="welcome-eyebrow">{t("welcome:eyebrow")}</p>
					<h1 aria-label={t("welcome:heading.label")}>
						<span aria-hidden="true">{t("welcome:heading.prefix")}</span>
						<span className="welcome-game-name" aria-hidden="true">
							<span lang="en">GO</span>
							<span lang="zh-Hans">围棋</span>
							<span lang="ko">바둑</span>
						</span>
					</h1>
					<p className="welcome-description">
						{t("welcome:description.first")}
						<br />
						{t("welcome:description.second")}
					</p>
				</div>
				<div className="welcome-board">
					<AnimatedBoardScene
						key={visit}
						{...welcomeAppearance}
						moves={welcomeMoves}
						duration={boardLoopSeconds}
						geometry={welcomeBoardGeometry}
						paused={paused}
						reducedMotion={false}
						onTogglePause={() => setPaused((value) => !value)}
					/>
				</div>
				<p className="welcome-footnote">{t("welcome:footnote")}</p>
			</main>
			<SakuraBranches key={visit} paused={paused} />
		</div>
	);
}
