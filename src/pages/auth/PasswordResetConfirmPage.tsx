import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router";
import { confirmPasswordReset, getPasswordResetInfo, type PasswordResetInfo } from "@/api/auth";
import { ApiError } from "@/api/client";
import { FormError } from "@/components/auth/FormError";
import { useSignIn, useSubmit } from "@/hooks/useAuthForm";
import { AuthField, AuthLayout, AuthPasswordField } from "@/layouts/AuthLayout";
import { formField, validateNewPassword } from "@/lib/authValidation";

export function PasswordResetConfirmPage() {
	const { t } = useTranslation(["auth", "common"]);
	const signIn = useSignIn();
	const { token = "" } = useParams();
	const [attempt, setAttempt] = useState(0);
	const [loaded, setLoaded] = useState<{
		token: string;
		attempt: number;
		info?: PasswordResetInfo;
		error?: unknown;
	} | null>(null);
	const current = loaded?.token === token && loaded.attempt === attempt ? loaded : null;
	useEffect(() => {
		let active = true;
		const load = async () => {
			try {
				const info = await getPasswordResetInfo(token);
				if (active) setLoaded({ token, attempt, info });
			} catch (error) {
				if (active) setLoaded({ token, attempt, error });
			}
		};
		void load();
		return () => {
			active = false;
		};
	}, [token, attempt]);
	const { error, pending, onSubmit } = useSubmit(async (form) => {
		if (!current?.info) return;
		const password = formField(form, "password");
		validateNewPassword(password);
		await signIn(
			confirmPasswordReset(token, {
				password,
				...(current.info.twoFactor && { totp: formField(form, "totp") }),
			}),
		);
	});
	return (
		<AuthLayout title={t("passwordResetConfirm.pageTitle")} backTo="/login">
			<div className="auth-heading">
				<h1>{t("passwordResetConfirm.heading")}</h1>
				<p className="auth-subtitle">
					{current?.info
						? t("passwordResetConfirm.subtitleForUser", { username: current.info.username })
						: t("passwordResetConfirm.subtitle")}
				</p>
			</div>
			{!current ? (
				<p className="auth-status" role="status">
					{t("passwordResetConfirm.checkingLink")}
				</p>
			) : current.info ? (
				<form className="auth-form" onSubmit={onSubmit} aria-busy={pending}>
					<AuthPasswordField
						name="password"
						label={t("passwordResetConfirm.fields.password.label")}
						placeholder={t("passwordResetConfirm.fields.password.placeholder")}
						autoComplete="new-password"
						minLength={8}
						guidance={t("fields.password.guidance")}
						required
					/>
					{current.info.twoFactor && (
						<AuthField
							name="totp"
							label={t("fields.authenticatorCode.label")}
							placeholder={t("fields.authenticatorCode.placeholder")}
							inputMode="numeric"
							autoComplete="one-time-code"
							pattern="[0-9]{6}"
							maxLength={6}
							required
						/>
					)}
					<FormError error={error} />
					<button className="auth-action" disabled={pending}>
						{pending ? t("common:actions.saving") : t("passwordResetConfirm.submit")}
					</button>
					<div className="auth-links">
						<Link to="/password-reset">{t("passwordResetConfirm.requestNewLink")}</Link>
					</div>
				</form>
			) : (
				<div className="auth-form">
					<FormError error={current.error} />
					{!(current.error instanceof ApiError && current.error.code === "INVALID_TOKEN") && (
						<button className="auth-action" onClick={() => setAttempt((value) => value + 1)}>
							{t("passwordResetConfirm.tryAgain")}
						</button>
					)}
					<div className="auth-links">
						<Link to="/password-reset">{t("passwordResetConfirm.requestNewLink")}</Link>
					</div>
				</div>
			)}
		</AuthLayout>
	);
}
