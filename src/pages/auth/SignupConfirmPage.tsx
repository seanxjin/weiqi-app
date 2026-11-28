import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router";
import { confirmSignup } from "@/api/auth";
import { FormError } from "@/components/auth/FormError";
import { signInLink } from "@/data/authLinks";
import { useSignIn, useSubmit } from "@/hooks/useAuthForm";
import { AuthLayout } from "@/layouts/AuthLayout";

export function SignupConfirmPage() {
	const { t } = useTranslation("auth");
	const signIn = useSignIn();
	const { token = "" } = useParams();
	const { error, pending, onSubmit } = useSubmit(() => signIn(confirmSignup(token)));
	return (
		<AuthLayout title={t("signupConfirm.pageTitle")} accountLink={signInLink}>
			<div className="auth-heading">
				<h1>{t("signupConfirm.heading")}</h1>
				<p className="auth-subtitle">{t("signupConfirm.subtitle")}</p>
			</div>
			<form className="auth-form" onSubmit={onSubmit} aria-busy={pending}>
				<FormError error={error} />
				<button className="auth-action" disabled={pending}>
					{pending ? t("signupConfirm.confirming") : t("signupConfirm.submit")}
				</button>
				<div className="auth-links">
					<Link to="/signup/resend">{t("signupConfirm.requestNewLink")}</Link>
				</div>
			</form>
		</AuthLayout>
	);
}
