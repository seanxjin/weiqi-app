import { Link, useSearchParams } from "react-router";
import { completeOAuthSignup } from "@/api/auth";
import usernameIcon from "@/assets/icons/auth/username.svg";
import { FormError } from "@/components/auth/FormError";
import { signInLink } from "@/data/authLinks";
import { useSignIn, useSubmit } from "@/hooks/useAuthForm";
import { AuthField, AuthLayout, AuthTerms } from "@/layouts/AuthLayout";
import { formField, usernamePattern, usernameTitle } from "@/lib/authValidation";

export function OAuthSignupPage() {
	const signIn = useSignIn();
	const [params] = useSearchParams();
	const { error, pending, onSubmit } = useSubmit((form) => signIn(completeOAuthSignup(formField(form, "username"))));
	return (
		<AuthLayout title="Choose your username" backTo="/signup" accountLink={signInLink}>
			<div className="auth-heading">
				<p className="auth-eyebrow">MAKE YOUR FIRST MOVE</p>
				<h1>Choose a username</h1>
				<p className="auth-subtitle">One last step before you join the board.</p>
			</div>
			<form className="auth-form" onSubmit={onSubmit} aria-busy={pending}>
				<AuthField
					name="username"
					label="USERNAME"
					icon={usernameIcon}
					defaultValue={params.get("username") ?? ""}
					placeholder="Choose a username"
					autoComplete="username"
					minLength={2}
					maxLength={20}
					pattern={usernamePattern}
					title={usernameTitle}
					required
				/>
				<FormError error={error} />
				<button className="auth-action" disabled={pending}>
					{pending ? "Creating account…" : "Create account"}
				</button>
				<div className="auth-links">
					<Link to="/signup">Start signup again</Link>
				</div>
			</form>
			<AuthTerms />
		</AuthLayout>
	);
}
