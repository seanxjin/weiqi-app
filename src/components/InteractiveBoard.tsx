import { useCallback, useId, useRef, useState } from 'react'
import type { KeyboardEvent, MouseEvent, PointerEvent } from 'react'
import { boardGeometry, boardThemes, drawStone } from '../lib/baduk'
import type { BoardThemeId, StoneColor, StoneStyleId } from '../lib/baduk'
import { BoardCanvas } from './BoardCanvas'
import { CanvasSurface } from './CanvasSurface'
import './InteractiveBoard.css'

export interface InteractiveBoardProps {
  boardTheme?: BoardThemeId
  stoneStyle?: StoneStyleId
  size?: number
}

interface Intersection { column: number; row: number }
interface PlacedStone extends Intersection { color: StoneColor }

const geometry = boardGeometry
const samePoint = (a: Intersection, b: Intersection) => a.column === b.column && a.row === b.row
const clamp = (value: number) => Math.max(0, Math.min(geometry.intersections - 1, value))
const pointLabel = ({ column, row }: Intersection) => `column ${column + 1}, row ${row + 1}`

export function InteractiveBoard({
  boardTheme = 'kaya', stoneStyle = 'polished', size,
}: InteractiveBoardProps) {
  const id = useId()
  const [stones, setStones] = useState<PlacedStone[]>([])
  const [hover, setHover] = useState<Intersection | null>(null)
  const keyboardPoint = useRef<Intersection>({ column: 9, row: 9 })
  const pointerType = useRef('mouse')
  const color: StoneColor = stones.length % 2 === 0 ? 'black' : 'white'
  const occupied = hover !== null && stones.some(stone => samePoint(stone, hover))
  const ghost = occupied ? null : hover

  function eventPoint(event: MouseEvent<HTMLDivElement> | PointerEvent<HTMLDivElement>): Intersection | null {
    const rect = event.currentTarget.getBoundingClientRect()
    if (!rect.width || !rect.height) return null
    return {
      column: clamp(Math.round(((event.clientX - rect.left) / rect.width * geometry.size - geometry.inset) / geometry.spacing)),
      row: clamp(Math.round(((event.clientY - rect.top) / rect.height * geometry.size - geometry.inset) / geometry.spacing)),
    }
  }

  function preview(point: Intersection | null) {
    setHover(previous => previous && point && samePoint(previous, point) ? previous : point)
  }

  function place(point: Intersection) {
    setStones(previous => previous.some(stone => samePoint(stone, point)) ? previous : [
      ...previous, { ...point, color: previous.length % 2 === 0 ? 'black' : 'white' },
    ])
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const { key } = event
    if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Enter', ' '].includes(key)) return
    event.preventDefault()
    const point = { ...(hover ?? keyboardPoint.current) }
    if (key === 'ArrowLeft') point.column = clamp(point.column - 1)
    if (key === 'ArrowRight') point.column = clamp(point.column + 1)
    if (key === 'ArrowUp') point.row = clamp(point.row - 1)
    if (key === 'ArrowDown') point.row = clamp(point.row + 1)
    keyboardPoint.current = point
    preview(point)
    if ((key === 'Enter' || key === ' ') && !event.repeat) place(point)
  }

  const drawPlaced = useCallback((ctx: CanvasRenderingContext2D, width: number) => {
    const scale = width / geometry.size
    for (const stone of stones) {
      drawStone(ctx, {
        style: stoneStyle, color: stone.color,
        x: (geometry.inset + stone.column * geometry.spacing) * scale,
        y: (geometry.inset + stone.row * geometry.spacing) * scale,
        radius: geometry.spacing * .95 / 2 * scale,
      })
    }
  }, [stones, stoneStyle])

  const drawGhost = useCallback((ctx: CanvasRenderingContext2D, width: number) => {
    if (!ghost) return
    const scale = width / geometry.size
    drawStone(ctx, {
      style: stoneStyle, color,
      x: (geometry.inset + ghost.column * geometry.spacing) * scale,
      y: (geometry.inset + ghost.row * geometry.spacing) * scale,
      radius: geometry.spacing * .95 / 2 * scale,
    })
  }, [ghost, color, stoneStyle])

  return (
    <div className="interactive-board" style={{ width: size === undefined ? '100%' : size }}>
      <div className="interactive-board__surface" tabIndex={0} role="group"
        aria-label={`Interactive 19 by 19 ${boardThemes[boardTheme].name} Go board`}
        aria-describedby={`${id}-instructions ${id}-status`}
        onKeyDown={onKeyDown} onBlur={() => preview(null)}
        onPointerMove={event => {
          if (!event.isPrimary) return
          pointerType.current = event.pointerType
          if (event.pointerType !== 'touch') preview(eventPoint(event))
        }}
        onPointerDown={event => {
          if (!event.isPrimary) return
          pointerType.current = event.pointerType
        }}
        onPointerLeave={() => preview(null)} onPointerCancel={() => preview(null)}
        onClick={event => {
          if (event.button !== 0) return
          const point = eventPoint(event)
          if (!point) return
          place(point)
          preview(pointerType.current === 'touch' ? null : point)
        }}>
        <BoardCanvas theme={boardTheme} />
        <div className="interactive-board__layer" aria-hidden="true">
          <CanvasSurface className="interactive-board__stones" label="Placed stones" draw={drawPlaced} />
        </div>
        <div className="interactive-board__layer" aria-hidden="true">
          <CanvasSurface className="interactive-board__ghost" label="Next stone preview" draw={drawGhost} />
        </div>
      </div>
      <p id={`${id}-instructions`} className="interactive-board__instructions">
        Click or tap to place a stone. Use arrow keys to select an intersection and Enter or Space to play.
      </p>
      <p id={`${id}-status`} className="interactive-board__status" role="status" aria-live="polite" aria-atomic="true">
        {color === 'black' ? 'Black' : 'White'} to play. {stones.length} stones placed.
        {hover && ` Selected ${pointLabel(hover)}${occupied ? ', occupied' : ''}.`}
      </p>
    </div>
  )
}
