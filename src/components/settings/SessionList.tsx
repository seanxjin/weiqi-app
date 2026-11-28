import { useState } from "react";
import { useTranslation } from "react-i18next";
import { mockSessions } from "@/data/mocks/settings";
import { useDateFormat } from "@/hooks/useDateFormat";
import type { ActiveSession } from "@/types/settings";

export function SessionList() {
	const { t } = useTranslation(["settings", "common"]);
	const { formatRelative } = useDateFormat();
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
								{t("account.sessions.meta", {
									location: session.location,
									lastSeen: session.current ? t("account.sessions.thisDevice") : formatRelative(session.lastSeen),
								})}
							</span>
						</span>
						{!session.current && (
							<button
								type="button"
								className="settings-button"
								aria-label={t("account.sessions.logOutLabel", { device: session.device })}
								onClick={() => revoke(session.id)}
							>
								{t("common:actions.logOut")}
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
				{t("account.sessions.logOutAll")}
			</button>
		</>
	);
}
