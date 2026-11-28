import { Link } from "react-router";

import emailLightIcon from "@/assets/icons/auth/email-light.svg";
import boardStillLife from "@/assets/images/board-still-life.png";
import { OAuthOptions } from "@/components/auth/OAuthOptions";
import { signupLink } from "@/data/authLinks";
import { AuthLayout, AuthTerms } from "@/layouts/AuthLayout";

export function SignupOptionsPage() {
	return (
		<AuthLayout title="Create your account" accountLink={signupLink}>
			<div data-node-id="84:2">
				<div className="auth-heading">
					<h1>Create Your Baduk Account</h1>
				</div>
				<img className="auth-still-life" src={boardStillLife} alt="Go stones on a kaya wood board" />
				<Link className="auth-action" to="/signup/email">
					<img src={emailLightIcon} alt="" />
					Continue with Email
				</Link>
				<OAuthOptions />
				<AuthTerms />
			</div>
		</AuthLayout>
	);
}
