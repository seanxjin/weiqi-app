import { type ClientMessage, parseServerMessage, type ServerMessage } from "./protocol";

// The only place game-server addresses are built, so credentials can be added here later.
const socketBase = import.meta.env.VITE_GAME_SOCKET_URL ?? "ws://localhost:8080";

export function gameSocketUrl(gameId: string, seatToken: string): string {
	const url = new URL(`games/${encodeURIComponent(gameId)}`, socketBase.endsWith("/") ? socketBase : `${socketBase}/`);
	url.searchParams.set("seatToken", seatToken);
	return url.href;
}

export type ConnectionStatus = "connecting" | "open" | "reconnecting" | "closed";

export interface GameSocketHandlers {
	onMessage(message: ServerMessage): void;
	onStatus(status: ConnectionStatus): void;
}

const minDelay = 1000;
const maxDelay = 8000;

/** JSON WebSocket with automatic reconnects. Knows nothing about Go; the URL is rebuilt on every attempt. */
export class GameSocket {
	private socket: WebSocket | null = null;
	private timer: ReturnType<typeof setTimeout> | undefined;
	private failures = 0;
	private closed = false;
	private readonly url: () => string;
	private readonly handlers: GameSocketHandlers;

	constructor(url: () => string, handlers: GameSocketHandlers) {
		this.url = url;
		this.handlers = handlers;
	}

	connect = (): void => {
		if (this.closed) return;
		clearTimeout(this.timer);
		this.detach();
		const socket = new WebSocket(this.url());
		this.socket = socket;
		this.handlers.onStatus(this.failures === 0 ? "connecting" : "reconnecting");
		socket.onopen = () => {
			this.failures = 0;
			this.handlers.onStatus("open");
		};
		socket.onmessage = (event) => {
			const message = typeof event.data === "string" ? parseServerMessage(event.data) : null;
			if (message) this.handlers.onMessage(message);
			else console.warn("Ignored malformed game server message");
		};
		// Browsers hide handshake statuses, so every close is treated as transient (as Lichess does).
		socket.onclose = () => {
			if (this.socket !== socket) return;
			this.socket = null;
			this.failures += 1;
			this.handlers.onStatus("reconnecting");
			this.timer = setTimeout(this.connect, Math.min(minDelay * 2 ** (this.failures - 1), maxDelay));
		};
	};

	send(message: ClientMessage): boolean {
		if (this.socket?.readyState !== WebSocket.OPEN) return false;
		this.socket.send(JSON.stringify(message));
		return true;
	}

	close(): void {
		if (this.closed) return;
		this.closed = true;
		clearTimeout(this.timer);
		this.detach();
		this.handlers.onStatus("closed");
	}

	private detach(): void {
		const socket = this.socket;
		this.socket = null;
		if (!socket) return;
		socket.onopen = socket.onmessage = socket.onclose = null;
		if (socket.readyState === WebSocket.CONNECTING || socket.readyState === WebSocket.OPEN) socket.close();
	}
}
