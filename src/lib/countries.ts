export const countries = [
	{ code: "", name: "Not set" },
	{ code: "CA", name: "Canada" },
	{ code: "CN", name: "China" },
	{ code: "FR", name: "France" },
	{ code: "DE", name: "Germany" },
	{ code: "JP", name: "Japan" },
	{ code: "KR", name: "South Korea" },
	{ code: "TW", name: "Taiwan" },
	{ code: "GB", name: "United Kingdom" },
	{ code: "US", name: "United States" },
];

export function countryName(code: string) {
	return countries.find((country) => country.code === code)?.name ?? "";
}

export function countryFlag(code: string) {
	if (!code) return "";
	return String.fromCodePoint(...[...code].map((letter) => 0x1f1a5 + letter.charCodeAt(0)));
}
