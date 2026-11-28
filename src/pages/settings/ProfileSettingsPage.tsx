import { useState, type FormEvent } from "react";
import { Trans, useTranslation } from "react-i18next";
import { Link } from "react-router";
import { StoneMark } from "@/components/ui/StoneMark";
import {
	BIO_MAX_LENGTH,
	LINK_MAX_LENGTH,
	LOCATION_MAX_LENGTH,
	MAX_PROFILE_LINKS,
	RANK_INPUT_PATTERN,
	REAL_NAME_MAX_LENGTH,
} from "@/data/profileLimits";
import { mockJoinedAt } from "@/data/mocks/settings";
import { countryCodes, countryFlag, countryName } from "@/lib/countries";
import type { Profile } from "@/types/settings";
import { SaveActions, SettingsSection } from "@/components/settings/SettingsControls";
import { useDateFormat } from "@/hooks/useDateFormat";
import { useSaveStatus } from "@/hooks/useSaveStatus";
import { useSettings } from "@/hooks/useSettings";

export default function ProfileSettingsPage() {
	const { t, i18n } = useTranslation(["settings", "common"]);
	const { formatDate } = useDateFormat();
	const language = i18n.resolvedLanguage ?? "en";
	const countryOptions = countryCodes
		.map((code) => ({ code, name: countryName(code, language) }))
		.sort((first, second) => first.name.localeCompare(second.name, language));
	const { account, profile, setProfile, comingSoon } = useSettings();
	const [draft, setDraft] = useState(profile);
	const status = useSaveStatus();
	const dirty = JSON.stringify(draft) !== JSON.stringify(profile);
	const update = (change: Partial<Profile>) => {
		status.clear();
		setDraft((value) => ({ ...value, ...change }));
	};
	const updateLink = (index: number, link: string) =>
		update({ links: draft.links.map((value, position) => (position === index ? link : value)) });

	const save = (event: FormEvent) => {
		event.preventDefault();
		const cleaned = { ...draft, links: draft.links.map((link) => link.trim()).filter(Boolean) };
		setProfile(cleaned);
		setDraft(cleaned);
		status.show(t("common:status.saved"));
	};

	return (
		<form className="settings-page" onSubmit={save}>
			<header className="settings-page__header">
				<h2>{t("sections.profile")}</h2>
				<p>
					<Trans
						t={t}
						i18nKey="profile.description"
						components={{ profileLink: <Link to={`/member/${account.username}`} /> }}
					/>
				</p>
			</header>
			<SettingsSection title={t("profile.publicProfile.title")}>
				<div className="profile-card">
					<span className="profile-card__avatar">
						<StoneMark style="polished" size={72} />
					</span>
					<div className="profile-card__details">
						<p className="profile-card__name">
							{account.username}
							{draft.country && <span aria-hidden="true">{countryFlag(draft.country)}</span>}
						</p>
						{draft.realName && <p className="profile-card__real-name">{draft.realName}</p>}
						<label className="settings-field settings-field--stacked">
							<span>{t("profile.publicProfile.bioLabel")}</span>
							<textarea
								name="bio"
								rows={3}
								maxLength={BIO_MAX_LENGTH}
								placeholder={t("profile.publicProfile.bioPlaceholder")}
								value={draft.bio}
								onChange={(event) => update({ bio: event.currentTarget.value })}
							/>
							<span className="settings-field__hint">
								{t("profile.publicProfile.bioCounter", { length: draft.bio.length, max: BIO_MAX_LENGTH })}
							</span>
						</label>
					</div>
				</div>
			</SettingsSection>
			<SettingsSection title={t("profile.details.title")}>
				<div className="settings-fields">
					<div className="settings-field">
						<span>{t("profile.details.joinDate")}</span>
						<span className="settings-field__value">{formatDate(mockJoinedAt)}</span>
					</div>
					<div className="settings-field">
						<span>{t("profile.details.username")}</span>
						<span className="settings-field__value">
							{account.username}
							<button
								type="button"
								className="settings-button"
								onClick={() => comingSoon(t("profile.details.changeUsernameFeature"))}
							>
								{t("profile.details.changeUsername")}
							</button>
						</span>
					</div>
					<label className="settings-field">
						<span>{t("profile.details.realName")}</span>
						<input
							name="realName"
							maxLength={REAL_NAME_MAX_LENGTH}
							value={draft.realName}
							onChange={(event) => update({ realName: event.currentTarget.value })}
						/>
					</label>
					<label className="settings-field">
						<span>{t("profile.details.location")}</span>
						<input
							name="location"
							maxLength={LOCATION_MAX_LENGTH}
							value={draft.location}
							onChange={(event) => update({ location: event.currentTarget.value })}
						/>
					</label>
					<label className="settings-field">
						<span>{t("profile.details.country")}</span>
						<select
							name="country"
							value={draft.country}
							onChange={(event) => update({ country: event.currentTarget.value })}
						>
							<option value="">{t("profile.details.countryNotSet")}</option>
							{countryOptions.map((country) => (
								<option key={country.code} value={country.code}>
									{country.name}
								</option>
							))}
						</select>
					</label>
					<label className="settings-field">
						<span>{t("profile.details.rank")}</span>
						<input
							name="rank"
							placeholder={t("profile.details.rankPlaceholder")}
							pattern={RANK_INPUT_PATTERN}
							title={t("profile.details.rankHint")}
							value={draft.rank}
							onChange={(event) => update({ rank: event.currentTarget.value.trim() })}
						/>
					</label>
					<fieldset className="settings-field settings-links">
						<legend>{t("profile.links.legend")}</legend>
						<div className="settings-links__list">
							{draft.links.map((link, index) => (
								// biome-ignore lint/suspicious/noArrayIndexKey: links are controlled inputs that may share the same text.
								<div className="settings-links__row" key={index}>
									<input
										type="url"
										aria-label={t("profile.links.linkLabel", { number: index + 1 })}
										placeholder="https://"
										pattern="https?://.+"
										maxLength={LINK_MAX_LENGTH}
										value={link}
										onChange={(event) => updateLink(index, event.currentTarget.value)}
									/>
									<button
										type="button"
										className="settings-button"
										aria-label={t("profile.links.removeLabel", { number: index + 1 })}
										onClick={() => update({ links: draft.links.filter((_, position) => position !== index) })}
									>
										{t("profile.links.remove")}
									</button>
								</div>
							))}
							{draft.links.length < MAX_PROFILE_LINKS && (
								<button
									type="button"
									className="settings-button settings-links__add"
									onClick={() => update({ links: [...draft.links, ""] })}
								>
									{t("profile.links.add")}
								</button>
							)}
						</div>
					</fieldset>
				</div>
			</SettingsSection>
			<SaveActions dirty={dirty} status={status.message} onCancel={() => setDraft(profile)} />
		</form>
	);
}
