import type { ParseKeys } from "i18next";
import { useTranslation } from "react-i18next";
import { ApiError } from "@/api/client";

const errorKeys: Record<string, ParseKeys<"errors">> = {
	INVALID_CREDENTIALS: "api.invalidCredentials",
	TWO_FACTOR_REQUIRED: "api.twoFactorRequired",
	INVALID_TWO_FACTOR: "api.invalidTwoFactor",
	EMAIL_UNCONFIRMED: "api.emailUnconfirmed",
	ACCOUNT_CLOSED: "api.accountClosed",
	USERNAME_TAKEN: "api.usernameTaken",
	EMAIL_TAKEN: "api.emailTaken",
	INVALID_TOKEN: "api.invalidToken",
	UNAUTHORIZED: "api.unauthorized",
	CONFLICT: "api.conflict",
	FORBIDDEN: "api.forbidden",
};

export function FormError({ error }: { error: unknown }) {
	const { t } = useTranslation("errors");
	if (!error) return null;

	const errorMessage = () => {
		if (error instanceof ApiError) {
			if (error.status >= 500) return t("server.unavailable");
			if (error.code === "RATE_LIMITED") {
				return error.retryAfter
					? t("rateLimited.withDelay", { count: Math.ceil(error.retryAfter) })
					: t("rateLimited.generic");
			}
			const key = errorKeys[error.code];
			return key ? t(key) : error.message;
		}
		if (error instanceof TypeError) return t("server.unreachable");
		return error instanceof Error ? error.message : t("unknown");
	};

	return (
		<p className="auth-error" role="alert">
			{errorMessage()}
		</p>
	);
}
