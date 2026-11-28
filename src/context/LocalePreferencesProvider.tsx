import { useState, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { LocalePreferencesContext, type LocalePreferencesState } from "@/context/LocalePreferencesContext";
import { findLanguage, type LanguageCode } from "@/i18n/languages";
import type { LocalePreferences, TimeFormat } from "@/types/settings";

type TimePreferences = Pick<LocalePreferences, "timeZone" | "timeFormat">;

const storageKey = "weiqi:time-preferences";
const defaultTimePreferences: TimePreferences = { timeZone: "auto", timeFormat: "auto" };
const timeFormats: TimeFormat[] = ["auto", "12h", "24h"];

function isTimeZone(value: unknown): value is string {
	if (value === "auto") return true;
	if (typeof value !== "string") return false;
	try {
		new Intl.DateTimeFormat(undefined, { timeZone: value });
		return true;
	} catch {
		return false;
	}
}

function loadTimePreferences(): TimePreferences {
	try {
		const value: unknown = JSON.parse(localStorage.getItem(storageKey) ?? "null");
		if (typeof value !== "object" || value === null) return defaultTimePreferences;
		const { timeZone, timeFormat } = value as Record<string, unknown>;
		return {
			timeZone: isTimeZone(timeZone) ? timeZone : defaultTimePreferences.timeZone,
			timeFormat: timeFormats.includes(timeFormat as TimeFormat)
				? (timeFormat as TimeFormat)
				: defaultTimePreferences.timeFormat,
		};
	} catch {
		return defaultTimePreferences;
	}
}

function saveTimePreferences(preferences: TimePreferences) {
	try {
		localStorage.setItem(storageKey, JSON.stringify(preferences));
	} catch {
		// Storage may be unavailable (private mode); the choice then lasts only for this page.
	}
}

export function LocalePreferencesProvider({ children }: { children: ReactNode }) {
	const { i18n } = useTranslation();
	const [timePreferences, setTimePreferencesState] = useState(loadTimePreferences);
	const language = findLanguage(i18n.resolvedLanguage).code as LanguageCode;

	const value: LocalePreferencesState = {
		localePreferences: { language, ...timePreferences },
		changeLanguage: async (nextLanguage) => {
			await i18n.changeLanguage(nextLanguage);
		},
		setTimePreferences: (change) => {
			setTimePreferencesState(change);
			saveTimePreferences(change);
		},
	};

	return <LocalePreferencesContext value={value}>{children}</LocalePreferencesContext>;
}
