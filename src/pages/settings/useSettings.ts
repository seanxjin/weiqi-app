import { useOutletContext } from "react-router";
import type { Dispatch, SetStateAction } from "react";
import type { Account } from "../../auth/api";
import type { Preferences, Profile } from "./settingsMock";

export type SettingsContext = {
	account: Account;
	preferences: Preferences;
	setPreferences: Dispatch<SetStateAction<Preferences>>;
	profile: Profile;
	setProfile: Dispatch<SetStateAction<Profile>>;
	comingSoon: (label: string) => void;
};

export function useSettings() {
	return useOutletContext<SettingsContext>();
}
