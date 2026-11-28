import { createContext } from "react";
import type { ThemePreference } from "@/types/settings";

export type ThemeState = {
	theme: ThemePreference;
	setTheme: (theme: ThemePreference) => void;
};

export const ThemeContext = createContext<ThemeState | null>(null);
