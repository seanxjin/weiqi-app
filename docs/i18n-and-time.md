# Language & Time

## Overview

| Piece | Location |
| --- | --- |
| Supported languages (global constant) | `src/i18n/languages.ts` |
| i18next setup, lazy loading, `<html lang/dir>` sync | `src/i18n/index.ts` |
| English source strings (bundled, typed) | `src/i18n/locales/en/*.json` |
| Other languages (loaded on demand) | `src/i18n/locales/<code>/*.json` |
| Time zone / clock preferences | `src/context/LocalePreferencesProvider.tsx` |
| Date & time formatting | `src/lib/dateFormat.ts`, `src/hooks/useDateFormat.ts` |
| Settings page | `/settings/language` → `src/pages/settings/LanguageTimeSettingsPage.tsx` |
| Language picker (button + dialog) | `src/components/ui/LanguagePicker.tsx` |

Choices are stored in `localStorage` (`weiqi:language`, `weiqi:time-preferences`). `LocalePreferences` in `src/types/settings.ts` is shaped to move into the backend preferences later.

## Namespaces

One JSON file per page or layout area. Keys are nested by component, then section.

| Namespace | Covers |
| --- | --- |
| `common` | Brand, shared actions (Save, Cancel, Back…), shared statuses |
| `nav` | App shell, sidebar, drawer |
| `auth` | Sign in, sign up, password reset, auth layout |
| `errors` | API, validation and form errors |
| `welcome` | Landing page |
| `play` | Play home, materials |
| `setup` | Game setup, time controls |
| `game` | Local and online games |
| `settings` | Settings pages |
| `profile` | Member profile |

## Common tasks

| Task | Steps |
| --- | --- |
| Add a string | Add the key to `locales/en/<ns>.json`, use `t("<ns>:key")`, then add it to every other locale. Missing keys fall back to English. |
| Add a namespace | Create `locales/en/<ns>.json`, register it in `src/i18n/resources.ts`, then add the file to every locale. |
| Add a language | Add an entry to `languages.ts` (code, native name, English name, `dir`) and create `locales/<code>/` with every namespace. |
| Use text outside React | `import i18n from "@/i18n"` and call `i18n.t(...)`. |
| Format a date | `const { formatDate, formatTime, formatDateTime, formatRelative } = useDateFormat()`. Never call `toLocale*String` directly. |

## Rules

- Use interpolation (`{{name}}`) and plurals (`key_one` / `key_other`), never string concatenation.
- Don't translate user content, usernames, or board coordinates.
- Prefer CSS logical properties (`margin-inline-start`, `inset-inline-end`, `text-align: start`) so RTL languages (`ar`, `fa`, `he`, `ur`) lay out correctly. The Go board always stays LTR.
- Regional variants fall back to a sibling before English: `pt-BR → pt`, `nl-BE → nl`, `zh-HK → zh-TW`.
- Non-English locales were machine-translated and should be reviewed by native speakers.

## Time settings today

| Option | Values | Applies to |
| --- | --- | --- |
| Time zone | Automatic (device) or any IANA zone | All formatted dates and times |
| Clock | Automatic (from language), 12-hour, 24-hour | All formatted times |

## Future time options

| Option | Notes |
| --- | --- |
| Date order / style | Override language default (e.g. `2026-01-15` vs `15 Jan 2026`). |
| First day of week | Needed once calendars or tournament schedules exist. |
| Relative vs absolute timestamps | Toggle "2 days ago" vs exact date in lists and chat. |
| Game clock display | Show tenths under 10 s, warn at a chosen threshold, sound on low time. |
| Correspondence deadlines | Show move deadlines in your zone with an "opponent's local time" hint. |
| Tournament times | Display event start times in your zone and the organiser's zone. |
| Sync to account | Store language and time preferences server-side so they follow the user across devices. |
