import { useState } from "react";
import { mockSessions } from "@/data/mocks/settings";
import type { ActiveSession } from "@/types/settings";

export function SessionList() {
	const [sessions, setSessions] = useState<ActiveSession[]>(mockSessions);
	const revoke = (id: string) => setSessions((list) => list.filter((session) => session.id !== id));
	const hasOtherSessions = sessions.some((session) => !session.current);
	return (
		<>
			<ul className="session-list">
				{sessions.map((session) => (
					<li key={session.id}>
						<span>
							<span className="session-list__device">{session.device}</span>
							<span className="session-list__meta">
								{session.location} · {session.current ? "This device" : session.lastSeen}
							</span>
						</span>
						{!session.current && (
							<button
								type="button"
								className="settings-button"
								aria-label={`Log out ${session.device}`}
								onClick={() => revoke(session.id)}
							>
								Log out
							</button>
						)}
					</li>
				))}
			</ul>
			<button
				type="button"
				className="settings-button settings-button--danger"
				disabled={!hasOtherSessions}
				onClick={() => setSessions((list) => list.filter((session) => session.current))}
			>
				Log out on all other devices
			</button>
		</>
	);
}
