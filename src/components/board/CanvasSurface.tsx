import { useLayoutEffect, useRef } from 'react'
import type { CSSProperties } from 'react'
import { observeCanvas } from 'weiqi_board'
import type { CanvasDraw } from 'weiqi_board'
import './appearance.css'

interface CanvasSurfaceProps {
  label: string
  className?: string
  size?: number
  draw: CanvasDraw
}

export function CanvasSurface({ label, className, size, draw }: CanvasSurfaceProps) {
  const ref = useRef<HTMLCanvasElement>(null)
  useLayoutEffect(() => {
    const surface = observeCanvas(ref.current!, draw)
    return () => surface.destroy()
  }, [draw])
  return (
    <canvas ref={ref} className={'weiqi-canvas ' + (className ?? '')} role="img" aria-label={label}
      style={{ '--canvas-size': size === undefined ? '100%' : size + 'px' } as CSSProperties}>
      {label}
    </canvas>
  )
}
