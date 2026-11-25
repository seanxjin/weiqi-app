export const usernamePattern = "[A-Za-z0-9]+(?:[_-]?[A-Za-z0-9]+)*";
export const usernameTitle = "2–20 letters or digits, with single underscores or hyphens between them.";
export const passwordGuidance = "Use at least 8 characters and no more than 72 UTF-8 bytes.";

export const formField = (form: FormData, name: string) => String(form.get(name) ?? "");

export function validateNewPassword(password: string) {
	if (password.length < 8) throw new Error("Use at least 8 characters for your password.");
	if (new TextEncoder().encode(password).length > 72) {
		throw new Error("Your password must not exceed 72 UTF-8 bytes.");
	}
}

export function validatePasswordChange(form: FormData) {
	const next = String(form.get("newPassword") ?? "");
	if (next.length < 8) return "Use at least 8 characters for your new password.";
	if (new TextEncoder().encode(next).length > 72) return "Your password must not exceed 72 UTF-8 bytes.";
	if (next !== form.get("confirmPassword")) return "The new passwords do not match.";
	if (next === form.get("currentPassword")) return "Choose a password different from your current one.";
	return null;
}
