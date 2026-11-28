import { useEffect, useState } from "react";

/** Shows a short-lived confirmation after a successful save. */
export function useSaveStatus() {
	const [message, setMessage] = useState("");
	useEffect(() => {
		if (!message) return;
		const timer = window.setTimeout(() => setMessage(""), 3000);
		return () => window.clearTimeout(timer);
	}, [message]);
	return { message, show: setMessage, clear: () => setMessage("") };
}
