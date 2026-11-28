export const clockSystems = ["Absolute", "Fischer", "Japanese Byo-yomi"] as const;
export type ClockSystem = (typeof clockSystems)[number];

export const clockSystemNameKeys = {
	Absolute: "timeControl.systems.absolute",
	Fischer: "timeControl.systems.fischer",
	"Japanese Byo-yomi": "timeControl.systems.japaneseByoYomi",
} as const satisfies Record<ClockSystem, string>;

export interface TimePreset {
	id: string;
	system: ClockSystem;
	mainSeconds: number;
	incrementSeconds?: number;
	periods?: number;
	periodSeconds?: number;
	daysPerMove?: number;
}
export type PresetGroupId = "bullet" | "blitz" | "rapid" | "classical" | "correspondence";
export interface CustomTime {
	system: ClockSystem;
	minutes: string;
	seconds: string;
	increment: string;
	periods: string;
	periodSeconds: string;
}
export type CustomTimeError = "wholeNumbers" | "mainSeconds" | "byoYomiPeriods" | "mainTime";

export const defaultCustomTime: CustomTime = {
	system: "Japanese Byo-yomi",
	minutes: "10",
	seconds: "00",
	increment: "5",
	periods: "5",
	periodSeconds: "30",
};

const absolute = (mainSeconds: number): TimePreset => ({
	id: `absolute-${mainSeconds}`,
	system: "Absolute",
	mainSeconds,
});
const fischer = (mainSeconds: number, incrementSeconds: number): TimePreset => ({
	id: `fischer-${mainSeconds}+${incrementSeconds}`,
	system: "Fischer",
	mainSeconds,
	incrementSeconds,
});
const byoYomi = (mainSeconds: number, periods: number, periodSeconds: number): TimePreset => ({
	id: `byoyomi-${mainSeconds}+${periods}x${periodSeconds}`,
	system: "Japanese Byo-yomi",
	mainSeconds,
	periods,
	periodSeconds,
});
const correspondence = (daysPerMove: number): TimePreset => ({
	id: `correspondence-${daysPerMove}`,
	system: "Absolute",
	mainSeconds: 0,
	daysPerMove,
});

export const defaultPreset = absolute(600);

export const presetGroups: { id: PresetGroupId; presets: TimePreset[] }[] = [
	{
		id: "bullet",
		presets: [absolute(30), fischer(30, 5), byoYomi(30, 5, 10), absolute(60), fischer(60, 2)],
	},
	{
		id: "blitz",
		presets: [absolute(180), fischer(180, 5), byoYomi(120, 5, 30), absolute(300), fischer(300, 5)],
	},
	{
		id: "rapid",
		presets: [defaultPreset, fischer(600, 5), byoYomi(300, 5, 30), absolute(900), fischer(900, 10)],
	},
	{
		id: "classical",
		presets: [absolute(1800), fischer(1800, 15), byoYomi(1800, 5, 60), absolute(3600), byoYomi(3600, 5, 60)],
	},
	{
		id: "correspondence",
		presets: [1, 3, 5, 7, 14].map(correspondence),
	},
];

export function validateCustomTime(value: CustomTime): CustomTimeError | null {
	const fields = [
		value.minutes,
		value.seconds,
		...(value.system === "Fischer" ? [value.increment] : []),
		...(value.system === "Japanese Byo-yomi" ? [value.periods, value.periodSeconds] : []),
	];
	if (fields.some((field) => !/^\d+$/.test(field) || !Number.isSafeInteger(Number(field)))) {
		return "wholeNumbers";
	}
	if (Number(value.seconds) > 59) return "mainSeconds";
	if (value.system === "Japanese Byo-yomi" && (Number(value.periods) < 1 || Number(value.periodSeconds) < 1)) {
		return "byoYomiPeriods";
	}
	const main = Number(value.minutes) * 60 + Number(value.seconds);
	if (main === 0 && value.system !== "Japanese Byo-yomi") {
		return "mainTime";
	}
	return null;
}
