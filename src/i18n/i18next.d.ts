import "i18next";
import type { defaultNamespace, englishResources } from "./resources";

declare module "i18next" {
	interface CustomTypeOptions {
		defaultNS: typeof defaultNamespace;
		resources: typeof englishResources;
	}
}
