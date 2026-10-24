import kayaTexture from '../../assets/boards/kaya.png'
import walnutTexture from '../../assets/boards/walnut.png'
import ashTexture from '../../assets/boards/ash.png'

export type BoardThemeId = 'kaya' | 'walnut' | 'ash'
export type StoneStyleId = 'polished' | 'satin' | 'matte' | 'snow'
export type StoneColor = 'black' | 'white'

export interface BoardGeometry {
  size: number
  inset: number
  spacing: number
  intersections: number
  lineWidth: number
  edgeWidth: number
  starRadius: number
  starIndices: readonly number[]
}

export const boardGeometry = {
  size: 800,
  inset: 58,
  spacing: 38,
  intersections: 19,
  lineWidth: 0.8,
  edgeWidth: 1.2,
  starRadius: 3.1,
  starIndices: [3, 9, 15],
} as const

/** Figma's welcome board; material-library callers keep the default layout. */
export const welcomeBoardGeometry: BoardGeometry = {
  size: 610, inset: 35, spacing: 30, intersections: 19,
  lineWidth: 0.7, edgeWidth: 0.7, starRadius: 2.5, starIndices: [3, 9, 15],
}

export const boardThemes = {
  kaya: {
    name: 'Traditional Japanese kaya',
    material: 'Warm honey · straight grain',
    texture: kayaTexture,
    frame: '#a97537',
    grid: '#493520',
  },
  walnut: {
    name: 'Dark walnut',
    material: 'Deep brown · flowing grain',
    texture: walnutTexture,
    frame: '#2b1c16',
    grid: '#bc9d79',
  },
  ash: {
    name: 'Pale Scandinavian ash',
    material: 'Pale timber · soft grain',
    texture: ashTexture,
    frame: '#b5a68b',
    grid: '#696354',
  },
} as const satisfies Record<BoardThemeId, {
  name: string; material: string; texture: string; frame: string; grid: string
}>

const blackSlateColors = ['#4b5549', '#252e25', '#161e17', '#0f1610'] as const
const polishedShadow = { blur: 10, x: 2, y: 5, opacity: 0.22 } as const

export const stoneStyles = {
  polished: {
    finish: 'Polished',
    name: 'Slate',
    description: 'Smooth, polished surfaces with a quiet mineral texture.',
    labels: { black: 'Black slate', white: 'White slate' },
    colors: {
      black: blackSlateColors,
      white: ['#fbfaf4', '#f3f1e8', '#e6e4d9', '#d3d1c4'],
    },
    shadow: polishedShadow,
  },
  satin: {
    finish: 'Satin',
    name: 'Ceramic',
    description: 'A diffused sheen and delicate, even fine grain.',
    labels: { black: 'Black ceramic', white: 'White ceramic' },
    colors: {
      black: ['#535d51', '#3e483e', '#303a30', '#222c24'],
      white: ['#f7f7ef', '#eeeee4', '#e2e2d7', '#c9cbbf'],
    },
    shadow: { blur: 7, x: 2, y: 4, opacity: 0.19 },
  },
  matte: {
    finish: 'Matte',
    name: 'Natural stone',
    description: 'Quiet mineral speckling under a smooth, dry finish.',
    labels: { black: 'Black stone', white: 'White stone' },
    colors: {
      black: ['#485047', '#363e35', '#2c342b', '#20281f'],
      white: ['#eeede7', '#e4e3dc', '#d9d8d0', '#c2c4b7'],
    },
    shadow: { blur: 5, x: 1, y: 3, opacity: 0.17 },
  },
  snow: {
    finish: 'Polished',
    name: 'Clamshell · Yuki / Snow Grade',
    description: 'Fine, close-set shell grain on milky white, paired with polished black slate.',
    labels: { black: 'Black Nachiguro slate', white: 'White Yuki clamshell' },
    colors: {
      black: blackSlateColors,
      white: ['#fffef9', '#f8f7f1', '#eeece3', '#d7d6ca'],
    },
    shadow: polishedShadow,
  },
} as const
