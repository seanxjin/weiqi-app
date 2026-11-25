import { useEffect } from "react";
import { Link, useParams } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import { StoneMark } from "@/components/ui/StoneMark";
import { mockFollowing, mockJoinedAt, mockProfile } from "@/data/mocks/settings";
import { countryFlag, countryName } from "@/lib/countries";
import "@/styles/profile.css";

const joinDate = mockJoinedAt.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });

export default function ProfilePage() {
	const { username = "" } = useParams();
	const { account } = useAuth();
	const isOwnProfile = account?.username === username;
	const profile = mockProfile;

	useEffect(() => {
		document.title = `Baduk — ${username}`;
	}, [username]);

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
							<span className="profile__flag" role="img" aria-label={countryName(profile.country)}>
								{countryFlag(profile.country)}
							</span>
						)}
					</h1>
					{profile.realName && <p>{profile.realName}</p>}
					{profile.location && <p className="profile__muted">{profile.location}</p>}
				</div>
				{isOwnProfile && (
					<Link className="profile__edit" to="/settings/profile">
						Edit profile
					</Link>
				)}
			</header>
			<dl className="profile__meta">
				<div>
					<dt>Joined</dt>
					<dd>{joinDate}</dd>
				</div>
				<div>
					<dt>Rank</dt>
					<dd>{profile.rank || "—"}</dd>
				</div>
				<div>
					<dt>Followers</dt>
					<dd>0</dd>
				</div>
				<div>
					<dt>Following</dt>
					<dd>{mockFollowing.length}</dd>
				</div>
			</dl>
			<div className="profile__body">
				<section className="profile__card" aria-labelledby="profile-about">
					<h2 id="profile-about">About</h2>
					<p className={profile.bio ? undefined : "profile__muted"}>{profile.bio || "No bio yet."}</p>
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
					<h2 id="profile-games">Game history</h2>
					<p className="profile__muted">No games yet.</p>
				</section>
			</div>
		</main>
	);
}
