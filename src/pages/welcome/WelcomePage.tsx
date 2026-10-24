import { useEffect, useState } from "react";
import { Link } from "react-router";
import { AnimatedBoardScene } from "../../components/AnimatedBoardScene";
import { StoneMark } from "../../components/StoneMark";
import { SakuraBranches } from "../../components/sakura/SakuraBranches";
import { welcomeBoardGeometry } from "../../lib/baduk";
import {
	boardLoopSeconds,
	welcomeAppearance,
	welcomeMoves,
} from "./welcomeScene";
import "./WelcomePage.css";

export default function WelcomePage() {
	const [paused, setPaused] = useState(false);
	const [visit, setVisit] = useState(0);
	useEffect(() => {
		document.title = "Baduk — Play Go";
	}, []);
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
			<aside className="welcome-rail" aria-label="Baduk">
				<Link className="welcome-brand" to="/" aria-label="Baduk home">
					<StoneMark style={welcomeAppearance.stoneStyle} size={34} />
					<span>BADUK</span>
				</Link>
				<nav className="welcome-navigation" aria-label="Main navigation">
					<Link to="/" aria-current="page">
						<StoneMark style={welcomeAppearance.stoneStyle} size={24} compact />
						<span>Play</span>
					</Link>
				</nav>
			</aside>
			<main className="welcome-content" id="main-content">
				<div className="welcome-introduction">
					<p className="welcome-eyebrow">THE ART OF THE NEXT MOVE</p>
					<h1 aria-label="Play Go">
						<span aria-hidden="true">Play </span>
						<span className="welcome-game-name" aria-hidden="true">
							<span lang="en">GO</span>
							<span lang="zh-Hans">围棋</span>
							<span lang="ko">바둑</span>
						</span>
					</h1>
					<p className="welcome-description">
						A quiet mind. An open board.
						<br />
						Every stone, a new possibility.
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
				<p className="welcome-footnote">TAKE YOUR TIME.</p>
			</main>
			<SakuraBranches key={visit} paused={paused} />
		</div>
	);
}
