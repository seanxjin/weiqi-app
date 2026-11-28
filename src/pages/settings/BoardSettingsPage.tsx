import { useState, type FormEvent } from "react";
import { boardThemes, stoneStyles } from "weiqi-board";
import type { BoardThemeId, Stone, StoneStyleId } from "weiqi-board";
import { Board, BoardCanvas, StoneCanvas } from "@/components/board";
import { SaveActions, SettingsSection, SettingToggle } from "@/components/settings/SettingsControls";
import { useSaveStatus } from "@/hooks/useSaveStatus";
import { useSettings } from "@/hooks/useSettings";

const themes: BoardThemeId[] = ["kaya", "walnut", "ash"];
const styles: StoneStyleId[] = ["polished", "satin", "matte", "snow"];
const previewStones: Stone[] = [
	{ column: 2, row: 2, color: "black" },
	{ column: 6, row: 6, color: "white" },
	{ column: 6, row: 2, color: "black" },
	{ column: 2, row: 6, color: "white" },
	{ column: 4, row: 4, color: "black" },
	{ column: 5, row: 3, color: "white" },
];
const previewLastMove = { column: 5, row: 3 };

export default function BoardSettingsPage() {
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
		status.show("Saved");
	};

	return (
		<form className="settings-page" onSubmit={save}>
			<header className="settings-page__header">
				<h2>Board & Stones</h2>
				<p>Choose the board and stones you play on.</p>
			</header>
			<SettingsSection title="Appearance">
				<div className="board-settings">
					<div className="board-settings__choices">
						<fieldset className="material-choices">
							<legend>Board</legend>
							{themes.map((theme) => (
								<label key={theme} className="material-choice" title={boardThemes[theme].name}>
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
									<span>{boardThemes[theme].name}</span>
								</label>
							))}
						</fieldset>
						<fieldset className="material-choices">
							<legend>Stones</legend>
							{styles.map((style) => (
								<label key={style} className="material-choice" title={stoneStyles[style].name}>
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
									<span>{stoneStyles[style].name}</span>
								</label>
							))}
						</fieldset>
					</div>
					<div className="board-settings__preview" aria-label="Board preview" role="img">
						<Board
							boardSize={9}
							size={240}
							boardTheme={draft.boardTheme}
							stoneStyle={draft.stoneStyle}
							stones={previewStones}
							lastMove={draft.showLastMove ? previewLastMove : null}
							readOnly
						/>
					</div>
				</div>
			</SettingsSection>
			<SettingsSection title="Board display">
				<SettingToggle
					label="Show board coordinates"
					description="Label the columns and rows around the edge of the board."
					checked={draft.coordinates}
					onChange={(coordinates) => update({ coordinates })}
				/>
				<SettingToggle
					label="Highlight last move"
					description="Mark the most recently played stone."
					checked={draft.showLastMove}
					onChange={(showLastMove) => update({ showLastMove })}
				/>
			</SettingsSection>
			<SettingsSection title="Sounds">
				<SettingToggle
					label="Play sounds"
					description="Stone placement, captures, and clock warnings."
					checked={draft.sound}
					onChange={(sound) => update({ sound })}
				/>
			</SettingsSection>
			<SaveActions dirty={dirty} status={status.message} onCancel={() => setDraft(preferences)} />
		</form>
	);
}
