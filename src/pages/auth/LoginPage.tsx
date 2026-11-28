import { useState } from "react";
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
			? "This provider email belongs to an existing account. Sign in with that account instead."
			: oauthError
				? "Social sign-in could not be completed. Please try again."
				: null;

	return (
		<AuthLayout title="Sign in" accountLink={signupLink}>
			<div className="auth-heading">
				<h1>Welcome back</h1>
				<p className="auth-subtitle">Your place at the board is waiting.</p>
			</div>
			<form className="auth-form" onSubmit={onSubmit} aria-busy={pending}>
				{oauthMessage && (
					<p className="auth-error" role="alert">
						{oauthMessage}
					</p>
				)}
				<AuthField
					name="login"
					label="USERNAME OR EMAIL"
					icon={usernameIcon}
					placeholder="Username or email"
					autoComplete="username"
					maxLength={254}
					required
				/>
				<AuthPasswordField
					name="password"
					label="PASSWORD"
					placeholder="Enter your password"
					autoComplete="current-password"
					required
				/>
				{needsTotp && (
					<AuthField
						name="totp"
						label="AUTHENTICATOR CODE"
						placeholder="6-digit code"
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
						<Link to="/signup/resend">Resend or correct confirmation email</Link>
					</div>
				)}
				<button className="auth-action" disabled={pending}>
					{pending ? "Signing in…" : "Sign in"}
				</button>
				<div className="auth-links">
					<Link to="/password-reset">Forgot password?</Link>
				</div>
			</form>
			<OAuthOptions />
		</AuthLayout>
	);
}
