import { useLayoutEffect, useRef } from 'react'
import type { CSSProperties } from 'react'

interface CanvasSurfaceProps {
  label: string
  className?: string
  size?: number
  draw: (ctx: CanvasRenderingContext2D, size: number) => void
}

/** CSS controls layout; the backing bitmap follows its size and screen density. */
export function CanvasSurface({ label, className, size, draw }: CanvasSurfaceProps) {
  const ref = useRef<HTMLCanvasElement>(null)

  useLayoutEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const render = () => {
      const width = canvas.getBoundingClientRect().width
      if (!width) return
      const pixels = Math.max(1, Math.round(width * window.devicePixelRatio))
      // Assignment resets state, preventing scaling from accumulating.
      canvas.width = pixels
      canvas.height = pixels
      ctx.setTransform(pixels / width, 0, 0, pixels / width, 0, 0)
      draw(ctx, width)
    }
    const observer = new ResizeObserver(render)
    observer.observe(canvas)
    window.addEventListener('resize', render)
    let densityQuery: MediaQueryList
    const watchDensity = () => {
      densityQuery?.removeEventListener('change', onDensityChange)
      densityQuery = window.matchMedia(`(resolution: ${window.devicePixelRatio}dppx)`)
      densityQuery.addEventListener('change', onDensityChange)
    }
    const onDensityChange = () => {
      render()
      watchDensity()
    }
    watchDensity()
    render()
    return () => {
      observer.disconnect()
      window.removeEventListener('resize', render)
      densityQuery.removeEventListener('change', onDensityChange)
    }
  }, [draw])

  return (
    <canvas ref={ref} className={className} role="img" aria-label={label}
      style={{ '--canvas-size': size === undefined ? '100%' : `${size}px` } as CSSProperties}>
      {label}
    </canvas>
  )
}
