import { StoneCanvas } from './StoneCanvas'
import type { StoneStyleId } from '../lib/baduk'
import './StoneMark.css'

interface StoneMarkProps {
  style: StoneStyleId
  size: number
  horizontal?: boolean
  compact?: boolean
}

/** A decorative mark made from the same materials as stones on the board. */
export function StoneMark({ style, size, horizontal = false, compact = false }: StoneMarkProps) {
  return (
    <span className={`stone-mark${horizontal ? ' stone-mark--horizontal' : ''}${compact ? ' stone-mark--compact' : ''}`}
      style={{ width: size, height: size }} aria-hidden="true">
      <span className="stone-mark__white"><StoneCanvas style={style} color="white" size={size * .65} /></span>
      <span className="stone-mark__black"><StoneCanvas style={style} color="black" size={size * .65} /></span>
    </span>
  )
}
