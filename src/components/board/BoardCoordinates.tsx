import { boardThemes } from "weiqi-board";
import type { BoardGeometry, BoardThemeId } from "weiqi-board";
import { columnLabels } from "@/engine/moveHelpers";

type BoardCoordinatesProps = {
	geometry: BoardGeometry;
	boardTheme?: BoardThemeId;
};

/** Column letters along the bottom and row numbers along the left margin; place inside a positioned box the same size as the board. */
export function BoardCoordinates({ geometry, boardTheme = "kaya" }: BoardCoordinatesProps) {
	const { size, inset, spacing, intersections } = geometry;
	// Centres the labels in the outer part of the margin, as on the 744-unit game board (22 of a 48-unit inset).
	const near = inset * (22 / 48);
	const far = size - near;
	return (
		<svg className="board-coordinates" viewBox={`0 0 ${size} ${size}`} aria-hidden="true" focusable="false">
			<g fill={boardThemes[boardTheme].grid}>
				{Array.from({ length: intersections }, (_, index) => {
					const position = inset + index * spacing;
					const column = columnLabels[index];
					const row = intersections - index;
					return (
						<g key={column}>
							<text x={position} y={far}>
								{column}
							</text>
							<text x={near} y={position}>
								{row}
							</text>
						</g>
					);
				})}
			</g>
		</svg>
	);
}
