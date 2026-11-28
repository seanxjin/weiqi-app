import { createContext, type Dispatch, type SetStateAction } from "react";
import type { Preferences } from "@/types/settings";

export type PreferencesState = {
	preferences: Preferences;
	setPreferences: Dispatch<SetStateAction<Preferences>>;
};

export const PreferencesContext = createContext<PreferencesState | null>(null);
