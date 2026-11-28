import { Link } from "react-router";

export function PlayerList({
	players,
	emptyMessage,
	actionLabel,
	actionAccessibleLabel,
	onAction,
}: {
	players: string[];
	emptyMessage: string;
	actionLabel: string;
	actionAccessibleLabel: (username: string) => string;
	onAction: (username: string) => void;
}) {
	if (!players.length) return <p className="settings-empty">{emptyMessage}</p>;
	return (
		<ul className="player-list">
			{players.map((username) => (
				<li key={username}>
					<Link to={`/member/${username}`}>{username}</Link>
					<button
						type="button"
						className="settings-button"
						aria-label={actionAccessibleLabel(username)}
						onClick={() => onAction(username)}
					>
						{actionLabel}
					</button>
				</li>
			))}
		</ul>
	);
}
