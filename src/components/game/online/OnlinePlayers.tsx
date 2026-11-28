import type { StoneStyleId } from "weiqi-board";
import { StoneCanvas } from "@/components/board";
import type { OnlineGameSnapshot } from "@/controllers/OnlineGameController";

interface Props {
	snapshot: OnlineGameSnapshot;
	stoneStyle?: StoneStyleId;
}

export function OnlinePlayers({ snapshot, stoneStyle = "polished" }: Props) {
	return (
		<section className="local-game__players" aria-label="Players">
			{(["black", "white"] as const).map((color) => {
				const name = color === "black" ? "Black" : "White";
				const seated = snapshot.seats[name].claimed;
				return (
					<div className="local-game__player" key={color}>
						<span className="local-game__player-stone" aria-hidden="true">
							<StoneCanvas color={color} style={stoneStyle} size={29} />
						</span>
						<span className="local-game__player-name">
							{name}
							{color === snapshot.myColor ? " (you)" : seated ? "" : " · waiting for a player"}
						</span>
						<span className="local-game__player-captures">Captured {snapshot.captures[color]}</span>
					</div>
				);
			})}
		</section>
	);
}
