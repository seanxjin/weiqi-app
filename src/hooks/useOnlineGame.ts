import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import { ApiError } from "@/api/client";
import { loadEngine } from "@/engine/loadEngine";
import { fetchGame, joinGame } from "@/api/games";
import { GameSocket, gameSocketUrl } from "@/api/gameSocket";
import { OnlineGameController } from "@/controllers/OnlineGameController";
import type { Color, PublicGameSnapshot } from "@/api/protocol";
import { clearSeat, loadSeat, saveSeat } from "@/lib/seatStore";

export type OnlineGate =
	| { readonly kind: "loading" }
	| { readonly kind: "notFound" }
	| { readonly kind: "error"; readonly message: string }
	/** The visitor has no seat: they may claim the open one, or the game is full. */
	| { readonly kind: "invite"; readonly game: PublicGameSnapshot; readonly openSeat: Color | null }
	| { readonly kind: "seated"; readonly controller: OnlineGameController };

const noSubscribe = () => () => {};
const noSnapshot = () => null;

function openSeat(game: PublicGameSnapshot): Color | null {
	if (game.phase.kind !== "awaitingPlayers") return null;
	return !game.seats.Black.claimed ? "Black" : !game.seats.White.claimed ? "White" : null;
}

function errorMessage(error: unknown): string {
	return error instanceof ApiError ? error.message : "The game could not be loaded. Please retry.";
}

const isStatus = (error: unknown, status: number) => error instanceof ApiError && error.status === status;

export function useOnlineGame(gameId: string) {
	// Bumped to retry loading and after claiming a seat, so one effect owns the controller and socket.
	const [attempt, setAttempt] = useState(0);
	const [loaded, setLoaded] = useState<{ attempt: number; gate: OnlineGate } | null>(null);
	const [joining, setJoining] = useState(false);
	const [joinError, setJoinError] = useState<string | null>(null);

	useEffect(() => {
		let active = true;
		let controller: OnlineGameController | undefined;
		let socket: GameSocket | undefined;
		const show = (gate: OnlineGate) => {
			if (active) setLoaded({ attempt, gate });
		};
		const stop = () => {
			socket?.close();
			clearSeat(gameId);
			show({ kind: "notFound" });
		};
		const resync = () => {
			fetchGame(gameId).then(
				(game) => active && controller?.onResync(game),
				(error) => isStatus(error, 404) && active && stop(),
			);
		};
		async function initialize() {
			try {
				const [module, game] = await Promise.all([loadEngine(), fetchGame(gameId)]);
				if (!active) return;
				const seat = loadSeat(gameId);
				if (!seat) return show({ kind: "invite", game, openSeat: openSeat(game) });
				const current = new OnlineGameController(module, {
					game,
					myColor: seat.color,
					send: (message) => socket?.send(message) ?? false,
					requestResync: resync,
				});
				controller = current;
				socket = new GameSocket(() => gameSocketUrl(gameId, loadSeat(gameId)?.seatToken ?? seat.seatToken), {
					onMessage: (message) => {
						if (message.type === "joined") saveSeat({ gameId, color: message.color, seatToken: message.seatToken });
						current.onMessage(message);
					},
					onStatus: (status) => {
						current.onConnection(status);
						// The socket can't tell why it closed, so ask over HTTP whether the game still exists.
						if (status === "reconnecting") resync();
					},
				});
				show({ kind: "seated", controller: current });
				socket.connect();
			} catch (error) {
				if (isStatus(error, 404)) show({ kind: "notFound" });
				else show({ kind: "error", message: errorMessage(error) });
			}
		}
		void initialize();
		return () => {
			active = false;
			socket?.close();
			controller?.dispose();
		};
	}, [gameId, attempt]);

	const gate: OnlineGate = loaded?.attempt === attempt ? loaded.gate : { kind: "loading" };
	const controller = gate.kind === "seated" ? gate.controller : undefined;
	const snapshot = useSyncExternalStore(controller?.subscribe ?? noSubscribe, controller?.getSnapshot ?? noSnapshot);
	const retry = useCallback(() => setAttempt((value) => value + 1), []);

	const join = useCallback(async () => {
		setJoining(true);
		setJoinError(null);
		try {
			const grant = await joinGame(gameId);
			saveSeat({ gameId, color: grant.color, seatToken: grant.seatToken });
		} catch (error) {
			if (isStatus(error, 409)) setJoinError("Someone else took the seat first. This game is now full.");
			else if (!isStatus(error, 404)) setJoinError(errorMessage(error));
		} finally {
			setJoining(false);
			setAttempt((value) => value + 1);
		}
	}, [gameId]);

	return { gate, controller, snapshot, retry, join, joining, joinError };
}
