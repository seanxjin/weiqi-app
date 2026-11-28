import { apiRequest } from "@/api/client";
import type { Account } from "@/types/account";

export type PasswordResetInfo = { username: string; twoFactor: boolean };

export async function getAccount() {
	return apiRequest<Account>("/account", undefined, "GET");
}

export async function logout() {
	await apiRequest("/auth/logout");
}

export async function login(credentials: { login: string; password: string; totp?: string }) {
	return apiRequest<Account>("/auth/login", credentials);
}

export async function verifyTwoFactor(code: string) {
	return apiRequest<Account>("/auth/two-factor", { code });
}

export async function signup(details: { username: string; email: string; password: string }) {
	await apiRequest("/auth/signup", details, "POST");
}

export async function fixSignupEmail(details: { login: string; password: string; email: string }) {
	await apiRequest("/auth/signup/fix-email", details);
}

export async function confirmSignup(token: string) {
	return apiRequest<Account>("/auth/signup/confirm", { token });
}

export async function completeOAuthSignup(username: string) {
	return apiRequest<Account>("/auth/oauth/complete", { username });
}

export async function requestPasswordReset(email: string) {
	await apiRequest("/auth/password-reset", { email });
}

export async function getPasswordResetInfo(token: string) {
	return apiRequest<PasswordResetInfo>(`/auth/password-reset/${encodeURIComponent(token)}`, undefined, "GET");
}

export async function confirmPasswordReset(token: string, details: { password: string; totp?: string }) {
	return apiRequest<Account>(`/auth/password-reset/${encodeURIComponent(token)}`, details);
}
