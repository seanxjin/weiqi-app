import type { Dispatch, SetStateAction } from "react";
import type { Account } from "@/types/account";
import type { Preferences, Profile } from "@/types/settings";

export type SettingsContext = {
	account: Account;
	preferences: Preferences;
	setPreferences: Dispatch<SetStateAction<Preferences>>;
	profile: Profile;
	setProfile: Dispatch<SetStateAction<Profile>>;
	comingSoon: (label: string) => void;
};
