import { useId, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import type { TFunction } from "i18next";
import type { BoardSize } from "weiqi-board";
import { CustomTimeForm } from "./CustomTimeForm";
import { clockSystemNameKeys, defaultPreset, presetGroups } from "@/data/timeControls";
import type { CustomTime, TimePreset } from "@/data/timeControls";

function presetLabel(t: TFunction<"setup">, preset: TimePreset): string {
	if (preset.daysPerMove) return t("timeControl.presets.daysPerMove", { count: preset.daysPerMove });
	const minutes = preset.mainSeconds / 60;
	if (preset.system === "Absolute") {
		return preset.mainSeconds < 60
			? t("timeControl.presets.absoluteSeconds", { seconds: preset.mainSeconds })
			: t("timeControl.presets.absoluteMinutes", { minutes });
	}
	const main =
		preset.mainSeconds < 60
			? t("timeControl.presets.mainSeconds", { seconds: preset.mainSeconds })
			: t("timeControl.presets.mainMinutes", { minutes });
	if (preset.system === "Fischer")
		return t("timeControl.presets.fischer", { main, increment: preset.incrementSeconds });
	return t("timeControl.presets.byoYomi", { main, periods: preset.periods, periodSeconds: preset.periodSeconds });
}

const boardSizes: readonly BoardSize[] = [9, 13, 19];

type TimeSelection =
	| { kind: "preset"; preset: TimePreset }
	| { kind: "custom"; custom: CustomTime }
	| { kind: "noTimeLimit" };

function timeControlSummary(t: TFunction<"setup">, selection: TimeSelection): string {
	if (selection.kind === "noTimeLimit") return t("timeControl.noTimeLimit");
	if (selection.kind === "custom")
		return t("timeControl.customValue", { system: t(clockSystemNameKeys[selection.custom.system]) });
	return t("timeControl.presetValue", {
		system: t(clockSystemNameKeys[selection.preset.system]),
		preset: presetLabel(t, selection.preset),
	});
}

type GameConfigurationProps = {
	mode: "local" | "online";
	boardSize: BoardSize;
	onBoardSizeChange: (size: BoardSize) => void;
};

/**
 * Board size and time control choices, in a dropdown in the setup sidebar.
 * Local games offer no correspondence presets but can be played without a time limit.
 */
export function GameConfiguration({ mode, boardSize, onBoardSizeChange }: GameConfigurationProps) {
	const { t } = useTranslation("setup");
	const id = useId();
	const trigger = useRef<HTMLButtonElement>(null);
	const [open, setOpen] = useState(false);
	const [customOpen, setCustomOpen] = useState(false);
	const [selection, setSelection] = useState<TimeSelection>({ kind: "preset", preset: defaultPreset });
	const selectTime = (next: TimeSelection) => {
		setSelection(next);
		setOpen(false);
		trigger.current?.focus();
	};
	const groups = mode === "local" ? presetGroups.filter((group) => group.id !== "correspondence") : presetGroups;

	return (
		// biome-ignore lint/a11y/noStaticElementInteractions: Escape anywhere in the dropdown closes it and returns focus to the trigger.
		<div
			className="setup-configuration"
			onKeyDown={(event) => {
				if (event.key === "Escape" && open) {
					event.preventDefault();
					event.stopPropagation();
					setOpen(false);
					trigger.current?.focus();
				}
			}}
		>
			<button
				ref={trigger}
				className="setup-configuration__trigger"
				type="button"
				aria-expanded={open}
				aria-controls={`${id}-options`}
				onClick={() => setOpen((value) => !value)}
			>
				<span>
					<span className="setup-eyebrow">{t("configuration.eyebrow")}</span>
					<span className="setup-configuration__summary">
						{t("configuration.summary", {
							boardSize: t("page.boardSizeOption", { size: boardSize }),
							timeControl: timeControlSummary(t, selection),
						})}
					</span>
				</span>
				<span className="setup-chevron" aria-hidden="true">
					{open ? "↑" : "↓"}
				</span>
			</button>
			<div className="setup-options" id={`${id}-options`} hidden={!open}>
				<section className="setup-speed" aria-labelledby={`${id}-board-size`}>
					<h3 className="setup-speed__heading" id={`${id}-board-size`}>
						{t("page.boardSize")}
					</h3>
					<div className="setup-presets">
						{boardSizes.map((size) => (
							<button
								key={size}
								type="button"
								className="setup-preset"
								aria-pressed={boardSize === size}
								onClick={() => onBoardSizeChange(size)}
							>
								{t("page.boardSizeOption", { size })}
							</button>
						))}
					</div>
				</section>
				{mode === "local" && (
					<section className="setup-speed" aria-labelledby={`${id}-untimed`}>
						<h3 className="setup-speed__heading" id={`${id}-untimed`}>
							{t("timeControl.groups.untimed")}
						</h3>
						<div className="setup-presets">
							<button
								type="button"
								className="setup-preset"
								aria-pressed={selection.kind === "noTimeLimit"}
								onClick={() => selectTime({ kind: "noTimeLimit" })}
							>
								{t("timeControl.noTimeLimit")}
							</button>
						</div>
					</section>
				)}
				{groups.map((group) => (
					<section className="setup-speed" key={group.id} aria-labelledby={`${id}-${group.id}`}>
						<h3 className="setup-speed__heading" id={`${id}-${group.id}`}>
							{t(`timeControl.groups.${group.id}`)}
						</h3>
						<div className="setup-presets">
							{group.presets.map((option) => (
								<button
									key={option.id}
									type="button"
									className="setup-preset"
									aria-pressed={selection.kind === "preset" && selection.preset.id === option.id}
									aria-label={t("timeControl.presetOptionLabel", {
										preset: presetLabel(t, option),
										system: t(clockSystemNameKeys[option.system]),
									})}
									onClick={() => selectTime({ kind: "preset", preset: option })}
								>
									{presetLabel(t, option)}
								</button>
							))}
						</div>
					</section>
				))}
				<button
					className="setup-more"
					type="button"
					aria-expanded={customOpen}
					aria-controls={`${id}-custom`}
					onClick={() => setCustomOpen((value) => !value)}
				>
					<span>{customOpen ? t("timeControl.fewerControls") : t("timeControl.moreControls")}</span>
					<span aria-hidden="true">{customOpen ? "−" : "+"}</span>
				</button>
				<div id={`${id}-custom`} hidden={!customOpen}>
					<CustomTimeForm
						onApply={(value) => {
							setCustomOpen(false);
							selectTime({ kind: "custom", custom: value });
						}}
					/>
				</div>
			</div>
			<p className="setup-notice">{t("page.timeLimitsNotice")}</p>
		</div>
	);
}
