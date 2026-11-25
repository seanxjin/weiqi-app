import { useState } from "react";
import { useNavigate } from "react-router";
import type { BoardSize } from "weiqi-board";
import { ApiError } from "../../auth/api";
import { createGame } from "../../game/online/gameServer";
import type { Color } from "../../game/online/protocol";
import { saveSeat } from "../../game/online/seatStore";

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
			setError(error instanceof ApiError ? error.message : "The game could not be created. Please try again.");
			setCreating(false);
		}
	};
	return { create, creating, error };
}
