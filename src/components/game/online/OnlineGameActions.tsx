import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import type { TFunction } from "i18next";
import type { OnlineGameController, OnlineGameSnapshot } from "@/controllers/OnlineGameController";
import type { Color, GameResult } from "@/api/protocol";
import { toEngineColor, toStoneColor } from "@/engine/moveHelpers";

interface Props {
	snapshot: OnlineGameSnapshot;
	controller: OnlineGameController;
}

function resultText(t: TFunction<"game">, result: GameResult, mine: Color): string {
	const colorName = (color: Color) => t(`colors.${toStoneColor(color)}`);
	if (result.kind === "resignation")
		return result.winner === mine
			? t("online.results.youWin", { color: colorName(result.resigned) })
			: t("online.results.winsByResignation", { color: colorName(result.winner) });
	return result.reason === "aborted"
		? t("online.results.aborted", { color: colorName(result.endedBy) })
		: t("online.results.unscored");
}

function InviteLink({ gameId }: { gameId: string }) {
	const { t } = useTranslation("game");
	const [copied, setCopied] = useState(false);
	const link = new URL(`/play/online/${encodeURIComponent(gameId)}`, window.location.origin).href;
	return (
		<div className="online-game__invite">
			<label htmlFor="online-invite">{t("online.invite.label")}</label>
			<div>
				<input id="online-invite" readOnly value={link} onFocus={(event) => event.currentTarget.select()} />
				<button
					type="button"
					onClick={() => {
						navigator.clipboard.writeText(link).then(
							() => setCopied(true),
							() => setCopied(false),
						);
					}}
				>
					{copied ? t("online.invite.copied") : t("online.invite.copy")}
				</button>
			</div>
		</div>
	);
}

export function OnlineGameActions({ snapshot, controller }: Props) {
	const { t } = useTranslation(["game", "common"]);
	const [confirmResign, setConfirmResign] = useState(false);
	const { phase, canResign } = snapshot;
	useEffect(() => {
		if (!canResign) setConfirmResign(false);
	}, [canResign]);
	return (
		<div className="online-game__panel">
			<p className="online-game__status" role="status" aria-live="polite">
				<span>{t("game:online.youAre", { color: t(`game:colors.${snapshot.myColor}`) })}</span>
				<span data-connection={snapshot.connection}>{t(`game:online.connection.${snapshot.connection}`)}</span>
			</p>
			{phase.kind === "awaitingPlayers" && <InviteLink gameId={snapshot.gameId} />}
			{phase.kind === "awaitingScoring" && <p className="online-game__banner">{t("game:online.awaitingScoring")}</p>}
			{phase.kind === "finished" && (
				<p className="online-game__banner" role="alert">
					{resultText(t, phase.result, toEngineColor(snapshot.myColor))}
				</p>
			)}
			{phase.kind !== "finished" && (
				<div className="online-game__actions">
					{confirmResign ? (
						<>
							<button type="button" disabled={!canResign} onClick={controller.resign}>
								{t("game:online.confirmResign")}
							</button>
							<button type="button" onClick={() => setConfirmResign(false)}>
								{t("common:actions.cancel")}
							</button>
						</>
					) : (
						<button type="button" disabled={!canResign} onClick={() => setConfirmResign(true)}>
							{t("game:online.resign")}
						</button>
					)}
					<button type="button" disabled={!snapshot.canAbort} onClick={controller.abort}>
						{t("game:online.abort")}
					</button>
				</div>
			)}
		</div>
	);
}
