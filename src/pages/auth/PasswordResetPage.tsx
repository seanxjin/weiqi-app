import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import { requestPasswordReset } from "@/api/auth";
import emailIcon from "@/assets/icons/auth/email.svg";
import { FormError } from "@/components/auth/FormError";
import { signInLink } from "@/data/authLinks";
import { useSubmit } from "@/hooks/useAuthForm";
import { AuthField, AuthLayout } from "@/layouts/AuthLayout";
import { formField } from "@/lib/authValidation";

export function PasswordResetPage() {
	const { t } = useTranslation("auth");
	const [sent, setSent] = useState(false);
	const { error, pending, onSubmit } = useSubmit(async (form) => {
		await requestPasswordReset(formField(form, "email"));
		setSent(true);
	});
	return (
		<AuthLayout title={t("passwordReset.pageTitle")} backTo="/login" accountLink={signInLink}>
			<div className="auth-heading">
				<h1>{sent ? t("shared.checkEmail") : t("passwordReset.heading")}</h1>
				<p className="auth-subtitle">{t("passwordReset.subtitle")}</p>
			</div>
			{sent ? (
				<>
					<p className="auth-status" role="status">
						{t("passwordReset.sent")}
					</p>
					<div className="auth-links">
						<Link to="/login">{t("shared.returnToSignIn")}</Link>
					</div>
				</>
			) : (
				<form className="auth-form" onSubmit={onSubmit} aria-busy={pending}>
					<AuthField
						name="email"
						label={t("fields.email.label")}
						icon={emailIcon}
						type="email"
						placeholder={t("passwordReset.fields.email.placeholder")}
						autoComplete="email"
						maxLength={254}
						required
					/>
					<FormError error={error} />
					<button className="auth-action" disabled={pending}>
						{pending ? t("shared.sending") : t("passwordReset.submit")}
					</button>
				</form>
			)}
		</AuthLayout>
	);
}
