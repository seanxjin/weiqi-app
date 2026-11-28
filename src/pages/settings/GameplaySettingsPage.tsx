import { useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import type { Preferences } from "@/types/settings";
import { SaveActions, SettingRadioGroup, SettingsSection } from "@/components/settings/SettingsControls";
import { useSaveStatus } from "@/hooks/useSaveStatus";
import { useSettings } from "@/hooks/useSettings";

const moveConfirmationValues = [
	"never",
	"correspondence",
	"always",
] as const satisfies Preferences["moveConfirmation"][];
const challengeValues = ["everyone", "registered", "following", "nobody"] as const satisfies Preferences["challenge"][];

export default function GameplaySettingsPage() {
	const { t } = useTranslation(["settings", "common"]);
	const moveConfirmationOptions = moveConfirmationValues.map((value) => ({
		value,
		label: t(`gameplay.moves.options.${value}`),
	}));
	const challengeOptions = challengeValues.map((value) => ({
		value,
		label: t(`gameplay.challenges.options.${value}`),
	}));
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
		status.show(t("common:status.saved"));
	};

	return (
		<form className="settings-page" onSubmit={save}>
			<header className="settings-page__header">
				<h2>{t("sections.gameplay")}</h2>
				<p>{t("gameplay.description")}</p>
			</header>
			<SettingsSection title={t("gameplay.moves.title")} description={t("gameplay.moves.description")}>
				<SettingRadioGroup
					legend={t("gameplay.moves.legend")}
					name="moveConfirmation"
					value={draft.moveConfirmation}
					options={moveConfirmationOptions}
					onChange={(moveConfirmation) => update({ moveConfirmation })}
				/>
			</SettingsSection>
			<SettingsSection title={t("gameplay.challenges.title")} description={t("gameplay.challenges.description")}>
				<SettingRadioGroup
					legend={t("gameplay.challenges.legend")}
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
