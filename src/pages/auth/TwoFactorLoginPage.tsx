import { Link } from "react-router";
import { verifyTwoFactor } from "@/api/auth";
import { FormError } from "@/components/auth/FormError";
import { useSignIn, useSubmit } from "@/hooks/useAuthForm";
import { AuthField, AuthLayout } from "@/layouts/AuthLayout";
import { formField } from "@/lib/authValidation";

export function TwoFactorLoginPage() {
	const signIn = useSignIn();
	const { error, pending, onSubmit } = useSubmit((form) => signIn(verifyTwoFactor(formField(form, "code"))));
	return (
		<AuthLayout title="Two-factor authentication" backTo="/login">
			<div className="auth-heading">
				<h1>Verify it is you</h1>
				<p className="auth-subtitle">Enter the code from your authenticator to finish signing in.</p>
			</div>
			<form className="auth-form" onSubmit={onSubmit} aria-busy={pending}>
				<AuthField
					name="code"
					label="AUTHENTICATOR CODE"
					placeholder="6-digit code"
					inputMode="numeric"
					autoComplete="one-time-code"
					pattern="[0-9]{6}"
					maxLength={6}
					required
				/>
				<FormError error={error} />
				<button className="auth-action" disabled={pending}>
					{pending ? "Verifying…" : "Verify and continue"}
				</button>
				<div className="auth-links">
					<Link to="/login">Start sign-in again</Link>
				</div>
			</form>
		</AuthLayout>
	);
}
