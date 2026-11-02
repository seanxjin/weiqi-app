import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import type { Root } from 'react-dom/client'
import { flushSync } from 'react-dom'
import { WeiqiBoard, loadTexture, boardThemes } from 'weiqi_board'
import type {
  BoardApi,
  BoardConfig,
  BoardState,
  Intersection,
  PlacementMetadata,
  StoneColor,
} from 'weiqi_board'
import { Board } from '../../src/components/board/Board'
import { LocalGameController } from '../../src/game/LocalGameController'
import { loadEngine } from '../../src/game/loadEngine'
import 'weiqi_board/style.css'

type Event = {
  type: string
  state?: BoardState
  point?: Intersection
  color?: StoneColor
  metadata?: PlacementMetadata
  domCount?: number
  markerVisible?: boolean
  sets?: number
}

export interface Harness {
  ready: boolean
  board: BoardApi
  controller?: LocalGameController
  events: Event[]
  reactConfig?: BoardConfig
  create: typeof WeiqiBoard
  metrics: { boardPaints: number; spriteBuilds: number; sets: number }
  mount(config?: BoardConfig, engine?: boolean): Promise<void>
  renderReact(config?: BoardConfig): void
}

declare global {
  interface Window {
    harness: Harness
  }
}

const host = document.querySelector<HTMLElement>('#primary')!
let reactRoot: Root | undefined
const metrics = { boardPaints: 0, spriteBuilds: 0, sets: 0 }
const originalFillRect = CanvasRenderingContext2D.prototype.fillRect
CanvasRenderingContext2D.prototype.fillRect = function (...args) {
  if (this.canvas.classList.contains('board-canvas')) metrics.boardPaints++
  return originalFillRect.apply(this, args)
}
const originalDataURL = HTMLCanvasElement.prototype.toDataURL
HTMLCanvasElement.prototype.toDataURL = function (...args) {
  metrics.spriteBuilds++
  return originalDataURL.apply(this, args)
}

function instrument(board: BoardApi) {
  const set = board.set.bind(board)
  board.set = (config) => {
    metrics.sets++
    set(config)
  }
  return board
}

function onPlace(point: Intersection, color: StoneColor, metadata: PlacementMetadata) {
  const board = harness.board
  harness.events.push({
    type: 'place',
    point,
    color,
    metadata,
    state: board.getState(),
    domCount: host.querySelectorAll('.weiqi-board__stones img').length,
    markerVisible: !host.querySelector<HTMLElement>('.weiqi-board__last-move')!.hidden,
  })
  if (harness.controller) {
    harness.events.push({ type: 'verify', state: board.getState() })
    const before = metrics.sets
    harness.controller.play(point, color, board)
    harness.events.push({ type: 'verified', state: board.getState(), sets: metrics.sets - before })
  }
}

const harness: Harness = {
  ready: false,
  create: WeiqiBoard,
  board: undefined!,
  events: [],
  metrics,
  async mount(config = {}, engine = false) {
    if (reactRoot) {
      flushSync(() => reactRoot!.unmount())
      reactRoot = undefined
    }
    harness.board?.destroy()
    harness.controller?.dispose()
    harness.controller = engine
      ? new LocalGameController(await loadEngine(), config.boardSize ?? 19)
      : undefined
    harness.events = []
    harness.board = instrument(
      WeiqiBoard(host, {
        ...config,
        onPlace,
        premovable: {
          ...config.premovable,
          events: {
            set: () => harness.events.push({ type: 'queue' }),
            unset: () => harness.events.push({ type: 'unqueue' }),
          },
        },
      }),
    )
    await Promise.all(Object.values(boardThemes).map((theme) => loadTexture(theme.texture)))
    await new Promise<void>((resolve) =>
      requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
    )
  },
  renderReact(config = {}) {
    harness.reactConfig = config
    if (!reactRoot) {
      harness.board?.destroy()
      harness.controller?.dispose()
      harness.controller = undefined
      harness.events = []
      reactRoot = createRoot(host)
    }
    flushSync(() =>
      reactRoot!.render(
        <StrictMode>
          <Board
            {...config}
            onPlace={onPlace}
            ref={(board) => {
              if (board) harness.board = board
            }}
          />
        </StrictMode>,
      ),
    )
  },
}
window.harness = harness
await harness.mount()
harness.ready = true
document.querySelector('#summary')!.textContent =
  'Board ready. Run npm run test:board for automated verification.'
document.querySelector('#board-theme')!.addEventListener('change', (event) => {
  harness.board.set({
    boardTheme: (event.target as HTMLSelectElement).value as BoardConfig['boardTheme'],
  })
})
document.querySelector('#stone-style')!.addEventListener('change', (event) => {
  harness.board.set({
    stoneStyle: (event.target as HTMLSelectElement).value as BoardConfig['stoneStyle'],
  })
})
