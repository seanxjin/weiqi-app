import { useEffect } from "react";
import { Link } from "react-router";
import signinArrow from "../../assets/go-home/signin-arrow.svg";
import globe from "../../assets/go-home/globe.svg";
import local from "../../assets/go-home/local.svg";
import localArrow from "../../assets/go-home/local-arrow.svg";
import users from "../../assets/go-home/users.svg";
import friendArrow from "../../assets/go-home/friend-arrow.svg";
import puzzle from "../../assets/go-home/puzzle.svg";
import book from "../../assets/go-home/book.svg";
import lessonArrow from "../../assets/go-home/lesson-arrow.svg";
import bot from "../../assets/go-home/bot.svg";
import presence from "../../assets/go-home/presence.svg";
import { useAppLayout } from "../../components/layout/useAppLayout";
import "./PlayPages.css";

const options = [
	{
		label: "Play online",
		description: "Find your match. Meet on the board.",
		icon: globe,
		arrow: localArrow,
		primary: true,
		to: "/play/online/setup",
	},
	{
		label: "Play local",
		description: "One board. Two players. Share a screen.",
		icon: local,
		arrow: localArrow,
		to: "/play/local/setup",
	},
	{
		label: "Play friend",
		description: "Invite someone for a thoughtful game.",
		icon: users,
		arrow: friendArrow,
	},
	{
		label: "Solve puzzles",
		description: "Small challenges. Sharper instincts.",
		icon: puzzle,
		arrow: friendArrow,
	},
	{
		label: "Lessons",
		description: "From your first stone to your next insight.",
		icon: book,
		arrow: lessonArrow,
	},
	{
		label: "Play bots",
		description: "Practice at your pace, at any level.",
		icon: bot,
		arrow: lessonArrow,
	},
];

export default function GoHomePage() {
	const { comingSoon } = useAppLayout();
	useEffect(() => {
		document.title = "Baduk — Play";
	}, []);

	return (
		<div className="go-home" data-node-id="46:381">
			<main className="go-content" id="main-content">
				<header className="go-topbar">
					<div className="go-location">
						<p>PLAY / HOME</p>
					</div>
					<div className="go-account">
						<span>Playing as a guest</span>
						<button onClick={() => comingSoon("Sign in")}>
							Sign in
							<img src={signinArrow} alt="" />
						</button>
					</div>
				</header>
				<section className="go-introduction" aria-labelledby="go-heading">
					<h1 id="go-heading">Some Text</h1>
					<p>Some other text</p>
				</section>
				<section className="go-workspace" aria-labelledby="go-menu-heading">
					<h2 id="go-menu-heading" className="go-label">
						Some text.
					</h2>
					<div className="go-menu">
						{options.map((option) => {
							const content = (
								<>
									<img src={option.icon} alt="" />
									<span className="go-option__details">
										<span className="go-option__label">{option.label}</span>
										<span className="go-option__description">
											{option.description}
										</span>
									</span>
									<span className="go-option__arrow">
										<img src={option.arrow} alt="" />
									</span>
								</>
							);
							return option.to ? (
								<Link
									key={option.label}
									to={option.to}
									className={`go-option${option.primary ? " go-option--primary" : ""}`}
								>
									{content}
								</Link>
							) : (
								<button
									key={option.label}
									onClick={() => comingSoon(option.label)}
									className={`go-option${option.primary ? " go-option--primary" : ""}`}
								>
									{content}
								</button>
							);
						})}
					</div>
					<p className="go-presence">
						<img src={presence} alt="" />
						1,248 players sharing the board
					</p>
				</section>
				<section className="go-reserved" aria-labelledby="go-reserved-heading">
					<h2 id="go-reserved-heading" className="go-label">
						SECTION FOR LATER
					</h2>
					<div>
						<h3>Reserved for future content</h3>
						<p>
							This section is intentionally left empty for now. It will be used
							for future features, updates, or curated content.
						</p>
					</div>
				</section>
				<footer className="go-footer">
					<p>Simple rules. Endless discovery.</p>
					<p>
						English&nbsp; · &nbsp;<span lang="ja">日本語</span>
					</p>
				</footer>
			</main>
		</div>
	);
}
