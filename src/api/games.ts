import { apiRequest } from "./client";
import type { BoardSize, Color, PublicGameSnapshot, SeatGrant } from "./protocol";

export async function createGame(options: { boardSize: BoardSize; color: Color | "Random" }) {
	return apiRequest<SeatGrant>("/games", options);
}

export async function fetchGame(gameId: string) {
	const { game } = await apiRequest<{ game: PublicGameSnapshot }>(
		`/games/${encodeURIComponent(gameId)}`,
		undefined,
		"GET",
	);
	return game;
}

export async function joinGame(gameId: string) {
	return apiRequest<SeatGrant>(`/games/${encodeURIComponent(gameId)}/join`);
}
