import { useLayoutEffect, useState, type ReactNode } from "react";
import { ThemeContext } from "@/context/ThemeContext";
import type { ThemePreference } from "@/types/settings";

const storageKey = "weiqi:theme";
const themes: ThemePreference[] = ["system", "light", "dark"];
const darkSchemeQuery = "(prefers-color-scheme: dark)";

function loadTheme(): ThemePreference {
	try {
		const stored = localStorage.getItem(storageKey);
		return themes.includes(stored as ThemePreference) ? (stored as ThemePreference) : "system";
	} catch {
		return "system";
	}
}

/** Resolves the theme preference to light or dark and exposes it as `data-theme` on the root element for CSS. */
export function ThemeProvider({ children }: { children: ReactNode }) {
	const [theme, setThemeState] = useState(loadTheme);

	useLayoutEffect(() => {
		const media = window.matchMedia(darkSchemeQuery);
		const applyTheme = () => {
			const isDark = theme === "dark" || (theme === "system" && media.matches);
			document.documentElement.dataset.theme = isDark ? "dark" : "light";
		};
		applyTheme();
		if (theme !== "system") return;
		media.addEventListener("change", applyTheme);
		return () => media.removeEventListener("change", applyTheme);
	}, [theme]);

	const setTheme = (nextTheme: ThemePreference) => {
		setThemeState(nextTheme);
		try {
			localStorage.setItem(storageKey, nextTheme);
		} catch {
			// Storage may be unavailable (private mode); the choice then lasts only for this page.
		}
	};

	return <ThemeContext value={{ theme, setTheme }}>{children}</ThemeContext>;
}
