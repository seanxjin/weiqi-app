import { useTranslation } from "react-i18next";
import { Link, useSearchParams } from "react-router";
import { completeOAuthSignup } from "@/api/auth";
import usernameIcon from "@/assets/icons/auth/username.svg";
import { FormError } from "@/components/auth/FormError";
import { signInLink } from "@/data/authLinks";
import { useSignIn, useSubmit } from "@/hooks/useAuthForm";
import { AuthField, AuthLayout, AuthTerms } from "@/layouts/AuthLayout";
import { formField, usernamePattern } from "@/lib/authValidation";

export function OAuthSignupPage() {
	const { t } = useTranslation("auth");
	const signIn = useSignIn();
	const [params] = useSearchParams();
	const { error, pending, onSubmit } = useSubmit((form) => signIn(completeOAuthSignup(formField(form, "username"))));
	return (
		<AuthLayout title={t("oauthSignup.pageTitle")} backTo="/signup" accountLink={signInLink}>
			<div className="auth-heading">
				<p className="auth-eyebrow">{t("shared.eyebrow")}</p>
				<h1>{t("oauthSignup.heading")}</h1>
				<p className="auth-subtitle">{t("oauthSignup.subtitle")}</p>
			</div>
			<form className="auth-form" onSubmit={onSubmit} aria-busy={pending}>
				<AuthField
					name="username"
					label={t("fields.username.label")}
					icon={usernameIcon}
					defaultValue={params.get("username") ?? ""}
					placeholder={t("fields.username.placeholder")}
					autoComplete="username"
					minLength={2}
					maxLength={20}
					pattern={usernamePattern}
					title={t("fields.username.title")}
					required
				/>
				<FormError error={error} />
				<button className="auth-action" disabled={pending}>
					{pending ? t("shared.creatingAccount") : t("oauthSignup.submit")}
				</button>
				<div className="auth-links">
					<Link to="/signup">{t("oauthSignup.restart")}</Link>
				</div>
			</form>
			<AuthTerms />
		</AuthLayout>
	);
}
