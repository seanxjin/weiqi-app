import { useEffect, useState } from "react";
import type { OnlineGameController, OnlineGameSnapshot } from "@/controllers/OnlineGameController";
import type { GameResult } from "@/api/protocol";

interface Props {
	snapshot: OnlineGameSnapshot;
	controller: OnlineGameController;
}

const connectionLabels = {
	connecting: "Connecting…",
	open: "Connected",
	reconnecting: "Reconnecting…",
	closed: "Disconnected",
} as const;

function resultText(result: GameResult, mine: "Black" | "White"): string {
	if (result.kind === "resignation")
		return result.winner === mine ? `You win · ${result.resigned} resigned` : `${result.winner} wins by resignation`;
	return result.reason === "aborted" ? `Game aborted by ${result.endedBy}` : "Game ended without a score";
}

function InviteLink({ gameId }: { gameId: string }) {
	const [copied, setCopied] = useState(false);
	const link = new URL(`/play/online/${encodeURIComponent(gameId)}`, window.location.origin).href;
	return (
		<div className="online-game__invite">
			<label htmlFor="online-invite">Invite a friend with this link</label>
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
					{copied ? "Copied" : "Copy"}
				</button>
			</div>
		</div>
	);
}

export function OnlineGameActions({ snapshot, controller }: Props) {
	const [confirmResign, setConfirmResign] = useState(false);
	const { phase, canResign } = snapshot;
	useEffect(() => {
		if (!canResign) setConfirmResign(false);
	}, [canResign]);
	const mine = snapshot.myColor === "black" ? "Black" : "White";
	return (
		<div className="online-game__panel">
			<p className="online-game__status" role="status" aria-live="polite">
				<span>You are {mine}</span>
				<span data-connection={snapshot.connection}>{connectionLabels[snapshot.connection]}</span>
			</p>
			{phase.kind === "awaitingPlayers" && <InviteLink gameId={snapshot.gameId} />}
			{phase.kind === "awaitingScoring" && (
				<p className="online-game__banner">
					Both players passed. Scoring isn’t supported yet, so abort to record the game as unscored.
				</p>
			)}
			{phase.kind === "finished" && (
				<p className="online-game__banner" role="alert">
					{resultText(phase.result, mine)}
				</p>
			)}
			{phase.kind !== "finished" && (
				<div className="online-game__actions">
					{confirmResign ? (
						<>
							<button type="button" disabled={!canResign} onClick={controller.resign}>
								Confirm resign
							</button>
							<button type="button" onClick={() => setConfirmResign(false)}>
								Cancel
							</button>
						</>
					) : (
						<button type="button" disabled={!canResign} onClick={() => setConfirmResign(true)}>
							Resign
						</button>
					)}
					<button type="button" disabled={!snapshot.canAbort} onClick={controller.abort}>
						Abort
					</button>
				</div>
			)}
		</div>
	);
}
