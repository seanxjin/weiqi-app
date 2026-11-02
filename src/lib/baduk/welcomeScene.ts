import type { BoardThemeId, StoneStyleId } from 'weiqi_board'
import type { AnimatedBoardMove } from '../../components/AnimatedBoardScene.types'

export interface SceneAppearance {
  boardTheme: BoardThemeId
  stoneStyle: StoneStyleId
}

export const welcomeAppearance: SceneAppearance = { boardTheme: 'ash', stoneStyle: 'polished' }
export const boardLoopSeconds = 60

// Zero-based intersections and verbatim normalized times from Figma frame 26:936.
// Each tuple is column, row, appearance start, opacity end, landing end.
const moveTracks = [
  [15, 3, 0.0222, 0.03, 0.0389],
  [3, 15, 0.0639, 0.0717, 0.0806],
  [15, 15, 0.1056, 0.1133, 0.1222],
  [3, 3, 0.1472, 0.155, 0.1639],
  [13, 2, 0.1889, 0.1967, 0.2056],
  [15, 5, 0.2306, 0.2383, 0.2472],
  [14, 5, 0.2722, 0.28, 0.2889],
  [14, 6, 0.3139, 0.3217, 0.3306],
  [13, 5, 0.3556, 0.3633, 0.3722],
  [13, 6, 0.3972, 0.405, 0.4139],
  [12, 4, 0.4389, 0.4467, 0.4556],
  [16, 3, 0.4806, 0.4883, 0.4972],
  [16, 2, 0.5222, 0.53, 0.5389],
  [16, 4, 0.5639, 0.5717, 0.5806],
  [5, 15, 0.6056, 0.6133, 0.6222],
  [5, 16, 0.6472, 0.655, 0.6639],
  [6, 16, 0.6889, 0.6967, 0.7056],
  [4, 16, 0.7306, 0.7383, 0.7472],
  [6, 14, 0.7722, 0.78, 0.7889],
  [4, 14, 0.8139, 0.8217, 0.8306],
  [5, 13, 0.8556, 0.8633, 0.8722],
  [3, 12, 0.8972, 0.905, 0.9139],
] as const

export const welcomeMoves: AnimatedBoardMove[] = moveTracks.map(
  ([column, row, start, visible, landed], index) => ({
    nodeId: `26:${1059 + index}`,
    column,
    row,
    color: index % 2 === 0 ? 'black' : 'white',
    opacityTimes: [0, start, visible, 1],
    landingTimes: [0, start, landed, 1],
  }),
)
