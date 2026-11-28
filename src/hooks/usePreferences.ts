import { useContext } from "react";
import { PreferencesContext } from "@/context/PreferencesContext";

export function usePreferences() {
	const preferences = useContext(PreferencesContext);
	if (!preferences) throw new Error("usePreferences must be used inside PreferencesProvider");
	return preferences;
}
