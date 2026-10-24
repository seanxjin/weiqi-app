import { useCallback } from 'react'
import { drawStone, stoneStyles } from '../lib/baduk'
import type { StoneColor, StoneStyleId } from '../lib/baduk'
import { CanvasSurface } from './CanvasSurface'

export interface StoneCanvasProps {
  style: StoneStyleId
  color: StoneColor
  /** Diameter of the stone itself; the canvas adds transparent shadow space. */
  size?: number
  label?: string
}

export function StoneCanvas({ style, color, size = 138, label }: StoneCanvasProps) {
  const draw = useCallback((ctx: CanvasRenderingContext2D, width: number) => {
    const scale = width / 176
    drawStone(ctx, { style, color, x: 88 * scale, y: 82 * scale, radius: 69 * scale })
  }, [style, color])
  return (
    <CanvasSurface className="stone-canvas" size={size * 176 / 138}
      label={label ?? `${stoneStyles[style].finish} ${stoneStyles[style].labels[color].toLowerCase()} baduk stone`}
      draw={draw} />
  )
}
