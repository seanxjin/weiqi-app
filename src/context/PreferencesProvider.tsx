import { useEffect, useState, type ReactNode } from "react";
import { boardThemes, stoneStyles } from "weiqi-board";
import { PreferencesContext } from "@/context/PreferencesContext";
import { mockPreferences } from "@/data/mocks/settings";
import type { Preferences } from "@/types/settings";

const storageKey = "weiqi:preferences";
const moveConfirmations: Preferences["moveConfirmation"][] = ["never", "correspondence", "always"];
const challenges: Preferences["challenge"][] = ["nobody", "following", "registered", "everyone"];

function pick<T>(value: unknown, fallback: T, isValid: (value: unknown) => boolean): T {
	return isValid(value) ? (value as T) : fallback;
}

function loadPreferences(): Preferences {
	try {
		const value: unknown = JSON.parse(localStorage.getItem(storageKey) ?? "null");
		if (typeof value !== "object" || value === null) return mockPreferences;
		const stored = value as Record<string, unknown>;
		const isBoolean = (field: unknown) => typeof field === "boolean";
		return {
			boardTheme: pick(stored.boardTheme, mockPreferences.boardTheme, (field) =>
				Object.hasOwn(boardThemes, String(field)),
			),
			stoneStyle: pick(stored.stoneStyle, mockPreferences.stoneStyle, (field) =>
				Object.hasOwn(stoneStyles, String(field)),
			),
			coordinates: pick(stored.coordinates, mockPreferences.coordinates, isBoolean),
			showLastMove: pick(stored.showLastMove, mockPreferences.showLastMove, isBoolean),
			moveConfirmation: pick(stored.moveConfirmation, mockPreferences.moveConfirmation, (field) =>
				moveConfirmations.includes(field as Preferences["moveConfirmation"]),
			),
			sound: pick(stored.sound, mockPreferences.sound, isBoolean),
			challenge: pick(stored.challenge, mockPreferences.challenge, (field) =>
				challenges.includes(field as Preferences["challenge"]),
			),
		};
	} catch {
		return mockPreferences;
	}
}

/** App-wide preferences, kept in localStorage until the backend preferences API is wired up. */
export function PreferencesProvider({ children }: { children: ReactNode }) {
	const [preferences, setPreferences] = useState(loadPreferences);

	useEffect(() => {
		try {
			localStorage.setItem(storageKey, JSON.stringify(preferences));
		} catch {
			// Storage may be unavailable (private mode); the choice then lasts only for this page.
		}
	}, [preferences]);

	return <PreferencesContext value={{ preferences, setPreferences }}>{children}</PreferencesContext>;
}
