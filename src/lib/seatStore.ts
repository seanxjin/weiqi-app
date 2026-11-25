import type { Color } from "@/api/protocol";

export interface OnlineSeat {
	readonly gameId: string;
	readonly color: Color;
	readonly seatToken: string;
}

const key = (gameId: string) => `weiqi:seat:${gameId}`;

export function loadSeat(gameId: string): OnlineSeat | null {
	try {
		const value: unknown = JSON.parse(localStorage.getItem(key(gameId)) ?? "null");
		if (typeof value !== "object" || value === null) return null;
		const { color, seatToken } = value as Record<string, unknown>;
		if ((color !== "Black" && color !== "White") || typeof seatToken !== "string") return null;
		return { gameId, color, seatToken };
	} catch {
		return null;
	}
}

export function saveSeat(seat: OnlineSeat): void {
	try {
		localStorage.setItem(key(seat.gameId), JSON.stringify({ color: seat.color, seatToken: seat.seatToken }));
	} catch {
		// Storage may be unavailable (private mode); the seat then lasts only for this page.
	}
}

export function clearSeat(gameId: string): void {
	try {
		localStorage.removeItem(key(gameId));
	} catch {
		// Nothing to clear when storage is unavailable.
	}
}
