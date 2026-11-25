import { useState } from "react";
import { Link } from "react-router";
import { signup } from "@/api/auth";
import emailIcon from "@/assets/icons/auth/email.svg";
import usernameIcon from "@/assets/icons/auth/username.svg";
import { FormError } from "@/components/auth/FormError";
import { signInLink } from "@/data/authLinks";
import { useSubmit } from "@/hooks/useAuthForm";
import { AuthField, AuthLayout, AuthPasswordField, AuthTerms } from "@/layouts/AuthLayout";
import { formField, passwordGuidance, usernamePattern, usernameTitle, validateNewPassword } from "@/lib/authValidation";

export function SignupPage() {
	const [sent, setSent] = useState(false);
	const { error, pending, onSubmit } = useSubmit(async (form) => {
		const password = formField(form, "password");
		validateNewPassword(password);
		await signup({
			username: formField(form, "username"),
			email: formField(form, "email"),
			password,
		});
		setSent(true);
	});

	return (
		<AuthLayout title="Email signup" backTo="/signup" accountLink={signInLink}>
			<div data-node-id="86:2">
				<div className="auth-heading">
					<p className="auth-eyebrow">MAKE YOUR FIRST MOVE</p>
					<h1>{sent ? "Check your email" : "Create your account"}</h1>
					<p className="auth-subtitle">
						{sent ? "Confirm your email to take your place at the board." : "A place at the board, made for you."}
					</p>
				</div>
				{sent ? (
					<>
						<p className="auth-status" role="status">
							We sent a confirmation link. Follow it to finish creating your account. The link is valid for 24 hours.
						</p>
						<div className="auth-links">
							<Link to="/signup/resend">Resend or correct your email</Link>
							<Link to="/login">Sign in</Link>
						</div>
					</>
				) : (
					<>
						<form className="auth-form" onSubmit={onSubmit} aria-busy={pending}>
							<AuthField
								name="username"
								label="USERNAME"
								icon={usernameIcon}
								placeholder="Choose a username"
								autoComplete="username"
								minLength={2}
								maxLength={20}
								pattern={usernamePattern}
								title={usernameTitle}
								guidance="Please choose an appropriate username. Inappropriate usernames will be flagged by our moderators."
								required
							/>
							<AuthField
								name="email"
								label="EMAIL"
								icon={emailIcon}
								type="email"
								placeholder="Enter your email address"
								autoComplete="email"
								maxLength={254}
								required
							/>
							<AuthPasswordField
								name="password"
								label="PASSWORD"
								placeholder="Create a password"
								autoComplete="new-password"
								minLength={8}
								guidance={passwordGuidance}
								required
							/>
							<FormError error={error} />
							<button className="auth-action" disabled={pending}>
								{pending ? "Creating account…" : "Continue"}
							</button>
						</form>
						<AuthTerms />
					</>
				)}
			</div>
		</AuthLayout>
	);
}
