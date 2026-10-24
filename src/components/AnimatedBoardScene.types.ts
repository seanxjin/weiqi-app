import type { StoneColor } from '../lib/baduk'

/** A grid intersection and its normalized tracks within a shared board timeline. */
export interface AnimatedBoardMove {
  nodeId: string
  column: number
  row: number
  color: StoneColor
  opacityTimes: number[]
  landingTimes: number[]
}
