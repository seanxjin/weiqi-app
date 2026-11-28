import { useState } from "react";
import { useTranslation } from "react-i18next";
import { mockBlocking, mockFollowing } from "@/data/mocks/settings";
import { PlayerList } from "@/components/settings/PlayerList";
import { SettingsSection } from "@/components/settings/SettingsControls";

export default function SocialSettingsPage() {
	const { t } = useTranslation("settings");
	const [blocking, setBlocking] = useState(mockBlocking);
	const [following, setFollowing] = useState(mockFollowing);

	return (
		<div className="settings-page">
			<header className="settings-page__header">
				<h2>{t("sections.social")}</h2>
				<p>{t("social.description")}</p>
			</header>
			<SettingsSection
				title={t("social.blocking.title")}
				description={t("social.blocking.description", { count: blocking.length })}
			>
				<PlayerList
					players={blocking}
					emptyMessage={t("social.blocking.empty")}
					actionLabel={t("social.blocking.action")}
					actionAccessibleLabel={(username) => t("social.blocking.actionLabel", { username })}
					onAction={(username) => setBlocking((players) => players.filter((player) => player !== username))}
				/>
			</SettingsSection>
			<SettingsSection
				title={t("social.following.title")}
				description={t("social.following.description", { count: following.length })}
			>
				<PlayerList
					players={following}
					emptyMessage={t("social.following.empty")}
					actionLabel={t("social.following.action")}
					actionAccessibleLabel={(username) => t("social.following.actionLabel", { username })}
					onAction={(username) => setFollowing((players) => players.filter((player) => player !== username))}
				/>
			</SettingsSection>
		</div>
	);
}
