export const countryCodes = ["CA", "CN", "FR", "DE", "JP", "KR", "TW", "GB", "US"];

// Country names come from the browser so they follow the selected language.
export function countryName(code: string, language: string) {
	if (!code) return "";
	return new Intl.DisplayNames([language], { type: "region" }).of(code) ?? code;
}

export function countryFlag(code: string) {
	if (!code) return "";
	return String.fromCodePoint(...[...code].map((letter) => 0x1f1a5 + letter.charCodeAt(0)));
}
