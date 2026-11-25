import { useState } from "react";
import visibilityIcon from "@/assets/icons/common/visibility.svg";

export function PasswordField({ name, label, autoComplete }: { name: string; label: string; autoComplete: string }) {
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
