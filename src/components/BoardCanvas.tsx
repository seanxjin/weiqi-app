import { useCallback, useEffect, useState } from 'react'
import { drawBoard, boardThemes } from '../lib/baduk'
import type { BoardGeometry, BoardThemeId } from '../lib/baduk'
import { loadTexture } from '../lib/baduk/textures'
import { CanvasSurface } from './CanvasSurface'

export interface BoardCanvasProps {
  theme: BoardThemeId
  size?: number
  label?: string
  geometry?: BoardGeometry
}

export function BoardCanvas({ theme, size, label, geometry }: BoardCanvasProps) {
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
    drawBoard(ctx, { theme, size: width, texture, geometry })
  }, [theme, texture, geometry])
  return (
    <div className="board-canvas-wrap">
      <CanvasSurface className="board-canvas" size={size}
        label={label ?? `Empty 19 by 19 ${boardThemes[theme].name} baduk board`} draw={draw} />
      {loaded?.source === source && loaded.error && (
        <p className="asset-error" role="status">Board texture could not be loaded.</p>
      )}
    </div>
  )
}
