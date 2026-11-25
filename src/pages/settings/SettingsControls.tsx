import { useEffect, useState, type ReactNode } from "react";

export function SettingsSection({
	title,
	description,
	children,
}: {
	title: string;
	description?: string;
	children: ReactNode;
}) {
	return (
		<section className="settings-section">
			<h3>{title}</h3>
			{description && <p className="settings-section__description">{description}</p>}
			{children}
		</section>
	);
}

export function SettingToggle({
	label,
	description,
	checked,
	onChange,
}: {
	label: string;
	description?: string;
	checked: boolean;
	onChange: (checked: boolean) => void;
}) {
	return (
		<label className="setting-toggle">
			<input
				type="checkbox"
				role="switch"
				aria-checked={checked}
				checked={checked}
				onChange={(event) => onChange(event.currentTarget.checked)}
			/>
			<span className="setting-toggle__text">
				<span className="setting-toggle__label">{label}</span>
				{description && <span className="setting-toggle__description">{description}</span>}
			</span>
		</label>
	);
}

export function SettingRadioGroup<Value extends string>({
	legend,
	name,
	value,
	options,
	onChange,
}: {
	legend: string;
	name: string;
	value: Value;
	options: { value: Value; label: string }[];
	onChange: (value: Value) => void;
}) {
	return (
		<fieldset className="setting-radios">
			<legend>{legend}</legend>
			{options.map((option) => (
				<label key={option.value}>
					<input
						type="radio"
						name={name}
						value={option.value}
						checked={value === option.value}
						onChange={() => onChange(option.value)}
					/>
					{option.label}
				</label>
			))}
		</fieldset>
	);
}

/** Shows a short-lived confirmation after a successful save. */
export function useSaveStatus() {
	const [message, setMessage] = useState("");
	useEffect(() => {
		if (!message) return;
		const timer = window.setTimeout(() => setMessage(""), 3000);
		return () => window.clearTimeout(timer);
	}, [message]);
	return { message, show: setMessage, clear: () => setMessage("") };
}

export function SaveActions({
	dirty,
	status,
	onCancel,
	saveLabel = "Save",
}: {
	dirty: boolean;
	status: string;
	onCancel?: () => void;
	saveLabel?: string;
}) {
	return (
		<div className="settings-actions">
			{onCancel && (
				<button type="button" className="settings-button" disabled={!dirty} onClick={onCancel}>
					Cancel
				</button>
			)}
			<button type="submit" className="settings-button settings-button--primary" disabled={!dirty}>
				{saveLabel}
			</button>
			<span className="settings-actions__status" role="status" aria-live="polite">
				{status}
			</span>
		</div>
	);
}
