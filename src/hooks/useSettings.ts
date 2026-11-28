import { useOutletContext } from "react-router";
import type { SettingsContext } from "@/context/SettingsContext";

export function useSettings() {
	return useOutletContext<SettingsContext>();
}
