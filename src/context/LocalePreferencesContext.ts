import { createContext } from "react";
import type { LanguageCode } from "@/i18n/languages";
import type { LocalePreferences } from "@/types/settings";

export type LocalePreferencesState = {
	localePreferences: LocalePreferences;
	changeLanguage: (language: LanguageCode) => Promise<void>;
	setTimePreferences: (change: Pick<LocalePreferences, "timeZone" | "timeFormat">) => void;
};

export const LocalePreferencesContext = createContext<LocalePreferencesState | null>(null);
