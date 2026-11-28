import { useTranslation } from "react-i18next";
import type { StoneStyleId } from "weiqi-board";
import type { LocalGameController, LocalGameSnapshot } from "@/controllers/LocalGameController";
import { GamePlayers } from "../GamePlayers";

interface LocalPlayersProps {
	snapshot: LocalGameSnapshot | null;
	controller?: LocalGameController;
	stoneStyle?: StoneStyleId;
}

export function LocalPlayers({ snapshot, controller, stoneStyle }: LocalPlayersProps) {
	const { t } = useTranslation("game");
	const player = (color: "black" | "white") => ({
		color,
		name: t(`colors.${color}`),
		captures: snapshot?.captures[color] ?? 0,
	});
	const status = !snapshot
		? t("turn.preparing")
		: snapshot.canPlay
			? t("turn.toPlay", { color: t(`colors.${snapshot.turnColor}`) })
			: t("turn.reviewing");
	return (
		<GamePlayers
			top={player("white")}
			bottom={player("black")}
			activeColor={snapshot?.canPlay ? snapshot.turnColor : null}
			status={status}
			stoneStyle={stoneStyle}
			canPass={Boolean(snapshot?.canPlay)}
			onPass={controller?.pass}
		/>
	);
}
