export type TextDirection = "ltr" | "rtl";

export type Language = {
	code: string;
	nativeName: string;
	englishName: string;
	dir: TextDirection;
};

// Single source of truth for every language the app supports. Each code needs a matching src/i18n/locales/<code>/ folder.
export const languages = [
	{ code: "af", nativeName: "Afrikaans", englishName: "Afrikaans", dir: "ltr" },
	{ code: "az", nativeName: "Azərbaycanca", englishName: "Azerbaijani", dir: "ltr" },
	{ code: "id", nativeName: "Bahasa Indonesia", englishName: "Indonesian", dir: "ltr" },
	{ code: "ms", nativeName: "Bahasa Melayu", englishName: "Malay", dir: "ltr" },
	{ code: "bs", nativeName: "Bosanski", englishName: "Bosnian", dir: "ltr" },
	{ code: "ca", nativeName: "Català", englishName: "Catalan", dir: "ltr" },
	{ code: "cs", nativeName: "Čeština", englishName: "Czech", dir: "ltr" },
	{ code: "da", nativeName: "Dansk", englishName: "Danish", dir: "ltr" },
	{ code: "de", nativeName: "Deutsch", englishName: "German", dir: "ltr" },
	{ code: "et", nativeName: "Eesti", englishName: "Estonian", dir: "ltr" },
	{ code: "en", nativeName: "English", englishName: "English", dir: "ltr" },
	{ code: "es", nativeName: "Español", englishName: "Spanish", dir: "ltr" },
	{ code: "fr", nativeName: "Français", englishName: "French", dir: "ltr" },
	{ code: "gl", nativeName: "Galego", englishName: "Galician", dir: "ltr" },
	{ code: "hr", nativeName: "Hrvatski", englishName: "Croatian", dir: "ltr" },
	{ code: "is", nativeName: "Íslenska", englishName: "Icelandic", dir: "ltr" },
	{ code: "it", nativeName: "Italiano", englishName: "Italian", dir: "ltr" },
	{ code: "lv", nativeName: "Latviešu", englishName: "Latvian", dir: "ltr" },
	{ code: "lt", nativeName: "Lietuvių", englishName: "Lithuanian", dir: "ltr" },
	{ code: "hu", nativeName: "Magyar", englishName: "Hungarian", dir: "ltr" },
	{ code: "nl", nativeName: "Nederlands", englishName: "Dutch", dir: "ltr" },
	{ code: "nb", nativeName: "Norsk", englishName: "Norwegian", dir: "ltr" },
	{ code: "uz", nativeName: "Oʻzbekcha", englishName: "Uzbek", dir: "ltr" },
	{ code: "fil", nativeName: "Pilipino", englishName: "Filipino", dir: "ltr" },
	{ code: "pl", nativeName: "Polski", englishName: "Polish", dir: "ltr" },
	{ code: "pt", nativeName: "Português", englishName: "Portuguese", dir: "ltr" },
	{ code: "pt-BR", nativeName: "Português (BR)", englishName: "Portuguese (BR)", dir: "ltr" },
	{ code: "ro", nativeName: "Română", englishName: "Romanian", dir: "ltr" },
	{ code: "sq", nativeName: "Shqipe", englishName: "Albanian", dir: "ltr" },
	{ code: "sk", nativeName: "Slovenčina", englishName: "Slovak", dir: "ltr" },
	{ code: "sl", nativeName: "Slovenščina", englishName: "Slovenian", dir: "ltr" },
	{ code: "fi", nativeName: "Suomi", englishName: "Finnish", dir: "ltr" },
	{ code: "sv", nativeName: "Svenska", englishName: "Swedish", dir: "ltr" },
	{ code: "vi", nativeName: "Tiếng Việt", englishName: "Vietnamese", dir: "ltr" },
	{ code: "tk", nativeName: "Türkmençe", englishName: "Turkmen", dir: "ltr" },
	{ code: "tr", nativeName: "Türkçe", englishName: "Turkish", dir: "ltr" },
	{ code: "nl-BE", nativeName: "Vlaams", englishName: "Flemish", dir: "ltr" },
	{ code: "el", nativeName: "Ελληνικά", englishName: "Greek", dir: "ltr" },
	{ code: "be", nativeName: "Беларуская", englishName: "Belarusian", dir: "ltr" },
	{ code: "bg", nativeName: "Български", englishName: "Bulgarian", dir: "ltr" },
	{ code: "ru", nativeName: "Русский", englishName: "Russian", dir: "ltr" },
	{ code: "sr", nativeName: "Српски", englishName: "Serbian", dir: "ltr" },
	{ code: "uk", nativeName: "Українська", englishName: "Ukrainian", dir: "ltr" },
	{ code: "ka", nativeName: "ქართული", englishName: "Georgian", dir: "ltr" },
	{ code: "hy", nativeName: "Հայերեն", englishName: "Armenian", dir: "ltr" },
	{ code: "he", nativeName: "עברית", englishName: "Hebrew", dir: "rtl" },
	{ code: "ur", nativeName: "اردو", englishName: "Urdu", dir: "rtl" },
	{ code: "ar", nativeName: "العربية", englishName: "Arabic", dir: "rtl" },
	{ code: "fa", nativeName: "فارسی", englishName: "Persian", dir: "rtl" },
	{ code: "hi", nativeName: "हिन्दी", englishName: "Hindi", dir: "ltr" },
	{ code: "bn", nativeName: "বাংলা", englishName: "Bengali", dir: "ltr" },
	{ code: "ko", nativeName: "한국어", englishName: "Korean", dir: "ltr" },
	{ code: "zh-CN", nativeName: "中文（简体）", englishName: "Chinese (Simplified)", dir: "ltr" },
	{ code: "zh-HK", nativeName: "中文（香港）", englishName: "Chinese (HK)", dir: "ltr" },
	{ code: "zh-TW", nativeName: "中文（台灣）", englishName: "Chinese (Traditional)", dir: "ltr" },
	{ code: "ja", nativeName: "日本語", englishName: "Japanese", dir: "ltr" },
] as const satisfies readonly Language[];

export type LanguageCode = (typeof languages)[number]["code"];

export const defaultLanguage: LanguageCode = "en";

export const languageCodes: LanguageCode[] = languages.map((language) => language.code);

// Regional variants fall back to their closest sibling before English.
export const languageFallbacks: Partial<Record<LanguageCode, LanguageCode[]>> = {
	"pt-BR": ["pt", "en"],
	"nl-BE": ["nl", "en"],
	"zh-HK": ["zh-TW", "en"],
};

export function findLanguage(code: string | undefined): Language {
	return (
		languages.find((language) => language.code === code) ??
		languages.find((language) => language.code === defaultLanguage)!
	);
}
