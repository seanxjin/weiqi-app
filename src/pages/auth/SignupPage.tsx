import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import { signup } from "@/api/auth";
import emailIcon from "@/assets/icons/auth/email.svg";
import usernameIcon from "@/assets/icons/auth/username.svg";
import { FormError } from "@/components/auth/FormError";
import { signInLink } from "@/data/authLinks";
import { useSubmit } from "@/hooks/useAuthForm";
import { AuthField, AuthLayout, AuthPasswordField, AuthTerms } from "@/layouts/AuthLayout";
import { formField, usernamePattern, validateNewPassword } from "@/lib/authValidation";

export function SignupPage() {
	const { t } = useTranslation(["auth", "common"]);
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
		<AuthLayout title={t("signup.pageTitle")} backTo="/signup" accountLink={signInLink}>
			<div data-node-id="86:2">
				<div className="auth-heading">
					<p className="auth-eyebrow">{t("shared.eyebrow")}</p>
					<h1>{sent ? t("shared.checkEmail") : t("signup.heading")}</h1>
					<p className="auth-subtitle">{sent ? t("signup.sentSubtitle") : t("signup.subtitle")}</p>
				</div>
				{sent ? (
					<>
						<p className="auth-status" role="status">
							{t("signup.sent")}
						</p>
						<div className="auth-links">
							<Link to="/signup/resend">{t("signup.resendConfirmation")}</Link>
							<Link to="/login">{t("common:actions.signIn")}</Link>
						</div>
					</>
				) : (
					<>
						<form className="auth-form" onSubmit={onSubmit} aria-busy={pending}>
							<AuthField
								name="username"
								label={t("fields.username.label")}
								icon={usernameIcon}
								placeholder={t("fields.username.placeholder")}
								autoComplete="username"
								minLength={2}
								maxLength={20}
								pattern={usernamePattern}
								title={t("fields.username.title")}
								guidance={t("fields.username.guidance")}
								required
							/>
							<AuthField
								name="email"
								label={t("fields.email.label")}
								icon={emailIcon}
								type="email"
								placeholder={t("signup.fields.email.placeholder")}
								autoComplete="email"
								maxLength={254}
								required
							/>
							<AuthPasswordField
								name="password"
								label={t("fields.password.label")}
								placeholder={t("signup.fields.password.placeholder")}
								autoComplete="new-password"
								minLength={8}
								guidance={t("fields.password.guidance")}
								required
							/>
							<FormError error={error} />
							<button className="auth-action" disabled={pending}>
								{pending ? t("shared.creatingAccount") : t("signup.submit")}
							</button>
						</form>
						<AuthTerms />
					</>
				)}
			</div>
		</AuthLayout>
	);
}
