import { useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { PasswordField } from "@/components/settings/PasswordField";
import { SaveActions } from "@/components/settings/SettingsControls";
import { useSaveStatus } from "@/hooks/useSaveStatus";
import { validatePasswordChange } from "@/lib/authValidation";

export function ChangePasswordForm({ username }: { username: string }) {
	const { t } = useTranslation("settings");
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
		status.show(t("account.password.updated"));
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
				<PasswordField name="currentPassword" autoComplete="current-password" />
				<PasswordField name="newPassword" autoComplete="new-password" />
				<PasswordField name="confirmPassword" autoComplete="new-password" />
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
