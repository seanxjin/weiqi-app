import { useState } from "react";
import { useTranslation } from "react-i18next";
import visibilityIcon from "@/assets/icons/common/visibility.svg";

type PasswordFieldName = "currentPassword" | "newPassword" | "confirmPassword";

export function PasswordField({ name, autoComplete }: { name: PasswordFieldName; autoComplete: string }) {
	const { t } = useTranslation("settings");
	const [visible, setVisible] = useState(false);
	return (
		<div className="settings-field">
			<label htmlFor={name}>{t(`account.password.fields.${name}.label`)}</label>
			<span className="password-input">
				<input id={name} name={name} type={visible ? "text" : "password"} autoComplete={autoComplete} required />
				<button
					type="button"
					aria-label={t(`account.password.fields.${name}.${visible ? "hide" : "show"}`)}
					aria-pressed={visible}
					onClick={() => setVisible((value) => !value)}
				>
					<img src={visibilityIcon} alt="" />
				</button>
			</span>
		</div>
	);
}
