import { useTranslation } from "react-i18next";
import { Link } from "react-router";

import emailLightIcon from "@/assets/icons/auth/email-light.svg";
import boardStillLife from "@/assets/images/board-still-life.png";
import { OAuthOptions } from "@/components/auth/OAuthOptions";
import { signupLink } from "@/data/authLinks";
import { AuthLayout, AuthTerms } from "@/layouts/AuthLayout";

export function SignupOptionsPage() {
	const { t } = useTranslation("auth");
	return (
		<AuthLayout title={t("signupOptions.pageTitle")} accountLink={signupLink}>
			<div data-node-id="84:2">
				<div className="auth-heading">
					<h1>{t("signupOptions.heading")}</h1>
				</div>
				<img className="auth-still-life" src={boardStillLife} alt={t("signupOptions.imageAlt")} />
				<Link className="auth-action" to="/signup/email">
					<img src={emailLightIcon} alt="" />
					{t("signupOptions.continueWithEmail")}
				</Link>
				<OAuthOptions />
				<AuthTerms />
			</div>
		</AuthLayout>
	);
}
