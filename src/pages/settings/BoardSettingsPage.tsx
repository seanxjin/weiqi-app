import { useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { createBoardGeometry } from "weiqi-board";
import type { BoardThemeId, Stone, StoneStyleId } from "weiqi-board";
import { Board, BoardCanvas, BoardCoordinates, StoneCanvas } from "@/components/board";
import { SaveActions, SettingsSection, SettingToggle } from "@/components/settings/SettingsControls";
import { useSaveStatus } from "@/hooks/useSaveStatus";
import { useSettings } from "@/hooks/useSettings";

const themes = ["kaya", "walnut", "ash"] as const satisfies BoardThemeId[];
const styles = ["polished", "satin", "matte", "snow"] as const satisfies StoneStyleId[];
const previewStones: Stone[] = [
	{ column: 2, row: 2, color: "black" },
	{ column: 6, row: 6, color: "white" },
	{ column: 6, row: 2, color: "black" },
	{ column: 2, row: 6, color: "white" },
	{ column: 4, row: 4, color: "black" },
	{ column: 5, row: 3, color: "white" },
];
const previewLastMove = { column: 5, row: 3 };
const previewGeometry = createBoardGeometry(9);

export default function BoardSettingsPage() {
	const { t } = useTranslation(["settings", "common"]);
	const { preferences, setPreferences } = useSettings();
	const [draft, setDraft] = useState(preferences);
	const status = useSaveStatus();
	const dirty = (Object.keys(draft) as (keyof typeof draft)[]).some((key) => draft[key] !== preferences[key]);
	const update = (change: Partial<typeof draft>) => {
		status.clear();
		setDraft((value) => ({ ...value, ...change }));
	};

	const save = (event: FormEvent) => {
		event.preventDefault();
		setPreferences(draft);
		status.show(t("common:status.saved"));
	};

	return (
		<form className="settings-page" onSubmit={save}>
			<header className="settings-page__header">
				<h2>{t("sections.board")}</h2>
				<p>{t("board.description")}</p>
			</header>
			<SettingsSection title={t("board.appearance.title")}>
				<div className="board-settings">
					<div className="board-settings__choices">
						<fieldset className="material-choices">
							<legend>{t("board.appearance.boardLegend")}</legend>
							{themes.map((theme) => (
								<label key={theme} className="material-choice" title={t(`board.themes.${theme}`)}>
									<input
										type="radio"
										name="boardTheme"
										value={theme}
										checked={draft.boardTheme === theme}
										onChange={() => update({ boardTheme: theme })}
									/>
									<span aria-hidden="true">
										<BoardCanvas theme={theme} size={72} boardSize={9} />
									</span>
									<span>{t(`board.themes.${theme}`)}</span>
								</label>
							))}
						</fieldset>
						<fieldset className="material-choices">
							<legend>{t("board.appearance.stonesLegend")}</legend>
							{styles.map((style) => (
								<label key={style} className="material-choice" title={t(`board.stoneStyles.${style}`)}>
									<input
										type="radio"
										name="stoneStyle"
										value={style}
										checked={draft.stoneStyle === style}
										onChange={() => update({ stoneStyle: style })}
									/>
									<span className="material-choice__stones" aria-hidden="true">
										<StoneCanvas style={style} color="black" size={30} />
										<StoneCanvas style={style} color="white" size={30} />
									</span>
									<span>{t(`board.stoneStyles.${style}`)}</span>
								</label>
							))}
						</fieldset>
					</div>
					<div className="board-settings__preview" aria-label={t("board.appearance.previewLabel")} role="img">
						<Board
							boardSize={9}
							geometry={previewGeometry}
							size={240}
							boardTheme={draft.boardTheme}
							stoneStyle={draft.stoneStyle}
							stones={previewStones}
							lastMove={draft.showLastMove ? previewLastMove : null}
							readOnly
						/>
						{draft.coordinates && <BoardCoordinates geometry={previewGeometry} boardTheme={draft.boardTheme} />}
					</div>
				</div>
			</SettingsSection>
			<SettingsSection title={t("board.display.title")}>
				<SettingToggle
					label={t("board.display.coordinates.label")}
					description={t("board.display.coordinates.description")}
					checked={draft.coordinates}
					onChange={(coordinates) => update({ coordinates })}
				/>
				<SettingToggle
					label={t("board.display.lastMove.label")}
					description={t("board.display.lastMove.description")}
					checked={draft.showLastMove}
					onChange={(showLastMove) => update({ showLastMove })}
				/>
			</SettingsSection>
			<SettingsSection title={t("board.sounds.title")}>
				<SettingToggle
					label={t("board.sounds.playSounds.label")}
					description={t("board.sounds.playSounds.description")}
					checked={draft.sound}
					onChange={(sound) => update({ sound })}
				/>
			</SettingsSection>
			<SaveActions dirty={dirty} status={status.message} onCancel={() => setDraft(preferences)} />
		</form>
	);
}
