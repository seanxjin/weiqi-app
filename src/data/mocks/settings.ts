import type { ActiveSession, ConnectedProvider, Preferences, Profile } from "@/types/settings";

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

const daysAgo = (days: number) => new Date(Date.now() - days * 24 * 60 * 60 * 1000);

export const mockSessions: ActiveSession[] = [
	{ id: "s1", device: "Chrome on Windows", location: "Vancouver, CA", lastSeen: new Date(), current: true },
	{ id: "s2", device: "Safari on iPhone", location: "Vancouver, CA", lastSeen: daysAgo(2), current: false },
	{ id: "s3", device: "Firefox on macOS", location: "Toronto, CA", lastSeen: daysAgo(21), current: false },
];

export const mockConnections: Record<ConnectedProvider, boolean> = { google: true, github: false };
