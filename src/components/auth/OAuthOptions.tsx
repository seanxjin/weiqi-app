import { useTranslation } from "react-i18next";
import githubIcon from "@/assets/icons/common/github.svg";
import googleIcon from "@/assets/icons/common/google.svg";

export function OAuthOptions() {
	const { t } = useTranslation("auth");
	return (
		<>
			<div className="auth-divider">{t("oauth.divider")}</div>
			<div className="auth-providers">
				<a className="auth-provider" href="/api/auth/oauth/google?redirect=/play">
					<img src={googleIcon} alt="" />
					{t("oauth.google")}
				</a>
				<a className="auth-provider" href="/api/auth/oauth/github?redirect=/play">
					<img src={githubIcon} alt="" />
					{t("oauth.github")}
				</a>
			</div>
		</>
	);
}
