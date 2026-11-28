import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { createBoardGeometry, drawBoard, boardThemes, loadTexture } from "weiqi-board";
import type { BoardGeometry, BoardSize, BoardThemeId } from "weiqi-board";
import { CanvasSurface } from "./CanvasSurface";

export interface BoardCanvasProps {
	theme: BoardThemeId;
	size?: number;
	label?: string;
	geometry?: BoardGeometry;
	boardSize?: BoardSize;
}

export function BoardCanvas({ theme, size, label, geometry, boardSize = 19 }: BoardCanvasProps) {
	const { t } = useTranslation("game");
	const source = boardThemes[theme].texture;
	const [loaded, setLoaded] = useState<{
		source: string;
		image?: HTMLImageElement;
		error?: boolean;
	}>();
	useEffect(() => {
		let active = true;
		loadTexture(source).then(
			(image) => {
				if (active) setLoaded({ source, image });
			},
			() => {
				if (active) setLoaded({ source, error: true });
			},
		);
		return () => {
			active = false;
		};
	}, [source]);
	const texture = loaded?.source === source ? loaded.image : undefined;
	const draw = useCallback(
		(ctx: CanvasRenderingContext2D, width: number) => {
			drawBoard(ctx, {
				theme,
				size: width,
				texture,
				geometry: geometry ?? createBoardGeometry(boardSize),
			});
		},
		[theme, texture, geometry, boardSize],
	);
	return (
		<div className="board-canvas-wrap">
			<CanvasSurface
				className="board-canvas weiqi-board-canvas"
				size={size}
				label={
					label ?? t("board.emptyBoard", { size: geometry?.intersections ?? boardSize, theme: boardThemes[theme].name })
				}
				draw={draw}
			/>
			{loaded?.source === source && loaded.error && (
				<p className="asset-error weiqi-asset-error" role="status">
					{t("board.textureError")}
				</p>
			)}
		</div>
	);
}
