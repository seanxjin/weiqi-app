import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { StoneMark } from "../../components/StoneMark";
import grid from "../../assets/go-home/grid.svg";
import navPuzzle from "../../assets/go-home/nav-puzzle.svg";
import navBook from "../../assets/go-home/nav-book.svg";
import guideArrow from "../../assets/go-home/guide-arrow.svg";
import divider from "../../assets/go-home/divider.svg";
import settings from "../../assets/go-home/settings.svg";
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
import "./PlayPages.css";

const options = [
	{
		label: "Play online",
		description: "Find your match. Meet on the board.",
		icon: globe,
		arrow: localArrow,
		primary: true,
	},
	{
		label: "Play local",
		description: "One board. Two players. Share a screen.",
		icon: local,
		arrow: localArrow,
		to: "/play/local",
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
	const [compact, setCompact] = useState(
		() => window.matchMedia("(max-width: 999px)").matches,
	);
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const drawer = useRef<HTMLDialogElement>(null);
	const [notice, setNotice] = useState({ label: "", sequence: 0 });
	useEffect(() => {
		document.title = "Baduk — Play";
	}, []);
	useEffect(() => {
		const media = window.matchMedia("(max-width: 999px)");
		const onResize = () => {
			setCompact(media.matches);
			setSidebarOpen(false);
		};
		media.addEventListener("change", onResize);
		return () => media.removeEventListener("change", onResize);
	}, []);
	useEffect(() => {
		if (compact && sidebarOpen) drawer.current?.showModal();
		else drawer.current?.close();
	}, [compact, sidebarOpen]);
	useEffect(() => {
		if (!notice.label) return;
		const timer = window.setTimeout(
			() => setNotice((value) => ({ ...value, label: "" })),
			4000,
		);
		return () => window.clearTimeout(timer);
	}, [notice]);
	const comingSoon = (label: string) => {
		setSidebarOpen(false);
		setNotice((value) => ({ label, sequence: value.sequence + 1 }));
	};

	const sidebar = (
		<aside className="go-sidebar" aria-label="Baduk navigation">
			<div className="go-sidebar__primary">
				{compact && (
					<button
						className="go-sidebar-close"
						onClick={() => setSidebarOpen(false)}
						aria-label="Close navigation"
					>
						×
					</button>
				)}
				<Link to="/" className="go-brand" aria-label="Baduk home">
					<StoneMark style="polished" size={34} />
					<span>BADUK</span>
				</Link>
				<nav className="go-sections" aria-label="Main navigation">
					<Link
						to="/play"
						aria-current="page"
						onClick={() => setSidebarOpen(false)}
					>
						<img src={grid} alt="" />
						<span>Play</span>
					</Link>
					<button onClick={() => comingSoon("Puzzles")}>
						<img src={navPuzzle} alt="" />
						<span>Puzzles</span>
					</button>
					<button onClick={() => comingSoon("Learn")}>
						<img src={navBook} alt="" />
						<span>Learn</span>
					</button>
				</nav>
			</div>
			<div className="go-utilities">
				<div className="go-guide">
					<p>NEW TO GO?</p>
					<button onClick={() => comingSoon("Start with the basics")}>
						Start with the basics
						<img src={guideArrow} alt="" />
					</button>
				</div>
				<img className="go-utility-divider" src={divider} alt="" />
				<button className="go-settings" onClick={() => comingSoon("Settings")}>
					<img src={settings} alt="" />
					Settings
				</button>
			</div>
		</aside>
	);

	return (
		<div className="go-home" data-node-id="46:381">
			{compact ? (
				<dialog
					ref={drawer}
					id="go-sidebar-drawer"
					className="go-sidebar-drawer"
					aria-label="Baduk navigation"
					onKeyDown={(event) => {
						if (event.key !== "Tab") return;
						const controls =
							event.currentTarget.querySelectorAll<HTMLElement>(
								"a[href], button",
							);
						const first = controls[0];
						const last = controls[controls.length - 1];
						if (event.shiftKey && document.activeElement === first) {
							event.preventDefault();
							last?.focus();
						} else if (!event.shiftKey && document.activeElement === last) {
							event.preventDefault();
							first?.focus();
						}
					}}
					onClose={() => setSidebarOpen(false)}
					onClick={(event) => {
						if (event.target === event.currentTarget) setSidebarOpen(false);
					}}
				>
					{sidebar}
				</dialog>
			) : (
				sidebar
			)}
			<main className="go-content" id="main-content">
				<header className="go-topbar">
					<div className="go-location">
						{compact && (
							<button
								className="go-sidebar-toggle"
								aria-label="Open navigation"
								aria-expanded={sidebarOpen}
								aria-controls="go-sidebar-drawer"
								onClick={() => setSidebarOpen(true)}
							>
								<span aria-hidden="true">☰</span>
							</button>
						)}
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
								<Link key={option.label} to={option.to} className="go-option">
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
			<div
				className="go-notice"
				role="status"
				aria-live="polite"
				aria-atomic="true"
			>
				{notice.label && (
					<span key={notice.sequence}>{notice.label} is coming soon.</span>
				)}
			</div>
		</div>
	);
}
