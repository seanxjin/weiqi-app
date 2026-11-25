import { useRef, useState, type FormEvent } from "react";
import { mockConnections, mockEmail, mockSessions, type ActiveSession, type ConnectedProvider } from "./settingsMock";
import { SaveActions, SettingsSection, useSaveStatus } from "./SettingsControls";
import { useSettings } from "./useSettings";
import visibilityIcon from "../../assets/auth/visibility.svg";
import googleIcon from "../../assets/auth/google.svg";
import githubIcon from "../../assets/auth/github.svg";

const providers: { id: ConnectedProvider; name: string; icon: string }[] = [
	{ id: "google", name: "Google", icon: googleIcon },
	{ id: "github", name: "GitHub", icon: githubIcon },
];

function PasswordField({ name, label, autoComplete }: { name: string; label: string; autoComplete: string }) {
	const [visible, setVisible] = useState(false);
	return (
		<div className="settings-field">
			<label htmlFor={name}>{label}</label>
			<span className="password-input">
				<input id={name} name={name} type={visible ? "text" : "password"} autoComplete={autoComplete} required />
				<button
					type="button"
					aria-label={visible ? `Hide ${label.toLowerCase()}` : `Show ${label.toLowerCase()}`}
					aria-pressed={visible}
					onClick={() => setVisible((value) => !value)}
				>
					<img src={visibilityIcon} alt="" />
				</button>
			</span>
		</div>
	);
}

function validatePasswordChange(form: FormData) {
	const next = String(form.get("newPassword") ?? "");
	if (next.length < 8) return "Use at least 8 characters for your new password.";
	if (new TextEncoder().encode(next).length > 72) return "Your password must not exceed 72 UTF-8 bytes.";
	if (next !== form.get("confirmPassword")) return "The new passwords do not match.";
	if (next === form.get("currentPassword")) return "Choose a password different from your current one.";
	return null;
}

function ChangePasswordForm({ username }: { username: string }) {
	const [error, setError] = useState<string | null>(null);
	const [dirty, setDirty] = useState(false);
	const status = useSaveStatus();

	const save = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const form = event.currentTarget;
		const message = validatePasswordChange(new FormData(form));
		setError(message);
		if (message) return;
		form.reset();
		setDirty(false);
		status.show("Password updated");
	};

	return (
		<form
			onSubmit={save}
			onChange={() => {
				setDirty(true);
				status.clear();
			}}
		>
			<input type="text" name="username" autoComplete="username" value={username} readOnly hidden />
			<div className="settings-fields">
				<PasswordField name="currentPassword" label="Current password" autoComplete="current-password" />
				<PasswordField name="newPassword" label="New password" autoComplete="new-password" />
				<PasswordField name="confirmPassword" label="Retype password" autoComplete="new-password" />
			</div>
			{error && (
				<p className="settings-error" role="alert">
					{error}
				</p>
			)}
			<SaveActions dirty={dirty} status={status.message} />
		</form>
	);
}

function SessionList() {
	const [sessions, setSessions] = useState<ActiveSession[]>(mockSessions);
	const revoke = (id: string) => setSessions((list) => list.filter((session) => session.id !== id));
	const hasOtherSessions = sessions.some((session) => !session.current);
	return (
		<>
			<ul className="session-list">
				{sessions.map((session) => (
					<li key={session.id}>
						<span>
							<span className="session-list__device">{session.device}</span>
							<span className="session-list__meta">
								{session.location} · {session.current ? "This device" : session.lastSeen}
							</span>
						</span>
						{!session.current && (
							<button
								type="button"
								className="settings-button"
								aria-label={`Log out ${session.device}`}
								onClick={() => revoke(session.id)}
							>
								Log out
							</button>
						)}
					</li>
				))}
			</ul>
			<button
				type="button"
				className="settings-button settings-button--danger"
				disabled={!hasOtherSessions}
				onClick={() => setSessions((list) => list.filter((session) => session.current))}
			>
				Log out on all other devices
			</button>
		</>
	);
}

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
