import { useState } from "react";
import { mockBlocking, mockFollowing } from "@/data/mocks/settings";
import { PlayerList } from "@/components/settings/PlayerList";
import { SettingsSection } from "@/components/settings/SettingsControls";

const playerCount = (count: number) => `${count} ${count === 1 ? "player" : "players"}`;

export default function SocialSettingsPage() {
	const [blocking, setBlocking] = useState(mockBlocking);
	const [following, setFollowing] = useState(mockFollowing);

	return (
		<div className="settings-page">
			<header className="settings-page__header">
				<h2>Social & Privacy</h2>
				<p>Manage the players you follow and the players you have blocked.</p>
			</header>
			<SettingsSection
				title="Blocking"
				description={`You are blocking ${playerCount(blocking.length)}. Blocked players cannot challenge or message you.`}
			>
				<PlayerList
					players={blocking}
					emptyMessage="You are not blocking anyone."
					actionLabel="Unblock"
					onAction={(username) => setBlocking((players) => players.filter((player) => player !== username))}
				/>
			</SettingsSection>
			<SettingsSection title="Following" description={`You follow ${playerCount(following.length)}.`}>
				<PlayerList
					players={following}
					emptyMessage="You are not following anyone yet."
					actionLabel="Unfollow"
					onAction={(username) => setFollowing((players) => players.filter((player) => player !== username))}
				/>
			</SettingsSection>
		</div>
	);
}
