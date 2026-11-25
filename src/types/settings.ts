import type { BoardThemeId, StoneStyleId } from "weiqi-board";

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

export type ActiveSession = { id: string; device: string; location: string; lastSeen: string; current: boolean };
export type ConnectedProvider = "google" | "github";
