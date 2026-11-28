import { useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { SaveActions, SettingsSection } from "@/components/settings/SettingsControls";
import { LanguagePicker } from "@/components/ui/LanguagePicker";
import { useLocalePreferences } from "@/hooks/useLocalePreferences";
import { useSaveStatus } from "@/hooks/useSaveStatus";
import { createDateFormatter } from "@/lib/dateFormat";
import type { TimeFormat } from "@/types/settings";

const timeFormats: TimeFormat[] = ["auto", "12h", "24h"];
const timeZones = Intl.supportedValuesOf("timeZone");
const deviceTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
// 1:30 PM on an arbitrary afternoon shows the difference between 12- and 24-hour clocks.
const sampleTime = new Date(2026, 0, 15, 13, 30);

function timeZoneLabel(timeZone: string) {
	return timeZone.replaceAll("_", " ");
}

export default function LanguageTimeSettingsPage() {
	const { t } = useTranslation(["settings", "common"]);
	const { localePreferences, setTimePreferences } = useLocalePreferences();
	const { language } = localePreferences;
	const [draft, setDraft] = useState({
		timeZone: localePreferences.timeZone,
		timeFormat: localePreferences.timeFormat,
	});
	const status = useSaveStatus();
	const dirty = draft.timeZone !== localePreferences.timeZone || draft.timeFormat !== localePreferences.timeFormat;
	const previewFormatter = createDateFormatter({ language, ...draft });

	const update = (change: Partial<typeof draft>) => {
		status.clear();
		setDraft((value) => ({ ...value, ...change }));
	};

	const save = (event: FormEvent) => {
		event.preventDefault();
		setTimePreferences(draft);
		status.show(t("common:status.saved"));
	};

	return (
		<form className="settings-page" onSubmit={save}>
			<header className="settings-page__header">
				<h2>{t("languageTime.title")}</h2>
				<p>{t("languageTime.description")}</p>
			</header>
			<SettingsSection title={t("languageTime.language.title")} description={t("languageTime.language.description")}>
				<div className="settings-fields">
					<div className="settings-field">
						<span>{t("languageTime.language.legend")}</span>
						<LanguagePicker className="language-button language-button--field" />
					</div>
				</div>
			</SettingsSection>
			<SettingsSection title={t("languageTime.time.title")} description={t("languageTime.time.description")}>
				<div className="settings-fields">
					<label className="settings-field">
						<span>{t("languageTime.time.timeZone")}</span>
						<select value={draft.timeZone} onChange={(event) => update({ timeZone: event.currentTarget.value })}>
							<option value="auto">
								{t("languageTime.time.automaticTimeZone", { timeZone: timeZoneLabel(deviceTimeZone) })}
							</option>
							{timeZones.map((timeZone) => (
								<option key={timeZone} value={timeZone}>
									{timeZoneLabel(timeZone)}
								</option>
							))}
						</select>
					</label>
					<div className="settings-field" role="radiogroup" aria-labelledby="time-format-label">
						<span id="time-format-label">{t("languageTime.time.timeFormat")}</span>
						<div className="setting-radios">
							{timeFormats.map((timeFormat) => (
								<label key={timeFormat}>
									<input
										type="radio"
										name="timeFormat"
										value={timeFormat}
										checked={draft.timeFormat === timeFormat}
										onChange={() => update({ timeFormat })}
									/>
									{t(`languageTime.time.formats.${timeFormat}`, {
										example: createDateFormatter({ language, timeZone: "auto", timeFormat }).formatTime(sampleTime),
									})}
								</label>
							))}
						</div>
					</div>
					<div className="settings-field">
						<span>{t("languageTime.time.preview")}</span>
						<output className="settings-field__value">{previewFormatter.formatDateTime(new Date())}</output>
					</div>
				</div>
			</SettingsSection>
			<SaveActions
				dirty={dirty}
				status={status.message}
				onCancel={() => setDraft({ timeZone: localePreferences.timeZone, timeFormat: localePreferences.timeFormat })}
			/>
		</form>
	);
}
