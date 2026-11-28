import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import { fixSignupEmail } from "@/api/auth";
import emailIcon from "@/assets/icons/auth/email.svg";
import usernameIcon from "@/assets/icons/auth/username.svg";
import { FormError } from "@/components/auth/FormError";
import { signInLink } from "@/data/authLinks";
import { useSubmit } from "@/hooks/useAuthForm";
import { AuthField, AuthLayout, AuthPasswordField } from "@/layouts/AuthLayout";
import { formField } from "@/lib/authValidation";

export function ResendConfirmationPage() {
	const { t } = useTranslation("auth");
	const [sent, setSent] = useState(false);
	const { error, pending, onSubmit } = useSubmit(async (form) => {
		await fixSignupEmail({
			login: formField(form, "login"),
			password: formField(form, "password"),
			email: formField(form, "email"),
		});
		setSent(true);
	});
	return (
		<AuthLayout title={t("resendConfirmation.pageTitle")} backTo="/login" accountLink={signInLink}>
			<div className="auth-heading">
				<h1>{sent ? t("shared.checkEmail") : t("resendConfirmation.heading")}</h1>
				<p className="auth-subtitle">{t("resendConfirmation.subtitle")}</p>
			</div>
			{sent ? (
				<>
					<p className="auth-status" role="status">
						{t("resendConfirmation.sent")}
					</p>
					<div className="auth-links">
						<Link to="/login">{t("shared.returnToSignIn")}</Link>
					</div>
				</>
			) : (
				<form className="auth-form" onSubmit={onSubmit} aria-busy={pending}>
					<AuthField
						name="login"
						label={t("resendConfirmation.fields.login.label")}
						icon={usernameIcon}
						placeholder={t("resendConfirmation.fields.login.placeholder")}
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
					<AuthField
						name="email"
						label={t("resendConfirmation.fields.email.label")}
						icon={emailIcon}
						type="email"
						placeholder={t("resendConfirmation.fields.email.placeholder")}
						autoComplete="email"
						maxLength={254}
						required
					/>
					<FormError error={error} />
					<button className="auth-action" disabled={pending}>
						{pending ? t("shared.sending") : t("resendConfirmation.submit")}
					</button>
				</form>
			)}
		</AuthLayout>
	);
}
