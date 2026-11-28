import { useContext } from "react";
import { LocalePreferencesContext } from "@/context/LocalePreferencesContext";

export function useLocalePreferences() {
	const localePreferences = useContext(LocalePreferencesContext);
	if (!localePreferences) throw new Error("useLocalePreferences must be used inside LocalePreferencesProvider");
	return localePreferences;
}
