import { createContext } from "react";
import type { Account } from "@/types/account";

export type AuthState = {
	// undefined while loading, null when signed out.
	account: Account | null | undefined;
	accountError: string | null;
	reloadAccount: () => Promise<void>;
	setAccount: (account: Account | null) => void;
	logout: () => Promise<void>;
};

export const AuthContext = createContext<AuthState | null>(null);
