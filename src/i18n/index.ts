import i18n, { type BackendModule, type ResourceKey } from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
import { defaultLanguage, findLanguage, languageCodes, languageFallbacks } from "./languages";
import { defaultNamespace, englishResources, namespaces } from "./resources";

export const languageStorageKey = "weiqi:language";

const localeFiles = import.meta.glob<{ default: ResourceKey }>(["./locales/*/*.json", "!./locales/en/*.json"]);

// Loads non-English namespaces on demand so each language ships as its own chunk.
const lazyLocaleBackend: BackendModule = {
	type: "backend",
	init() {},
	read(language, namespace, callback) {
		const loadLocaleFile = localeFiles[`./locales/${language}/${namespace}.json`];
		if (!loadLocaleFile) {
			callback(null, {});
			return;
		}
		const readLocaleFile = async () => {
			try {
				const localeFile = await loadLocaleFile();
				callback(null, localeFile.default);
			} catch (error) {
				callback(error as Error, null);
			}
		};
		void readLocaleFile();
	},
};

function applyDocumentLanguage(language: string) {
	document.documentElement.lang = language;
	document.documentElement.dir = findLanguage(language).dir;
}

i18n.on("languageChanged", applyDocumentLanguage);

void i18n
	.use(lazyLocaleBackend)
	.use(LanguageDetector)
	.use(initReactI18next)
	.init({
		resources: { en: englishResources },
		partialBundledLanguages: true,
		supportedLngs: languageCodes,
		fallbackLng: { ...languageFallbacks, default: [defaultLanguage] },
		load: "currentOnly",
		ns: namespaces,
		defaultNS: defaultNamespace,
		interpolation: { escapeValue: false },
		detection: {
			order: ["localStorage", "navigator"],
			lookupLocalStorage: languageStorageKey,
			caches: ["localStorage"],
		},
	});

export default i18n;
