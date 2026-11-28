import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import { verifyTwoFactor } from "@/api/auth";
import { FormError } from "@/components/auth/FormError";
import { useSignIn, useSubmit } from "@/hooks/useAuthForm";
import { AuthField, AuthLayout } from "@/layouts/AuthLayout";
import { formField } from "@/lib/authValidation";

export function TwoFactorLoginPage() {
	const { t } = useTranslation("auth");
	const signIn = useSignIn();
	const { error, pending, onSubmit } = useSubmit((form) => signIn(verifyTwoFactor(formField(form, "code"))));
	return (
		<AuthLayout title={t("twoFactorLogin.pageTitle")} backTo="/login">
			<div className="auth-heading">
				<h1>{t("twoFactorLogin.heading")}</h1>
				<p className="auth-subtitle">{t("twoFactorLogin.subtitle")}</p>
			</div>
			<form className="auth-form" onSubmit={onSubmit} aria-busy={pending}>
				<AuthField
					name="code"
					label={t("fields.authenticatorCode.label")}
					placeholder={t("fields.authenticatorCode.placeholder")}
					inputMode="numeric"
					autoComplete="one-time-code"
					pattern="[0-9]{6}"
					maxLength={6}
					required
				/>
				<FormError error={error} />
				<button className="auth-action" disabled={pending}>
					{pending ? t("twoFactorLogin.verifying") : t("twoFactorLogin.submit")}
				</button>
				<div className="auth-links">
					<Link to="/login">{t("twoFactorLogin.restart")}</Link>
				</div>
			</form>
		</AuthLayout>
	);
}
