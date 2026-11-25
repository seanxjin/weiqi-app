import { useRef, useState, type FormEvent } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import type { Account } from "@/types/account";

export function useSubmit(action: (form: FormData) => Promise<void>) {
	const [error, setError] = useState<unknown>(null);
	const [pending, setPending] = useState(false);
	const submitting = useRef(false);
	const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		if (submitting.current) return;
		const form = new FormData(event.currentTarget);
		submitting.current = true;
		setPending(true);
		setError(null);
		try {
			await action(form);
		} catch (caught) {
			setError(caught);
		} finally {
			submitting.current = false;
			setPending(false);
		}
	};
	return { error, pending, onSubmit };
}

export function useSignIn() {
	const { setAccount } = useAuth();
	const navigate = useNavigate();
	return async (request: Promise<Account>) => {
		setAccount(await request);
		navigate("/play", { replace: true });
	};
}
