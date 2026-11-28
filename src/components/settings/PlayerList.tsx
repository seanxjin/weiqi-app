import { Link } from "react-router";

export function PlayerList({
	players,
	emptyMessage,
	actionLabel,
	onAction,
}: {
	players: string[];
	emptyMessage: string;
	actionLabel: string;
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
						aria-label={`${actionLabel} ${username}`}
						onClick={() => onAction(username)}
					>
						{actionLabel}
					</button>
				</li>
			))}
		</ul>
	);
}
