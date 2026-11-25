import { useState, type FormEvent } from "react";
import type { Preferences } from "@/types/settings";
import { SaveActions, SettingRadioGroup, SettingsSection } from "@/components/settings/SettingsControls";
import { useSaveStatus } from "@/hooks/useSaveStatus";
import { useSettings } from "@/hooks/useSettings";

const moveConfirmationOptions: { value: Preferences["moveConfirmation"]; label: string }[] = [
	{ value: "never", label: "Never" },
	{ value: "correspondence", label: "Correspondence games only" },
	{ value: "always", label: "Always" },
];

const challengeOptions: { value: Preferences["challenge"]; label: string }[] = [
	{ value: "everyone", label: "Everyone" },
	{ value: "registered", label: "Registered players" },
	{ value: "following", label: "Only players I follow" },
	{ value: "nobody", label: "Nobody (rematches are still allowed)" },
];

export default function GameplaySettingsPage() {
	const { preferences, setPreferences } = useSettings();
	const [draft, setDraft] = useState(preferences);
	const status = useSaveStatus();
	const dirty = draft.moveConfirmation !== preferences.moveConfirmation || draft.challenge !== preferences.challenge;
	const update = (change: Partial<Preferences>) => {
		status.clear();
		setDraft((value) => ({ ...value, ...change }));
	};

	const save = (event: FormEvent) => {
		event.preventDefault();
		setPreferences((value) => ({
			...value,
			moveConfirmation: draft.moveConfirmation,
			challenge: draft.challenge,
		}));
		status.show("Saved");
	};

	return (
		<form className="settings-page" onSubmit={save}>
			<header className="settings-page__header">
				<h2>Gameplay</h2>
				<p>Manage how you place stones and who can challenge you.</p>
			</header>
			<SettingsSection
				title="Playing moves"
				description="Ask for a second click before a stone is placed, to avoid mis-clicks."
			>
				<SettingRadioGroup
					legend="Confirm moves"
					name="moveConfirmation"
					value={draft.moveConfirmation}
					options={moveConfirmationOptions}
					onChange={(moveConfirmation) => update({ moveConfirmation })}
				/>
			</SettingsSection>
			<SettingsSection title="Challenges" description="Choose who can send you game challenges.">
				<SettingRadioGroup
					legend="Allow challenges from"
					name="challenge"
					value={draft.challenge}
					options={challengeOptions}
					onChange={(challenge) => update({ challenge })}
				/>
			</SettingsSection>
			<SaveActions dirty={dirty} status={status.message} onCancel={() => setDraft(preferences)} />
		</form>
	);
}
