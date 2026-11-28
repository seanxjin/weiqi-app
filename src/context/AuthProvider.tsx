import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { getAccount, logout as logoutRequest } from "@/api/auth";
import { ApiError } from "@/api/client";
import { AuthContext } from "@/context/AuthContext";
import i18n from "@/i18n";
import type { Account } from "@/types/account";

export function AuthProvider({ children }: { children: ReactNode }) {
	const [account, setAccount] = useState<Account | null | undefined>(undefined);
	const [accountError, setAccountError] = useState<string | null>(null);
	const requestVersion = useRef(0);

	const updateAccount = (value: Account | null) => {
		requestVersion.current += 1;
		setAccountError(null);
		setAccount(value);
	};

	const reloadAccount = useCallback(async () => {
		const version = ++requestVersion.current;
		try {
			const restored = await getAccount();
			if (version === requestVersion.current) setAccount(restored);
		} catch (error) {
			if (version !== requestVersion.current) return;
			if (error instanceof ApiError && error.status === 401) {
				setAccount(null);
			} else {
				setAccountError(i18n.t("common:status.sessionError"));
			}
		}
	}, []);

	const retryAccount = async () => {
		setAccountError(null);
		await reloadAccount();
	};

	useEffect(() => {
		const restore = async () => {
			await reloadAccount();
		};
		void restore();
		return () => {
			requestVersion.current += 1;
		};
	}, [reloadAccount]);

	const logout = async () => {
		await logoutRequest();
		updateAccount(null);
	};

	return (
		<AuthContext.Provider
			value={{
				account,
				accountError,
				reloadAccount: retryAccount,
				setAccount: updateAccount,
				logout,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
}
