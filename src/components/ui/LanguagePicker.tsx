import { useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import { findLanguage, languages, type LanguageCode } from "@/i18n/languages";
import { useLocalePreferences } from "@/hooks/useLocalePreferences";
import languageIcon from "@/assets/icons/account/language.svg";

type LanguagePickerProps = {
	className?: string;
	label?: string;
};

/** A button showing the current language that opens a dialog listing every supported language. */
export function LanguagePicker({ className = "language-button", label }: LanguagePickerProps) {
	const { t } = useTranslation("common");
	const { localePreferences, changeLanguage } = useLocalePreferences();
	const { language } = localePreferences;
	const dialog = useRef<HTMLDialogElement>(null);
	const [loadFailed, setLoadFailed] = useState(false);
	const languageNames = useMemo(() => new Intl.DisplayNames([language], { type: "language" }), [language]);
	const currentLanguage = findLanguage(language);
	const openDialog = () => {
		setLoadFailed(false);
		dialog.current?.showModal();
	};

	const selectLanguage = async (code: LanguageCode) => {
		setLoadFailed(false);
		try {
			await changeLanguage(code);
			dialog.current?.close();
		} catch {
			setLoadFailed(true);
		}
	};

	return (
		<>
			<button type="button" className={className} aria-haspopup="dialog" onClick={openDialog}>
				<img src={languageIcon} alt="" />
				<span>{label ?? currentLanguage.nativeName}</span>
			</button>
			{createPortal(
				// biome-ignore lint/a11y/useKeyWithClickEvents: backdrop click is a mouse shortcut; <dialog> closes on Escape natively.
				<dialog
					ref={dialog}
					className="language-dialog"
					aria-labelledby="language-dialog-title"
					onClick={(event) => {
						if (event.target === event.currentTarget) dialog.current?.close();
					}}
				>
					<header className="language-dialog__header">
						<h2 id="language-dialog-title">{t("languageDialog.title")}</h2>
						<button
							type="button"
							className="language-dialog__close"
							aria-label={t("actions.close")}
							onClick={() => dialog.current?.close()}
						>
							×
						</button>
					</header>
					{loadFailed && (
						<p className="language-dialog__error" role="alert">
							{t("languageDialog.loadError")}
						</p>
					)}
					<ul className="language-dialog__list">
						{languages.map((option) => (
							<li key={option.code}>
								<button
									type="button"
									className="language-dialog__option"
									aria-current={option.code === language ? "true" : undefined}
									onClick={() => void selectLanguage(option.code)}
								>
									<span className="language-dialog__native" lang={option.code} dir={option.dir}>
										{option.nativeName}
									</span>
									<span className="language-dialog__translated">
										{languageNames.of(option.code) ?? option.englishName}
									</span>
								</button>
							</li>
						))}
					</ul>
				</dialog>,
				document.body,
			)}
		</>
	);
}
