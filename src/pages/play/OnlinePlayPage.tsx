import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router";
import { useOnlineGame } from "@/hooks/useOnlineGame";
import { OnlineBoard } from "@/components/game/online/OnlineBoard";
import { toStoneColor } from "@/engine/moveHelpers";
import "@/styles/play.css";
import "@/styles/online-board.css";

export default function OnlinePlayPage() {
	const { t } = useTranslation(["game", "common"]);
	const { gameId = "" } = useParams();
	useEffect(() => {
		document.title = t("common:pageTitle", { title: t("game:onlinePage.title") });
	}, [t]);
	return <OnlineGame key={gameId} gameId={gameId} />;
}

function OnlineGame({ gameId }: { gameId: string }) {
	const { t } = useTranslation(["game", "common"]);
	const { gate, controller, snapshot, retry, join, joining, joinError } = useOnlineGame(gameId);
	return (
		<main className="local-play" id="main-content">
			<h1 className="local-play__title">{t("game:onlinePage.title")}</h1>
			<div className="local-play__board">
				{controller && snapshot ? (
					<OnlineBoard snapshot={snapshot} controller={controller} />
				) : (
					<div className="online-game__gate" role="status" aria-live="polite">
						{gate.kind === "loading" && <p>{t("game:onlinePage.loading")}</p>}
						{gate.kind === "notFound" && (
							<>
								<p>{t("game:onlinePage.notFound")}</p>
								<Link to="/play/online/setup">{t("game:onlinePage.startNew")}</Link>
							</>
						)}
						{gate.kind === "error" && (
							<>
								<p>{gate.message}</p>
								<button type="button" onClick={retry}>
									{t("common:actions.retry")}
								</button>
							</>
						)}
						{gate.kind === "invite" &&
							(gate.openSeat ? (
								<>
									<p>{t("game:onlinePage.invited", { size: gate.game.config.boardSize })}</p>
									<button type="button" disabled={joining} onClick={join}>
										{joining
											? t("game:onlinePage.joining")
											: t("game:onlinePage.joinAs", { color: t(`game:colors.${toStoneColor(gate.openSeat)}`) })}
									</button>
								</>
							) : (
								<>
									<p>{t("game:onlinePage.full")}</p>
									<Link to="/play/online/setup">{t("game:onlinePage.startNew")}</Link>
								</>
							))}
						{joinError && <p className="online-game__gate-error">{joinError}</p>}
					</div>
				)}
			</div>
		</main>
	);
}
