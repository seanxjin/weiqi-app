export interface BranchStroke {
  path: string
  width: number
  delay: number
  duration: number
}

export interface Blossom {
  x: number
  y: number
  size: number
  delay: number
  rotation: number
}

export interface SakuraBranch {
  name: string
  viewBox: string
  strokes: readonly BranchStroke[]
  blossoms: readonly Blossom[]
  fallingPetals: readonly { blossom: number; duration: number; delay: number; drift: number }[]
}

// Adjacent bough sections share endpoints; every twig begins on a bough joint.
export const branches: readonly SakuraBranch[] = [
  {
    name: 'foreground', viewBox: '0 0 243 248',
    strokes: [
      { path: 'M-12 248 C4 231 18 217 30 200', width: 3.1, delay: 0, duration: 1 },
      { path: 'M30 200 C46 177 48 151 64 128', width: 2.8, delay: 1, duration: 1 },
      { path: 'M64 128 C80 104 99 82 116 60', width: 2.3, delay: 2, duration: 1 },
      { path: 'M116 60 C131 42 143 31 158 22', width: 1.8, delay: 3, duration: 1 },
      { path: 'M30 200 C26 180 15 164 1 153', width: .85, delay: 1.4, duration: 1.7 },
      { path: 'M64 128 C53 109 48 87 50 62', width: .9, delay: 2.6, duration: 1.6 },
      { path: 'M64 128 C86 137 106 137 125 144', width: .8, delay: 2.7, duration: 1.7 },
      { path: 'M64 128 C80 121 89 115 99 108', width: .65, delay: 2.8, duration: 1.5 },
      { path: 'M116 60 C106 46 104 29 108 10', width: .8, delay: 3.2, duration: 1.4 },
      { path: 'M116 60 C131 61 147 59 162 55', width: .8, delay: 3.4, duration: 1.3 },
    ],
    blossoms: [
      { x: 158, y: 22, size: 19, delay: 4.1, rotation: 10 },
      { x: 50, y: 62, size: 17, delay: 4.3, rotation: -14 },
      { x: 125, y: 144, size: 21, delay: 4.5, rotation: 20 },
      { x: 99, y: 108, size: 15, delay: 4.4, rotation: -8 },
      { x: 108, y: 10, size: 16, delay: 4.7, rotation: 10 },
      { x: 162, y: 55, size: 17, delay: 4.8, rotation: -15 },
    ],
    fallingPetals: [{ blossom: 0, duration: 8, delay: 14, drift: 45 }],
  },
  {
    name: 'overhanging', viewBox: '0 0 430 154',
    strokes: [
      { path: 'M435 20 C398 25 370 37 340 44', width: 3.2, delay: 0, duration: 1 },
      { path: 'M340 44 C308 49 284 59 259 68', width: 2.9, delay: 1, duration: 1 },
      { path: 'M259 68 C229 78 203 87 179 91', width: 2.5, delay: 2, duration: 1 },
      { path: 'M179 91 C157 99 139 106 120 110', width: 1.8, delay: 3, duration: 1 },
      { path: 'M340 44 C332 34 304 25 260 24', width: .85, delay: 1.7, duration: 1.6 },
      { path: 'M340 44 C330 46 320 48 310 50', width: .65, delay: 2.2, duration: 1.5 },
      { path: 'M340 44 C344 71 353 92 394 114', width: .85, delay: 2.5, duration: 1.8 },
      { path: 'M259 68 C247 62 235 57 222 57', width: .7, delay: 2.5, duration: 1.5 },
      { path: 'M259 68 C259 93 257 115 253 140', width: .75, delay: 2.6, duration: 1.9 },
      { path: 'M259 68 C246 86 224 115 201 134', width: .7, delay: 2.8, duration: 1.7 },
      { path: 'M179 91 C169 79 157 75 145 73', width: .8, delay: 3.2, duration: 1.3 },
      { path: 'M179 91 C156 112 132 125 101 127', width: .75, delay: 3.4, duration: 1.4 },
    ],
    blossoms: [
      { x: 260, y: 24, size: 20, delay: 4, rotation: 12 },
      { x: 310, y: 50, size: 14, delay: 4.2, rotation: -12 },
      { x: 394, y: 114, size: 21, delay: 4.5, rotation: 20 },
      { x: 222, y: 57, size: 17, delay: 4.1, rotation: -8 },
      { x: 253, y: 140, size: 16, delay: 4.6, rotation: 18 },
      { x: 201, y: 134, size: 18, delay: 4.7, rotation: -18 },
      { x: 145, y: 73, size: 21, delay: 4.6, rotation: 8 },
      { x: 101, y: 127, size: 16, delay: 4.9, rotation: -10 },
    ],
    fallingPetals: [
      { blossom: 3, duration: 10, delay: 6, drift: -80 },
      { blossom: 7, duration: 12, delay: 10, drift: 60 },
    ],
  },
]
