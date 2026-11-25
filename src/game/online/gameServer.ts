import { api } from "../../auth/api";
import type { BoardSize, Color, PublicGameSnapshot, SeatGrant } from "./protocol";

// The only place game-server addresses are built, so credentials can be added here later.
const socketBase = import.meta.env.VITE_GAME_SOCKET_URL ?? "ws://localhost:8080";

export function gameSocketUrl(gameId: string, seatToken: string): string {
	const url = new URL(`games/${encodeURIComponent(gameId)}`, socketBase.endsWith("/") ? socketBase : `${socketBase}/`);
	url.searchParams.set("seatToken", seatToken);
	return url.href;
}

export const createGame = (options: { boardSize: BoardSize; color: Color | "Random" }) =>
	api<SeatGrant>("/games", options);

export const fetchGame = (gameId: string) =>
	api<{ game: PublicGameSnapshot }>(`/games/${encodeURIComponent(gameId)}`, undefined, "GET").then(({ game }) => game);

export const joinGame = (gameId: string) => api<SeatGrant>(`/games/${encodeURIComponent(gameId)}/join`);
