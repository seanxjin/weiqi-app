import { useRef, useState } from "react";
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
	const { account, comingSoon } = useSettings();
	const [connections, setConnections] = useState(mockConnections);
	const closeDialog = useRef<HTMLDialogElement>(null);

	return (
		<div className="settings-page">
			<header className="settings-page__header">
				<h2>Account & Security</h2>
				<p>Change your password, secure your account, and manage connected accounts.</p>
			</header>
			<SettingsSection title="Change password">
				<ChangePasswordForm username={account.username} />
			</SettingsSection>
			<SettingsSection title="Contact info">
				<div className="settings-fields">
					<div className="settings-field">
						<span>Email address</span>
						<span className="settings-field__value">
							{mockEmail}
							<button type="button" className="settings-button" onClick={() => comingSoon("Changing your email")}>
								Edit
							</button>
						</span>
					</div>
				</div>
			</SettingsSection>
			<SettingsSection
				title="Two-factor authentication"
				description="Require a code from an authenticator app when you sign in."
			>
				<div className="settings-inline">
					<span className="settings-badge">Off</span>
					<button
						type="button"
						className="settings-button settings-button--primary"
						onClick={() => comingSoon("Two-factor authentication")}
					>
						Enable
					</button>
				</div>
			</SettingsSection>
			<SettingsSection
				title="Active sessions"
				description="If you suspect your account has been compromised, change your password and log out everywhere."
			>
				<SessionList />
			</SettingsSection>
			<SettingsSection title="Connected accounts" description="Sign in to Baduk with these accounts.">
				<ul className="connection-list">
					{providers.map((provider) => {
						const connected = connections[provider.id];
						return (
							<li key={provider.id}>
								<img src={provider.icon} alt="" />
								<span>{connected ? `Connected to ${provider.name}` : provider.name}</span>
								<button
									type="button"
									className="settings-button"
									onClick={() => setConnections((value) => ({ ...value, [provider.id]: !connected }))}
								>
									{connected ? "Disconnect" : "Connect"}
								</button>
							</li>
						);
					})}
				</ul>
				<p className="settings-note">
					Disconnecting removes the link on Baduk. You may still need to revoke access on the other site.
				</p>
			</SettingsSection>
			<SettingsSection
				title="Close your account"
				description="Closing your account hides your profile and signs you out everywhere."
			>
				<button
					type="button"
					className="settings-button settings-button--danger"
					onClick={() => closeDialog.current?.showModal()}
				>
					Close account
				</button>
				<dialog ref={closeDialog} className="settings-dialog" aria-labelledby="close-account-title">
					<h3 id="close-account-title">Close your account?</h3>
					<p>You can reopen it later from the sign-in page.</p>
					<form method="dialog" className="settings-actions">
						<button type="submit" className="settings-button">
							Cancel
						</button>
						<button
							type="submit"
							className="settings-button settings-button--danger"
							onClick={() => comingSoon("Closing your account")}
						>
							Close account
						</button>
					</form>
				</dialog>
			</SettingsSection>
		</div>
	);
}
