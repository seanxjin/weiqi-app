import { stoneStyles } from './themes'
import type { StoneColor, StoneStyleId } from './themes'

export interface DrawStoneOptions {
  style: StoneStyleId
  color: StoneColor
  x: number
  y: number
  radius: number
}

function randomSequence(seed: number) {
  let value = seed >>> 0
  return () => {
    value = (Math.imul(1664525, value) + 1013904223) >>> 0
    return value / 4294967296
  }
}

/** Center-based, transparent stone renderer; radius excludes its cast shadow. */
export function drawStone(ctx: CanvasRenderingContext2D, {
  style, color, x, y, radius,
}: DrawStoneOptions) {
  if (radius <= 0) return
  const appearance = stoneStyles[style]
  const white = color === 'white'
  const colors = appearance.colors[color]
  ctx.save()
  ctx.translate(x, y)
  ctx.scale(radius / 69, radius / 69)

  ctx.beginPath()
  ctx.arc(0, 0, 69, 0, Math.PI * 2)
  const body = ctx.createRadialGradient(-24, -30, 0, -8, -15, 103)
  for (const [i, stop] of [0, 0.3, 0.76, 1].entries()) body.addColorStop(stop, colors[i])
  ctx.fillStyle = body
  ctx.shadowColor = `rgba(26, 30, 20, ${appearance.shadow.opacity})`
  const transform = ctx.getTransform()
  const pixelScale = Math.hypot(transform.a, transform.b)
  ctx.shadowBlur = appearance.shadow.blur * pixelScale
  ctx.shadowOffsetX = appearance.shadow.x * pixelScale
  ctx.shadowOffsetY = appearance.shadow.y * pixelScale
  ctx.fill()
  ctx.shadowColor = 'transparent'

  ctx.save()
  ctx.clip()

  // Seeded in normalized coordinates: detail stays in place at every render size.
  const random = randomSequence(style === 'matte' ? 4811 : 7403)
  const grainCount = style === 'matte' ? 240 : style === 'satin' ? 1900 : 600
  for (let i = 0; i < grainCount; i++) {
    const gx = random() * 138 - 69
    const gy = random() * 138 - 69
    const bright = random() > 0.48
    const alpha = style === 'matte' ? 0.06 + random() * 0.15 : random() * 0.035
    ctx.fillStyle = bright ? `rgba(255,255,235,${alpha})` : `rgba(30,34,25,${alpha})`
    const dotRadius = style === 'matte' ? 0.12 + random() * 0.38 : 0.12 + random() * 0.16
    ctx.beginPath()
    ctx.arc(gx, gy, dotRadius, 0, Math.PI * 2)
    ctx.fill()
  }

  if (style === 'snow' && white) {
    // Yuki growth lines are fine and almost straight, with slight natural variation.
    // Fade their contrast in CSS units so small stones remain quiet at every DPR.
    const strength = Math.min(1, radius / 35)
    const shellRandom = randomSequence(9217)
    ctx.save()
    ctx.rotate(-0.18)
    for (let offset = -75; offset <= 75; offset += 3.6 + shellRandom() * 0.7) {
      const bend = (shellRandom() - 0.5) * 1.5
      const opacity = (0.17 + shellRandom() * 0.09) * strength
      ctx.beginPath()
      ctx.moveTo(offset, -78)
      ctx.bezierCurveTo(offset + bend, -26, offset + bend, 26, offset, 78)
      ctx.strokeStyle = `rgba(160,150,121,${opacity})`
      ctx.lineWidth = 0.45 + shellRandom() * 0.15
      ctx.stroke()
      ctx.translate(0.7, 0)
      ctx.strokeStyle = `rgba(255,255,255,${0.42 * strength})`
      ctx.lineWidth = 0.6
      ctx.stroke()
      ctx.translate(-0.7, 0)
    }
    ctx.restore()
  }

  if ((style === 'polished' || style === 'snow') && !white) {
    ctx.save()
    ctx.translate(-27, -43)
    ctx.rotate(-0.6)
    ctx.scale(1, 0.6)
    const highlight = ctx.createRadialGradient(0, 0, 0, 0, 0, 30)
    highlight.addColorStop(0, 'rgba(221,235,210,0.36)')
    highlight.addColorStop(0.4, 'rgba(200,221,186,0.15)')
    highlight.addColorStop(1, 'rgba(200,221,186,0)')
    ctx.fillStyle = highlight
    ctx.fillRect(-32, -32, 64, 64)
    ctx.restore()
  }

  ctx.restore()
  ctx.beginPath()
  ctx.arc(0, 0, 68.65, 0, Math.PI * 2)
  const rim = ctx.createLinearGradient(-45, -60, 40, 65)
  rim.addColorStop(0, white ? 'rgba(255,255,255,0.65)' : 'rgba(180,193,168,0.13)')
  rim.addColorStop(0.6, 'rgba(80,84,68,0.04)')
  rim.addColorStop(1, white ? 'rgba(255,255,255,0.6)' : 'rgba(0,8,1,0.25)')
  ctx.strokeStyle = rim
  ctx.lineWidth = 0.7
  ctx.stroke()
  ctx.restore()
}
