import type { BoardThemeId, StoneStyleId } from '../../lib/baduk'
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
  [15, 3, .0222, .03, .0389], [3, 15, .0639, .0717, .0806],
  [15, 15, .1056, .1133, .1222], [3, 3, .1472, .155, .1639],
  [13, 2, .1889, .1967, .2056], [15, 5, .2306, .2383, .2472],
  [14, 5, .2722, .28, .2889], [14, 6, .3139, .3217, .3306],
  [13, 5, .3556, .3633, .3722], [13, 6, .3972, .405, .4139],
  [12, 4, .4389, .4467, .4556], [16, 3, .4806, .4883, .4972],
  [16, 2, .5222, .53, .5389], [16, 4, .5639, .5717, .5806],
  [5, 15, .6056, .6133, .6222], [5, 16, .6472, .655, .6639],
  [6, 16, .6889, .6967, .7056], [4, 16, .7306, .7383, .7472],
  [6, 14, .7722, .78, .7889], [4, 14, .8139, .8217, .8306],
  [5, 13, .8556, .8633, .8722], [3, 12, .8972, .905, .9139],
] as const

export const welcomeMoves: AnimatedBoardMove[] = moveTracks.map(([column, row, start, visible, landed], index) => ({
  nodeId: `26:${1059 + index}`, column, row,
  color: index % 2 === 0 ? 'black' : 'white',
  opacityTimes: [0, start, visible, 1], landingTimes: [0, start, landed, 1],
}))
