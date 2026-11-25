import { useOutletContext } from "react-router";
import type { AppLayoutContext } from "@/context/AppLayoutContext";

export function useAppLayout() {
	return useOutletContext<AppLayoutContext>();
}
