import { useTranslation } from "react-i18next";
import type { TFunction } from "i18next";
import type { StoneColor, StoneStyleId } from "weiqi-board";
import type { OnlineGameController, OnlineGameSnapshot } from "@/controllers/OnlineGameController";
import { mockProfile } from "@/data/mocks/settings";
import { toEngineColor } from "@/engine/moveHelpers";
import { useAuth } from "@/hooks/useAuth";
import { GamePlayers } from "../GamePlayers";
import type { GamePlayer } from "../GamePlayers";

interface Props {
	snapshot: OnlineGameSnapshot;
	controller: OnlineGameController;
	stoneStyle?: StoneStyleId;
}

function turnText(t: TFunction<"game">, snapshot: OnlineGameSnapshot): string {
	if (snapshot.viewedMoveIndex !== snapshot.latestMoveIndex) return t("turn.reviewing");
	switch (snapshot.phase.kind) {
		case "awaitingPlayers":
			return t("turn.waitingForOpponent");
		case "awaitingScoring":
			return t("turn.awaitingScoring");
		case "finished":
			return t("turn.gameOver");
		case "playing":
			if (snapshot.moves.at(-1)?.pending) return t("turn.sendingMove");
			if (snapshot.connection !== "open") return t("turn.waitingForConnection");
			return snapshot.turnColor === snapshot.myColor
				? t("turn.yourMove")
				: t("turn.toPlay", { color: t(`colors.${snapshot.turnColor}`) });
	}
}

export function OnlinePlayers({ snapshot, controller, stoneStyle }: Props) {
	const { t } = useTranslation("game");
	const { account } = useAuth();
	const opponentColor: StoneColor = snapshot.myColor === "black" ? "white" : "black";
	const colorName = (color: StoneColor) => t(`colors.${color}`);
	// The game protocol has no player profiles yet, so only your own rank and country (from your profile) are known.
	const you: GamePlayer = {
		color: snapshot.myColor,
		name: t("players.you", { name: account?.username ?? colorName(snapshot.myColor) }),
		captures: snapshot.captures[snapshot.myColor],
		rank: mockProfile.rank,
		country: mockProfile.country,
	};
	const opponent: GamePlayer = {
		color: opponentColor,
		name: snapshot.seats[toEngineColor(opponentColor)].claimed
			? colorName(opponentColor)
			: t("players.waiting", { name: colorName(opponentColor) }),
		captures: snapshot.captures[opponentColor],
	};
	const live = snapshot.phase.kind === "playing" && snapshot.viewedMoveIndex === snapshot.latestMoveIndex;
	return (
		<GamePlayers
			top={opponent}
			bottom={you}
			activeColor={live ? snapshot.turnColor : null}
			status={turnText(t, snapshot)}
			stoneStyle={stoneStyle}
			canPass={snapshot.canPass}
			onPass={controller.pass}
		/>
	);
}
