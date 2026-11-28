import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useMatch } from "react-router";
import { useTheme } from "@/hooks/useTheme";
import type { ThemePreference } from "@/types/settings";
import settingsIcon from "@/assets/icons/account/settings.svg";
import themeIcon from "@/assets/icons/account/theme.svg";

const themeOptions: ThemePreference[] = ["system", "light", "dark"];

/** Sidebar settings button that opens a small panel with a link to all settings and the theme choice. */
export function SidebarSettingsMenu({ onNavigate }: { onNavigate: () => void }) {
	const { t } = useTranslation("nav");
	const { theme, setTheme } = useTheme();
	const onSettingsPage = useMatch("/settings/*") !== null;
	const [open, setOpen] = useState(false);
	const container = useRef<HTMLDivElement>(null);
	const toggle = useRef<HTMLButtonElement>(null);

	useEffect(() => {
		if (!open) return;
		const closeOnOutsidePointer = (event: PointerEvent) => {
			if (!container.current?.contains(event.target as Node)) setOpen(false);
		};
		const closeOnEscape = (event: KeyboardEvent) => {
			if (event.key !== "Escape") return;
			// Keeps an enclosing navigation drawer open while only the panel closes.
			event.preventDefault();
			setOpen(false);
			toggle.current?.focus();
		};
		document.addEventListener("pointerdown", closeOnOutsidePointer);
		document.addEventListener("keydown", closeOnEscape, true);
		return () => {
			document.removeEventListener("pointerdown", closeOnOutsidePointer);
			document.removeEventListener("keydown", closeOnEscape, true);
		};
	}, [open]);

	return (
		<div ref={container} className="go-settings-menu">
			<button
				ref={toggle}
				type="button"
				aria-label={t("account.settings")}
				title={t("account.settings")}
				aria-expanded={open}
				aria-controls="go-settings-panel"
				data-current={onSettingsPage || undefined}
				onClick={() => setOpen((value) => !value)}
			>
				<img src={settingsIcon} alt="" />
			</button>
			{open && (
				<div id="go-settings-panel" className="go-settings-panel">
					<Link
						className="go-settings-panel__item"
						to="/settings"
						onClick={() => {
							setOpen(false);
							onNavigate();
						}}
					>
						<img src={settingsIcon} alt="" />
						{t("account.allSettings")}
					</Link>
					<fieldset className="go-settings-panel__group">
						<legend className="go-settings-panel__heading">
							<img src={themeIcon} alt="" />
							{t("theme.label")}
						</legend>
						{themeOptions.map((option) => (
							<button
								key={option}
								type="button"
								className="go-settings-panel__option"
								aria-pressed={theme === option}
								onClick={() => setTheme(option)}
							>
								{t(`theme.${option}`)}
							</button>
						))}
					</fieldset>
				</div>
			)}
		</div>
	);
}
