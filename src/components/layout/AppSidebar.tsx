import { Link, NavLink } from 'react-router'
import { StoneMark } from '../StoneMark'
import grid from "../../assets/go-home/grid.svg";
import navPuzzle from "../../assets/go-home/nav-puzzle.svg";
import navBook from "../../assets/go-home/nav-book.svg";
import guideArrow from "../../assets/go-home/guide-arrow.svg";
import divider from "../../assets/go-home/divider.svg";
import settings from "../../assets/go-home/settings.svg";

type AppSidebarProps = {
  compact: boolean
  onNavigate: () => void
  onNotice: (label: string) => void
}

export function AppSidebar({ compact, onNavigate, onNotice }: AppSidebarProps) {
  return (
		<aside className="go-sidebar" aria-label="Baduk navigation">
			<div className="go-sidebar__primary">
				{compact && (
					<button
						className="go-sidebar-close"
						onClick={() => onNavigate()}
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
					<NavLink
						to="/play"
						onClick={() => onNavigate()}
					>
						<img src={grid} alt="" />
						<span>Play</span>
					</NavLink>
					<button onClick={() => onNotice("Puzzles")}>
						<img src={navPuzzle} alt="" />
						<span>Puzzles</span>
					</button>
					<button onClick={() => onNotice("Learn")}>
						<img src={navBook} alt="" />
						<span>Learn</span>
					</button>
				</nav>
			</div>
			<div className="go-utilities">
				<div className="go-guide">
					<p>NEW TO GO?</p>
					<button onClick={() => onNotice("Start with the basics")}>
						Start with the basics
						<img src={guideArrow} alt="" />
					</button>
				</div>
				<img className="go-utility-divider" src={divider} alt="" />
				<button className="go-settings" onClick={() => onNotice("Settings")}>
					<img src={settings} alt="" />
					Settings
				</button>
			</div>
		</aside>
  )
}
