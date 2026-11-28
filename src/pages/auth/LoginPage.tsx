import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useSearchParams } from "react-router";
import { login } from "@/api/auth";
import { ApiError } from "@/api/client";
import usernameIcon from "@/assets/icons/auth/username.svg";
import { FormError } from "@/components/auth/FormError";
import { OAuthOptions } from "@/components/auth/OAuthOptions";
import { signupLink } from "@/data/authLinks";
import { useSignIn, useSubmit } from "@/hooks/useAuthForm";
import { AuthField, AuthLayout, AuthPasswordField } from "@/layouts/AuthLayout";
import { formField } from "@/lib/authValidation";

export function LoginPage() {
	const { t } = useTranslation(["auth", "common"]);
	const signIn = useSignIn();
	const [params] = useSearchParams();
	const [needsTotp, setNeedsTotp] = useState(false);
	const { error, pending, onSubmit } = useSubmit(async (form) => {
		try {
			await signIn(
				login({
					login: formField(form, "login"),
					password: formField(form, "password"),
					...(needsTotp && { totp: formField(form, "totp") }),
				}),
			);
		} catch (caught) {
			if (caught instanceof ApiError && caught.code === "TWO_FACTOR_REQUIRED") setNeedsTotp(true);
			throw caught;
		}
	});
	const oauthError = params.get("error");
	const oauthMessage =
		oauthError === "email_in_use"
			? t("login.oauthErrors.emailInUse")
			: oauthError
				? t("login.oauthErrors.failed")
				: null;

	return (
		<AuthLayout title={t("login.pageTitle")} accountLink={signupLink}>
			<div className="auth-heading">
				<h1>{t("login.heading")}</h1>
				<p className="auth-subtitle">{t("login.subtitle")}</p>
			</div>
			<form className="auth-form" onSubmit={onSubmit} aria-busy={pending}>
				{oauthMessage && (
					<p className="auth-error" role="alert">
						{oauthMessage}
					</p>
				)}
				<AuthField
					name="login"
					label={t("login.fields.login.label")}
					icon={usernameIcon}
					placeholder={t("login.fields.login.placeholder")}
					autoComplete="username"
					maxLength={254}
					required
				/>
				<AuthPasswordField
					name="password"
					label={t("fields.password.label")}
					placeholder={t("fields.password.placeholder")}
					autoComplete="current-password"
					required
				/>
				{needsTotp && (
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
				{error instanceof ApiError && error.code === "EMAIL_UNCONFIRMED" && (
					<div className="auth-links">
						<Link to="/signup/resend">{t("login.resendConfirmation")}</Link>
					</div>
				)}
				<button className="auth-action" disabled={pending}>
					{pending ? t("login.signingIn") : t("common:actions.signIn")}
				</button>
				<div className="auth-links">
					<Link to="/password-reset">{t("login.forgotPassword")}</Link>
				</div>
			</form>
			<OAuthOptions />
		</AuthLayout>
	);
}
