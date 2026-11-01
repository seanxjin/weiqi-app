import { useCallback, useEffect, useState } from 'react'
import { createBoardGeometry, drawBoard, boardThemes, loadTexture } from 'weiqi_board'
import type { BoardGeometry, BoardSize, BoardThemeId } from 'weiqi_board'
import { CanvasSurface } from './CanvasSurface'

export interface BoardCanvasProps {
  theme: BoardThemeId
  size?: number
  label?: string
  geometry?: BoardGeometry
  boardSize?: BoardSize
}

export function BoardCanvas({ theme, size, label, geometry, boardSize = 19 }: BoardCanvasProps) {
  const source = boardThemes[theme].texture
  const [loaded, setLoaded] = useState<{ source: string; image?: HTMLImageElement; error?: boolean }>()
  useEffect(() => {
    let active = true
    loadTexture(source).then(
      image => { if (active) setLoaded({ source, image }) },
      () => { if (active) setLoaded({ source, error: true }) },
    )
    return () => { active = false }
  }, [source])
  const texture = loaded?.source === source ? loaded.image : undefined
  const draw = useCallback((ctx: CanvasRenderingContext2D, width: number) => {
    drawBoard(ctx, { theme, size: width, texture, geometry: geometry ?? createBoardGeometry(boardSize) })
  }, [theme, texture, geometry, boardSize])
  return (
    <div className="board-canvas-wrap">
      <CanvasSurface className="board-canvas weiqi-board-canvas" size={size}
        label={label ?? `Empty ${geometry?.intersections ?? boardSize} by ${geometry?.intersections ?? boardSize} ${boardThemes[theme].name} baduk board`} draw={draw} />
      {loaded?.source === source && loaded.error && (
        <p className="asset-error weiqi-asset-error" role="status">Board texture could not be loaded.</p>
      )}
    </div>
  )
}
