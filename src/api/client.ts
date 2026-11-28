import i18n from "@/i18n";

export class ApiError extends Error {
	code: string;
	status: number;
	retryAfter: number | undefined;

	constructor(code: string, message: string, status: number, retryAfter?: number) {
		super(message);
		this.code = code;
		this.status = status;
		this.retryAfter = retryAfter;
	}
}

// Calls the backend through the Vite /api proxy, so the session cookie is same-origin.
export async function apiRequest<T = unknown>(path: string, body?: object, method = "POST"): Promise<T> {
	const response = await fetch(`/api${path}`, {
		method,
		headers: body ? { "content-type": "application/json" } : undefined,
		body: body ? JSON.stringify(body) : undefined,
	});
	const text = await response.text();
	let json;
	try {
		json = text ? JSON.parse(text) : undefined;
	} catch {
		throw new ApiError("HTTP_ERROR", i18n.t("errors:server.unexpectedResponse"), response.status);
	}
	if (!response.ok) {
		const retryAfter = Number(response.headers.get("retry-after"));
		throw new ApiError(
			json?.error ?? "HTTP_ERROR",
			json?.message ?? i18n.t("errors:server.requestFailed"),
			response.status,
			retryAfter > 0 ? retryAfter : undefined,
		);
	}
	return json as T;
}
