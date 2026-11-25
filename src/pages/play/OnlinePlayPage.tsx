import { useEffect } from "react";
import { Link, useParams } from "react-router";
import { useOnlineGame } from "@/hooks/useOnlineGame";
import { OnlineBoard } from "@/components/game/online/OnlineBoard";
import "@/styles/play.css";
import "@/styles/online-board.css";

export default function OnlinePlayPage() {
	const { gameId = "" } = useParams();
	useEffect(() => {
		document.title = "Baduk — Online Play";
	}, []);
	return <OnlineGame key={gameId} gameId={gameId} />;
}

function OnlineGame({ gameId }: { gameId: string }) {
	const { gate, controller, snapshot, retry, join, joining, joinError } = useOnlineGame(gameId);
	const config = snapshot?.config ?? (gate.kind === "invite" ? gate.game.config : null);
	return (
		<main className="local-play" id="main-content">
			<header className="local-play__heading">
				<div>
					<p>ONLINE GAME</p>
					<h1>A moment for the game.</h1>
				</div>
				{config && (
					<span>
						{config.boardSize} × {config.boardSize} · Komi {config.komi}
					</span>
				)}
			</header>
			<div className="local-play__board">
				{controller && snapshot ? (
					<OnlineBoard snapshot={snapshot} controller={controller} />
				) : (
					<div className="online-game__gate" role="status" aria-live="polite">
						{gate.kind === "loading" && <p>Loading game…</p>}
						{gate.kind === "notFound" && (
							<>
								<p>This game doesn’t exist or is no longer available.</p>
								<Link to="/play/online/setup">Start a new online game</Link>
							</>
						)}
						{gate.kind === "error" && (
							<>
								<p>{gate.message}</p>
								<button type="button" onClick={retry}>
									Retry
								</button>
							</>
						)}
						{gate.kind === "invite" &&
							(gate.openSeat ? (
								<>
									<p>
										You’re invited to a {gate.game.config.boardSize} × {gate.game.config.boardSize} game.
									</p>
									<button type="button" disabled={joining} onClick={join}>
										{joining ? "Joining…" : `Join as ${gate.openSeat}`}
									</button>
								</>
							) : (
								<>
									<p>This game is full. Watching games isn’t available yet.</p>
									<Link to="/play/online/setup">Start a new online game</Link>
								</>
							))}
						{joinError && <p className="online-game__gate-error">{joinError}</p>}
					</div>
				)}
			</div>
		</main>
	);
}
