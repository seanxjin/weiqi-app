import type { LocalePreferences } from "@/types/settings";

const relativeUnits: [Intl.RelativeTimeFormatUnit, number][] = [
	["year", 365 * 24 * 60 * 60],
	["month", 30 * 24 * 60 * 60],
	["week", 7 * 24 * 60 * 60],
	["day", 24 * 60 * 60],
	["hour", 60 * 60],
	["minute", 60],
	["second", 1],
];

// Builds formatters that honour the user's language, time zone, and 12/24-hour choice.
export function createDateFormatter({ language, timeZone, timeFormat }: LocalePreferences) {
	const zone: Intl.DateTimeFormatOptions = timeZone === "auto" ? {} : { timeZone };
	const hourCycle: Intl.DateTimeFormatOptions =
		timeFormat === "auto" ? {} : { hourCycle: timeFormat === "12h" ? "h12" : "h23" };
	const dateFormat = new Intl.DateTimeFormat(language, { ...zone, year: "numeric", month: "short", day: "numeric" });
	const timeFormatter = new Intl.DateTimeFormat(language, {
		...zone,
		...hourCycle,
		hour: "numeric",
		minute: "2-digit",
	});
	const dateTimeFormat = new Intl.DateTimeFormat(language, {
		...zone,
		...hourCycle,
		dateStyle: "medium",
		timeStyle: "short",
	});
	const relativeFormat = new Intl.RelativeTimeFormat(language, { numeric: "auto" });

	return {
		formatDate: (date: Date) => dateFormat.format(date),
		formatTime: (date: Date) => timeFormatter.format(date),
		formatDateTime: (date: Date) => dateTimeFormat.format(date),
		formatRelative: (date: Date, now = new Date()) => {
			const seconds = (date.getTime() - now.getTime()) / 1000;
			const [unit, unitSeconds] =
				relativeUnits.find(([, size]) => Math.abs(seconds) >= size) ?? relativeUnits[relativeUnits.length - 1];
			return relativeFormat.format(Math.round(seconds / unitSeconds), unit);
		},
	};
}

export type DateFormatter = ReturnType<typeof createDateFormatter>;
