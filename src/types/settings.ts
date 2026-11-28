import type { BoardThemeId, StoneStyleId } from "weiqi-board";
import type { LanguageCode } from "@/i18n/languages";

// Shapes mirror weiqi-backend's PrefsSchema, ProfilePatch, and user.types so the settings pages can be wired to the API later.
export type Preferences = {
	boardTheme: BoardThemeId;
	stoneStyle: StoneStyleId;
	coordinates: boolean;
	showLastMove: boolean;
	moveConfirmation: "never" | "correspondence" | "always";
	sound: boolean;
	challenge: "nobody" | "following" | "registered" | "everyone";
};

export type Profile = {
	bio: string;
	country: string;
	location: string;
	realName: string;
	rank: string;
	links: string[];
};

export type ActiveSession = { id: string; device: string; location: string; lastSeen: Date; current: boolean };
export type ConnectedProvider = "google" | "github";

export type TimeFormat = "auto" | "12h" | "24h";

// "system" follows the device's light/dark setting.
export type ThemePreference = "system" | "light" | "dark";

// Language and time choices; shaped so they can join the backend PrefsSchema once it stores them.
export type LocalePreferences = {
	language: LanguageCode;
	// "auto" follows the device time zone; otherwise an IANA zone such as "America/Vancouver".
	timeZone: string;
	timeFormat: TimeFormat;
};
