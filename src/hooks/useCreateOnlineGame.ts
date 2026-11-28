import { useState } from "react";
import { useNavigate } from "react-router";
import type { BoardSize } from "weiqi-board";
import { ApiError } from "@/api/client";
import { createGame } from "@/api/games";
import type { Color } from "@/api/protocol";
import i18n from "@/i18n";
import { saveSeat } from "@/lib/seatStore";

export function useCreateOnlineGame() {
	const navigate = useNavigate();
	const [creating, setCreating] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const create = async (boardSize: BoardSize, color: Color | "Random") => {
		setCreating(true);
		setError(null);
		try {
			const grant = await createGame({ boardSize, color });
			saveSeat({ gameId: grant.gameId, color: grant.color, seatToken: grant.seatToken });
			navigate(`/play/online/${encodeURIComponent(grant.gameId)}`);
		} catch (error) {
			setError(error instanceof ApiError ? error.message : i18n.t("setup:page.createFailed"));
			setCreating(false);
		}
	};
	return { create, creating, error };
}
