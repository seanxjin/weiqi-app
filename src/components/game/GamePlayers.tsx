import { useTranslation } from "react-i18next";
import type { StoneColor, StoneStyleId } from "weiqi-board";
import { StoneCanvas } from "@/components/board";
import { countryFlag, countryName } from "@/lib/countries";

export type GamePlayer = {
	color: StoneColor;
	name: string;
	captures: number;
	rank?: string;
	country?: string;
};

type GamePlayersProps = {
	top: GamePlayer;
	bottom: GamePlayer;
	/** The color whose turn it is, or null when nobody can move (loading, reviewing, game over). */
	activeColor: StoneColor | null;
	status: string;
	stoneStyle?: StoneStyleId;
	canPass: boolean;
	onPass?: () => void;
};

/** Player cards with clocks: the opponent at the top, the local player at the bottom, Pass beneath. */
export function GamePlayers({ top, bottom, activeColor, status, stoneStyle, canPass, onPass }: GamePlayersProps) {
	const { t } = useTranslation("game");
	return (
		<section className="game-players" aria-label={t("players.label")}>
			<PlayerCard player={top} position="top" active={activeColor === top.color} stoneStyle={stoneStyle} />
			<GameClock position="top" active={activeColor === top.color} />
			<p className="local-game__sr-only" role="status" aria-live="polite" aria-atomic="true">
				{status}
			</p>
			<GameClock position="bottom" active={activeColor === bottom.color} />
			<PlayerCard player={bottom} position="bottom" active={activeColor === bottom.color} stoneStyle={stoneStyle} />
			<button className="game-players__pass" type="button" disabled={!canPass} onClick={onPass}>
				{t("pass")}
			</button>
		</section>
	);
}

type Position = "top" | "bottom";

function PlayerCard({
	player,
	position,
	active,
	stoneStyle = "polished",
}: {
	player: GamePlayer;
	position: Position;
	active: boolean;
	stoneStyle?: StoneStyleId;
}) {
	const { t, i18n } = useTranslation("game");
	return (
		<div className="game-players__card" data-position={position} data-active={active}>
			<span className="local-game__player-stone" aria-hidden="true">
				<StoneCanvas color={player.color} style={stoneStyle} size={29} />
			</span>
			<div className="game-players__identity">
				<p className="game-players__name">
					<span>{player.name}</span>
					{player.country && (
						<span role="img" aria-label={countryName(player.country, i18n.resolvedLanguage ?? "en")}>
							{countryFlag(player.country)}
						</span>
					)}
				</p>
				<p className="game-players__meta">
					<span className="game-players__rank">{player.rank || "?"}</span>
					<span>{t("players.captured", { count: player.captures })}</span>
				</p>
			</div>
		</div>
	);
}

// Clocks are not implemented yet, so this only reserves their place and shows whose turn it is.
function GameClock({ position, active }: { position: Position; active: boolean }) {
	return (
		<p className="game-players__clock" data-position={position} data-active={active} aria-hidden="true">
			--:--
		</p>
	);
}
