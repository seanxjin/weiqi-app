import { useEffect, useState, type InputHTMLAttributes, type ReactNode } from "react";
import { Link } from "react-router";
import { StoneMark } from "../../components/StoneMark";
import backIcon from "../../assets/auth/back.svg";
import visibilityIcon from "../../assets/auth/visibility.svg";
import passwordIcon from "../../assets/auth/password.svg";
import "./AuthPages.css";

type AuthLayoutProps = {
	title: string;
	children: ReactNode;
	backTo?: string;
	accountLink?: { prompt: string; label: string; to: string };
};

export function AuthLayout({ title, children, backTo, accountLink }: AuthLayoutProps) {
	useEffect(() => {
		document.title = `Baduk — ${title}`;
	}, [title]);

	return (
		<div className="auth-page">
			<header className="auth-header">
				<div className="auth-header__back">
					{backTo && (
						<Link to={backTo}>
							<img src={backIcon} alt="" />
							Back
						</Link>
					)}
				</div>
				<Link to="/" className="auth-brand" aria-label="Baduk home">
					<StoneMark style="polished" size={34} />
					<span>BADUK</span>
				</Link>
				<div className="auth-header__account">
					{accountLink && (
						<>
							<span>{accountLink.prompt}</span>
							<Link to={accountLink.to}>{accountLink.label}</Link>
						</>
					)}
				</div>
			</header>
			<main className="auth-main" id="main-content">
				<div className="auth-column">{children}</div>
			</main>
			<footer className="auth-footer">
				<p>© 2026 Baduk</p>
				<div>
					<span>Help</span>
					<span>English</span>
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
					aria-label={visible ? "Hide password" : "Show password"}
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
	return (
		<p className="auth-terms">
			By continuing, you agree to our Terms of Service
			<br />
			and Privacy Policy.
		</p>
	);
}
