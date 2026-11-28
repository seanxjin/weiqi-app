import { useMemo } from "react";
import { useLocalePreferences } from "@/hooks/useLocalePreferences";
import { createDateFormatter } from "@/lib/dateFormat";

export function useDateFormat() {
	const { localePreferences } = useLocalePreferences();
	const { language, timeZone, timeFormat } = localePreferences;
	return useMemo(() => createDateFormatter({ language, timeZone, timeFormat }), [language, timeZone, timeFormat]);
}
