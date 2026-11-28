import { useState, type FormEvent } from "react";
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
import { countries, countryFlag } from "@/lib/countries";
import type { Profile } from "@/types/settings";
import { SaveActions, SettingsSection } from "@/components/settings/SettingsControls";
import { useSaveStatus } from "@/hooks/useSaveStatus";
import { useSettings } from "@/hooks/useSettings";

const joinDate = mockJoinedAt.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });

export default function ProfileSettingsPage() {
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
		status.show("Saved");
	};

	return (
		<form className="settings-page" onSubmit={save}>
			<header className="settings-page__header">
				<h2>Profile</h2>
				<p>
					Everything here is visible on your <Link to={`/member/${account.username}`}>public profile</Link>.
				</p>
			</header>
			<SettingsSection title="Public profile">
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
							<span>Short bio</span>
							<textarea
								name="bio"
								rows={3}
								maxLength={BIO_MAX_LENGTH}
								placeholder="Your short bio will appear on your profile."
								value={draft.bio}
								onChange={(event) => update({ bio: event.currentTarget.value })}
							/>
							<span className="settings-field__hint">
								{draft.bio.length}/{BIO_MAX_LENGTH}
							</span>
						</label>
					</div>
				</div>
			</SettingsSection>
			<SettingsSection title="Details">
				<div className="settings-fields">
					<div className="settings-field">
						<span>Join date</span>
						<span className="settings-field__value">{joinDate}</span>
					</div>
					<div className="settings-field">
						<span>Username</span>
						<span className="settings-field__value">
							{account.username}
							<button type="button" className="settings-button" onClick={() => comingSoon("Changing your username")}>
								Change
							</button>
						</span>
					</div>
					<label className="settings-field">
						<span>Real name</span>
						<input
							name="realName"
							maxLength={REAL_NAME_MAX_LENGTH}
							value={draft.realName}
							onChange={(event) => update({ realName: event.currentTarget.value })}
						/>
					</label>
					<label className="settings-field">
						<span>Location</span>
						<input
							name="location"
							maxLength={LOCATION_MAX_LENGTH}
							value={draft.location}
							onChange={(event) => update({ location: event.currentTarget.value })}
						/>
					</label>
					<label className="settings-field">
						<span>Country</span>
						<select
							name="country"
							value={draft.country}
							onChange={(event) => update({ country: event.currentTarget.value })}
						>
							{countries.map((country) => (
								<option key={country.code} value={country.code}>
									{country.name}
								</option>
							))}
						</select>
					</label>
					<label className="settings-field">
						<span>Rank</span>
						<input
							name="rank"
							placeholder="e.g. 12k, 3d"
							pattern={RANK_INPUT_PATTERN}
							title="Use 30k–1k, 1d–9d, or 1p–9p."
							value={draft.rank}
							onChange={(event) => update({ rank: event.currentTarget.value.trim() })}
						/>
					</label>
					<fieldset className="settings-field settings-links">
						<legend>Links</legend>
						<div className="settings-links__list">
							{draft.links.map((link, index) => (
								// biome-ignore lint/suspicious/noArrayIndexKey: links are controlled inputs that may share the same text.
								<div className="settings-links__row" key={index}>
									<input
										type="url"
										aria-label={`Link ${index + 1}`}
										placeholder="https://"
										pattern="https?://.+"
										maxLength={LINK_MAX_LENGTH}
										value={link}
										onChange={(event) => updateLink(index, event.currentTarget.value)}
									/>
									<button
										type="button"
										className="settings-button"
										aria-label={`Remove link ${index + 1}`}
										onClick={() => update({ links: draft.links.filter((_, position) => position !== index) })}
									>
										Remove
									</button>
								</div>
							))}
							{draft.links.length < MAX_PROFILE_LINKS && (
								<button
									type="button"
									className="settings-button settings-links__add"
									onClick={() => update({ links: [...draft.links, ""] })}
								>
									Add link
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
