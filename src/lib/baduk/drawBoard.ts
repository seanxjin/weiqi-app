import { boardGeometry, boardThemes } from './themes'
import type { BoardGeometry, BoardThemeId } from './themes'

export interface DrawBoardOptions {
  theme: BoardThemeId
  size: number
  texture?: CanvasImageSource
  geometry?: BoardGeometry
  x?: number
  y?: number
}

/** Draws an empty board without clearing the destination, for use in any scene. */
export function drawBoard(ctx: CanvasRenderingContext2D, {
  theme, size, texture, geometry = boardGeometry, x = 0, y = 0,
}: DrawBoardOptions) {
  if (size <= 0) return
  const appearance = boardThemes[theme]
  const unit = geometry.size / boardGeometry.size
  ctx.save()
  ctx.translate(x, y)
  ctx.scale(size / geometry.size, size / geometry.size)
  ctx.fillStyle = appearance.frame
  ctx.beginPath()
  ctx.roundRect(0, 0, geometry.size, geometry.size, 7 * unit)
  ctx.fill()

  if (texture) {
    ctx.save()
    ctx.beginPath()
    ctx.roundRect(4 * unit, 3 * unit, 792 * unit, 792 * unit, 4 * unit)
    ctx.clip()
    // All supplied timber assets are square, matching Figma's object-cover crop.
    ctx.drawImage(texture, 4 * unit, 3 * unit, 792 * unit, 792 * unit)
    ctx.restore()
  }

  ctx.fillStyle = appearance.grid
  const { inset, spacing, intersections, lineWidth, edgeWidth } = geometry
  const length = spacing * (intersections - 1)
  for (let i = 0; i < intersections; i++) {
    const width = i === 0 || i === intersections - 1 ? edgeWidth : lineWidth
    const position = inset + i * spacing
    ctx.fillRect(position - width / 2, inset - edgeWidth / 2, width, length + edgeWidth)
    ctx.fillRect(inset - edgeWidth / 2, position - width / 2, length + edgeWidth, width)
  }
  for (const row of geometry.starIndices) {
    for (const column of geometry.starIndices) {
      ctx.beginPath()
      ctx.arc(inset + column * spacing, inset + row * spacing, geometry.starRadius, 0, Math.PI * 2)
      ctx.fill()
    }
  }
  ctx.restore()
}
