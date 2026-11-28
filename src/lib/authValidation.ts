import i18n from "@/i18n";

export const usernamePattern = "[A-Za-z0-9]+(?:[_-]?[A-Za-z0-9]+)*";

export const formField = (form: FormData, name: string) => String(form.get(name) ?? "");

export function validateNewPassword(password: string) {
	if (password.length < 8) throw new Error(i18n.t("errors:validation.passwordTooShort"));
	if (new TextEncoder().encode(password).length > 72) {
		throw new Error(i18n.t("errors:validation.passwordTooLong"));
	}
}

export function validatePasswordChange(form: FormData) {
	const next = String(form.get("newPassword") ?? "");
	if (next.length < 8) return i18n.t("errors:validation.newPasswordTooShort");
	if (new TextEncoder().encode(next).length > 72) return i18n.t("errors:validation.passwordTooLong");
	if (next !== form.get("confirmPassword")) return i18n.t("errors:validation.passwordMismatch");
	if (next === form.get("currentPassword")) return i18n.t("errors:validation.passwordUnchanged");
	return null;
}
