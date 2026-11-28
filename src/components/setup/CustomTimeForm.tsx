import { useId, useState } from "react";
import { useTranslation } from "react-i18next";
import arrow from "@/assets/icons/common/local-arrow.svg";
import { clockSystemNameKeys, clockSystems, defaultCustomTime, validateCustomTime } from "@/data/timeControls";
import type { ClockSystem, CustomTime, CustomTimeError } from "@/data/timeControls";

export function CustomTimeForm({ onApply }: { onApply: (value: CustomTime) => void }) {
	const { t } = useTranslation("setup");
	const id = useId();
	const [draft, setDraft] = useState<CustomTime>(defaultCustomTime);
	const [error, setError] = useState<CustomTimeError | null>(null);
	const update = (key: keyof CustomTime, value: string) => {
		setDraft((current) => ({ ...current, [key]: value }));
		setError(null);
	};
	const fields: {
		key: Exclude<keyof CustomTime, "system">;
		min?: number;
		max?: number;
	}[] = [
		{ key: "minutes" },
		{ key: "seconds", max: 59 },
		...(draft.system === "Fischer" ? [{ key: "increment" as const }] : []),
		...(draft.system === "Japanese Byo-yomi"
			? [
					{ key: "periods" as const, min: 1 },
					{ key: "periodSeconds" as const, min: 1 },
				]
			: []),
	];
	return (
		<form
			className="setup-custom"
			noValidate
			aria-label={t("customTime.label")}
			onSubmit={(event) => {
				event.preventDefault();
				const message = validateCustomTime(draft);
				setError(message);
				if (!message) onApply({ ...draft });
			}}
		>
			<div className="setup-custom__topline">
				<div>
					<p className="setup-eyebrow">{t("customTime.eyebrow")}</p>
					<h3>{t("customTime.heading")}</h3>
				</div>
				<label className="setup-field">
					<span>{t("customTime.system")}</span>
					<select value={draft.system} onChange={(event) => update("system", event.target.value as ClockSystem)}>
						{clockSystems.map((system) => (
							<option key={system} value={system}>
								{t(clockSystemNameKeys[system])}
							</option>
						))}
					</select>
				</label>
			</div>
			<div className="setup-fields">
				{fields.map((field) => (
					<label className="setup-field" key={field.key}>
						<span>{t(`customTime.fields.${field.key}`)}</span>
						<input
							type="number"
							inputMode="numeric"
							min={field.min ?? 0}
							max={field.max}
							step="1"
							value={draft[field.key]}
							onChange={(event) => update(field.key, event.target.value)}
							aria-describedby={error ? `${id}-error` : undefined}
						/>
					</label>
				))}
			</div>
			{error && (
				<p className="setup-error" id={`${id}-error`} role="alert">
					{t(`customTime.errors.${error}`)}
				</p>
			)}
			<div className="setup-custom__footer">
				<p>{draft.system === "Japanese Byo-yomi" ? t("customTime.hints.byoYomi") : t("customTime.hints.default")}</p>
				<button className="setup-apply" type="submit">
					{t("customTime.apply")}
					<img className="directional-icon" src={arrow} alt="" />
				</button>
			</div>
		</form>
	);
}
