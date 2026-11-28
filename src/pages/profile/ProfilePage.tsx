import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import { useDateFormat } from "@/hooks/useDateFormat";
import { StoneMark } from "@/components/ui/StoneMark";
import { mockFollowing, mockJoinedAt, mockProfile } from "@/data/mocks/settings";
import { countryFlag, countryName } from "@/lib/countries";
import "@/styles/profile.css";

export default function ProfilePage() {
	const { t, i18n } = useTranslation(["profile", "common"]);
	const { formatDate } = useDateFormat();
	const { username = "" } = useParams();
	const { account } = useAuth();
	const isOwnProfile = account?.username === username;
	const profile = mockProfile;

	useEffect(() => {
		document.title = t("common:pageTitle", { title: username });
	}, [t, username]);

	return (
		<main className="profile" id="main-content">
			<header className="profile__header">
				<span className="profile__avatar">
					<StoneMark style="polished" size={80} />
				</span>
				<div className="profile__identity">
					<h1>
						{username}
						{profile.country && (
							<span
								className="profile__flag"
								role="img"
								aria-label={countryName(profile.country, i18n.resolvedLanguage ?? "en")}
							>
								{countryFlag(profile.country)}
							</span>
						)}
					</h1>
					{profile.realName && <p>{profile.realName}</p>}
					{profile.location && <p className="profile__muted">{profile.location}</p>}
				</div>
				{isOwnProfile && (
					<Link className="profile__edit" to="/settings/profile">
						{t("profile:editProfile")}
					</Link>
				)}
			</header>
			<dl className="profile__meta">
				<div>
					<dt>{t("profile:meta.joined")}</dt>
					<dd>{formatDate(mockJoinedAt)}</dd>
				</div>
				<div>
					<dt>{t("profile:meta.rank")}</dt>
					<dd>{profile.rank || t("profile:meta.noRank")}</dd>
				</div>
				<div>
					<dt>{t("profile:meta.followers")}</dt>
					<dd>0</dd>
				</div>
				<div>
					<dt>{t("profile:meta.following")}</dt>
					<dd>{mockFollowing.length}</dd>
				</div>
			</dl>
			<div className="profile__body">
				<section className="profile__card" aria-labelledby="profile-about">
					<h2 id="profile-about">{t("profile:about.heading")}</h2>
					<p className={profile.bio ? undefined : "profile__muted"}>{profile.bio || t("profile:about.noBio")}</p>
					{profile.links.length > 0 && (
						<ul className="profile__links">
							{profile.links.map((link) => (
								<li key={link}>
									<a href={link} target="_blank" rel="noreferrer noopener">
										{link}
									</a>
								</li>
							))}
						</ul>
					)}
				</section>
				<section className="profile__card" aria-labelledby="profile-games">
					<h2 id="profile-games">{t("profile:games.heading")}</h2>
					<p className="profile__muted">{t("profile:games.empty")}</p>
				</section>
			</div>
		</main>
	);
}
