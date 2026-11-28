import type { ParseKeys } from "i18next";

export type AuthLink = { prompt: ParseKeys<"auth">; label: ParseKeys<"auth">; to: string };

export const signInLink: AuthLink = {
	prompt: "accountLinks.signIn.prompt",
	label: "accountLinks.signIn.label",
	to: "/login",
};
export const signupLink: AuthLink = {
	prompt: "accountLinks.signUp.prompt",
	label: "accountLinks.signUp.label",
	to: "/signup",
};
