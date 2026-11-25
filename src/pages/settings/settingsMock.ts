import type { BoardThemeId, StoneStyleId } from "weiqi-board";

// Shapes and limits mirror weiqi-backend's PrefsSchema, ProfilePatch, and user.types so these pages can be wired to the API later.
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

export type ActiveSession = { id: string; device: string; location: string; lastSeen: string; current: boolean };
export type ConnectedProvider = "google" | "github";

export const BIO_MAX_LENGTH = 400;
export const LOCATION_MAX_LENGTH = 80;
export const REAL_NAME_MAX_LENGTH = 100;
export const MAX_PROFILE_LINKS = 5;
export const LINK_MAX_LENGTH = 300;
// HTML pattern attributes are anchored implicitly.
export const RANK_INPUT_PATTERN = "(?:[1-9]|[12][0-9]|30)k|[1-9]d|[1-9]p";

export const countries = [
	{ code: "", name: "Not set" },
	{ code: "CA", name: "Canada" },
	{ code: "CN", name: "China" },
	{ code: "FR", name: "France" },
	{ code: "DE", name: "Germany" },
	{ code: "JP", name: "Japan" },
	{ code: "KR", name: "South Korea" },
	{ code: "TW", name: "Taiwan" },
	{ code: "GB", name: "United Kingdom" },
	{ code: "US", name: "United States" },
];

export function countryName(code: string) {
	return countries.find((country) => country.code === code)?.name ?? "";
}

export function countryFlag(code: string) {
	if (!code) return "";
	return String.fromCodePoint(...[...code].map((letter) => 0x1f1a5 + letter.charCodeAt(0)));
}

export const mockPreferences: Preferences = {
	boardTheme: "kaya",
	stoneStyle: "polished",
	coordinates: true,
	showLastMove: true,
	moveConfirmation: "correspondence",
	sound: true,
	challenge: "everyone",
};

export const mockProfile: Profile = {
	bio: "Learning shape one game at a time.",
	country: "CA",
	location: "Vancouver",
	realName: "",
	rank: "10k",
	links: [],
};

export const mockJoinedAt = new Date("2026-02-24T12:00:00");
export const mockEmail = "s********0@g****.com";

export const mockBlocking = ["stonecutter42"];
export const mockFollowing = ["sunnyli239", "fanjunlin", "ethanchen2", "williamjin123", "shuangdatdang"];

export const mockSessions: ActiveSession[] = [
	{ id: "s1", device: "Chrome on Windows", location: "Vancouver, CA", lastSeen: "Active now", current: true },
	{ id: "s2", device: "Safari on iPhone", location: "Vancouver, CA", lastSeen: "2 days ago", current: false },
	{ id: "s3", device: "Firefox on macOS", location: "Toronto, CA", lastSeen: "3 weeks ago", current: false },
];

export const mockConnections: Record<ConnectedProvider, boolean> = { google: true, github: false };
