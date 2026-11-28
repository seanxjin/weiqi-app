import auth from "./locales/en/auth.json";
import common from "./locales/en/common.json";
import errors from "./locales/en/errors.json";
import game from "./locales/en/game.json";
import nav from "./locales/en/nav.json";
import play from "./locales/en/play.json";
import profile from "./locales/en/profile.json";
import settings from "./locales/en/settings.json";
import setup from "./locales/en/setup.json";
import welcome from "./locales/en/welcome.json";

// English is bundled eagerly as the fallback and as the source of translation key types.
export const englishResources = { common, nav, auth, errors, welcome, play, setup, game, settings, profile };

export type Namespace = keyof typeof englishResources;

export const namespaces = Object.keys(englishResources) as Namespace[];

export const defaultNamespace = "common" satisfies Namespace;
