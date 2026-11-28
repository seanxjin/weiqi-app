import { Link, useParams } from "react-router";
import { confirmSignup } from "@/api/auth";
import { FormError } from "@/components/auth/FormError";
import { signInLink } from "@/data/authLinks";
import { useSignIn, useSubmit } from "@/hooks/useAuthForm";
import { AuthLayout } from "@/layouts/AuthLayout";

export function SignupConfirmPage() {
	const signIn = useSignIn();
	const { token = "" } = useParams();
	const { error, pending, onSubmit } = useSubmit(() => signIn(confirmSignup(token)));
	return (
		<AuthLayout title="Confirm your account" accountLink={signInLink}>
			<div className="auth-heading">
				<h1>Welcome to Baduk</h1>
				<p className="auth-subtitle">Confirm your email address to finish creating your account.</p>
			</div>
			<form className="auth-form" onSubmit={onSubmit} aria-busy={pending}>
				<FormError error={error} />
				<button className="auth-action" disabled={pending}>
					{pending ? "Confirming…" : "Confirm and continue"}
				</button>
				<div className="auth-links">
					<Link to="/signup/resend">Request a new confirmation link</Link>
				</div>
			</form>
		</AuthLayout>
	);
}
