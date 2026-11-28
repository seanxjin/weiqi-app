import { useEffect, useState, type InputHTMLAttributes, type ReactNode } from "react";
import { Trans, useTranslation } from "react-i18next";
import { Link } from "react-router";
import { StoneMark } from "@/components/ui/StoneMark";
import { LanguagePicker } from "@/components/ui/LanguagePicker";
import type { AuthLink } from "@/data/authLinks";
import backIcon from "@/assets/icons/auth/back.svg";
import visibilityIcon from "@/assets/icons/common/visibility.svg";
import passwordIcon from "@/assets/icons/auth/password.svg";
import "@/styles/auth.css";

type AuthLayoutProps = {
	title: string;
	children: ReactNode;
	backTo?: string;
	accountLink?: AuthLink;
};

export function AuthLayout({ title, children, backTo, accountLink }: AuthLayoutProps) {
	const { t } = useTranslation(["auth", "common"]);
	useEffect(() => {
		document.title = t("common:pageTitle", { title });
	}, [t, title]);

	return (
		<div className="auth-page">
			<header className="auth-header">
				<div className="auth-header__back">
					{backTo && (
						<Link to={backTo}>
							<img src={backIcon} alt="" />
							{t("common:actions.back")}
						</Link>
					)}
				</div>
				<Link to="/" className="auth-brand" aria-label={t("common:homeLink")}>
					<StoneMark style="polished" size={34} />
					<span>{t("common:brand")}</span>
				</Link>
				<div className="auth-header__account">
					{accountLink && (
						<>
							<span>{t(accountLink.prompt)}</span>
							<Link to={accountLink.to}>{t(accountLink.label)}</Link>
						</>
					)}
				</div>
			</header>
			<main className="auth-main" id="main-content">
				<div className="auth-column">{children}</div>
			</main>
			<footer className="auth-footer">
				<p>{t("layout.copyright")}</p>
				<div>
					<span>{t("layout.help")}</span>
					<LanguagePicker />
				</div>
			</footer>
		</div>
	);
}

type AuthFieldProps = InputHTMLAttributes<HTMLInputElement> & {
	label: string;
	icon?: string;
	guidance?: string;
	trailing?: ReactNode;
};

export function AuthField({ label, icon, guidance, trailing, ...input }: AuthFieldProps) {
	const id = input.id ?? input.name;
	return (
		<div className="auth-field">
			<label htmlFor={id}>{label}</label>
			<div className="auth-input">
				{icon && <img src={icon} alt="" />}
				<input {...input} id={id} aria-describedby={guidance ? `${id}-guidance` : undefined} />
				{trailing}
			</div>
			{guidance && (
				<p className="auth-guidance" id={`${id}-guidance`}>
					{guidance}
				</p>
			)}
		</div>
	);
}

export function AuthPasswordField(props: Omit<AuthFieldProps, "type" | "icon" | "trailing">) {
	const { t } = useTranslation("auth");
	const [visible, setVisible] = useState(false);
	return (
		<AuthField
			{...props}
			icon={passwordIcon}
			type={visible ? "text" : "password"}
			trailing={
				<button
					type="button"
					className="auth-visibility"
					aria-label={visible ? t("layout.hidePassword") : t("layout.showPassword")}
					aria-pressed={visible}
					onClick={() => setVisible((value) => !value)}
				>
					<img src={visibilityIcon} alt="" />
				</button>
			}
		/>
	);
}

export function AuthTerms() {
	const { t } = useTranslation("auth");
	return (
		<p className="auth-terms">
			<Trans t={t} i18nKey="layout.terms" components={{ br: <br /> }} />
		</p>
	);
}
