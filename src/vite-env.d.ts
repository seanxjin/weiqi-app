/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly VITE_GAME_SOCKET_URL?: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
