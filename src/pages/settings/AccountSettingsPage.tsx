import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import githubIcon from "@/assets/icons/common/github.svg";
import googleIcon from "@/assets/icons/common/google.svg";
import { ChangePasswordForm } from "@/components/settings/ChangePasswordForm";
import { SessionList } from "@/components/settings/SessionList";
import { SettingsSection } from "@/components/settings/SettingsControls";
import { mockConnections, mockEmail } from "@/data/mocks/settings";
import { useSettings } from "@/hooks/useSettings";
import type { ConnectedProvider } from "@/types/settings";

const providers: { id: ConnectedProvider; name: string; icon: string }[] = [
	{ id: "google", name: "Google", icon: googleIcon },
	{ id: "github", name: "GitHub", icon: githubIcon },
];

export default function AccountSettingsPage() {
	const { t } = useTranslation(["settings", "common"]);
	const { account, comingSoon } = useSettings();
	const [connections, setConnections] = useState(mockConnections);
	const closeDialog = useRef<HTMLDialogElement>(null);

	return (
		<div className="settings-page">
			<header className="settings-page__header">
				<h2>{t("sections.account")}</h2>
				<p>{t("account.description")}</p>
			</header>
			<SettingsSection title={t("account.password.title")}>
				<ChangePasswordForm username={account.username} />
			</SettingsSection>
			<SettingsSection title={t("account.contact.title")}>
				<div className="settings-fields">
					<div className="settings-field">
						<span>{t("account.contact.email")}</span>
						<span className="settings-field__value">
							{mockEmail}
							<button
								type="button"
								className="settings-button"
								onClick={() => comingSoon(t("account.contact.editFeature"))}
							>
								{t("account.contact.edit")}
							</button>
						</span>
					</div>
				</div>
			</SettingsSection>
			<SettingsSection title={t("account.twoFactor.title")} description={t("account.twoFactor.description")}>
				<div className="settings-inline">
					<span className="settings-badge">{t("account.twoFactor.off")}</span>
					<button
						type="button"
						className="settings-button settings-button--primary"
						onClick={() => comingSoon(t("account.twoFactor.feature"))}
					>
						{t("account.twoFactor.enable")}
					</button>
				</div>
			</SettingsSection>
			<SettingsSection title={t("account.sessions.title")} description={t("account.sessions.description")}>
				<SessionList />
			</SettingsSection>
			<SettingsSection title={t("account.connections.title")} description={t("account.connections.description")}>
				<ul className="connection-list">
					{providers.map((provider) => {
						const connected = connections[provider.id];
						return (
							<li key={provider.id}>
								<img src={provider.icon} alt="" />
								<span>
									{connected ? t("account.connections.connectedTo", { provider: provider.name }) : provider.name}
								</span>
								<button
									type="button"
									className="settings-button"
									onClick={() => setConnections((value) => ({ ...value, [provider.id]: !connected }))}
								>
									{connected ? t("account.connections.disconnect") : t("account.connections.connect")}
								</button>
							</li>
						);
					})}
				</ul>
				<p className="settings-note">{t("account.connections.note")}</p>
			</SettingsSection>
			<SettingsSection title={t("account.close.title")} description={t("account.close.description")}>
				<button
					type="button"
					className="settings-button settings-button--danger"
					onClick={() => closeDialog.current?.showModal()}
				>
					{t("account.close.button")}
				</button>
				<dialog ref={closeDialog} className="settings-dialog" aria-labelledby="close-account-title">
					<h3 id="close-account-title">{t("account.close.dialogTitle")}</h3>
					<p>{t("account.close.dialogDescription")}</p>
					<form method="dialog" className="settings-actions">
						<button type="submit" className="settings-button">
							{t("common:actions.cancel")}
						</button>
						<button
							type="submit"
							className="settings-button settings-button--danger"
							onClick={() => comingSoon(t("account.close.feature"))}
						>
							{t("account.close.button")}
						</button>
					</form>
				</dialog>
			</SettingsSection>
		</div>
	);
}
