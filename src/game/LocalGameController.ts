import { samePoint } from 'weiqi_board'
import type { BoardApi, BoardSize, Intersection, Stone, StoneColor } from 'weiqi_board'
import type {
  EngineGame,
  EngineModule,
  EngineMoveResult,
  EnginePosition,
  IllegalMoveReason,
} from './bindings'

export interface LocalMove {
  readonly number: number
  readonly color: StoneColor
  readonly label: string
  readonly point: Readonly<Intersection> | null
  readonly captureCount: number
}

export interface LocalGameSnapshot {
  readonly boardSize: BoardSize
  readonly stones: readonly Stone[]
  readonly turnColor: StoneColor
  readonly captures: Readonly<Record<StoneColor, number>>
  readonly moves: readonly LocalMove[]
  readonly latestMoveIndex: number
  readonly viewedMoveIndex: number
  readonly canPlay: boolean
  readonly canUndo: boolean
  readonly error: string | null
}

const reasons: Record<IllegalMoveReason, string> = {
  OutOfBounds: 'Choose an intersection on the board.',
  Occupied: 'That intersection is occupied.',
  WrongPlayer: 'It is the other player’s turn.',
  Suicide: 'Suicide is not allowed.',
  Ko: 'That move is forbidden by ko.',
  Superko: 'That move repeats an earlier position.',
  GameEnded: 'This game cannot accept another move.',
}
const columns = 'ABCDEFGHJKLMNOPQRST'

export class LocalGameController {
  private readonly game: EngineGame
  private readonly boardSize: BoardSize
  private readonly listeners = new Set<() => void>()
  private positions: EnginePosition[] = []
  private moves: readonly LocalMove[] = []
  private viewed = 0
  private disposed = false
  private snapshot!: LocalGameSnapshot

  constructor(module: EngineModule, boardSize: BoardSize) {
    this.boardSize = boardSize
    this.game = new module.Game({
      boardSize,
      startingPlayer: 'Black',
      rules: { superko: 'None', suicide: 'Forbidden', passEnding: 'NoAutomaticEnd' },
    })
    try {
      this.refresh()
    } catch (error) {
      this.game.delete()
      throw error
    }
  }

  getSnapshot = (): LocalGameSnapshot => this.snapshot

  subscribe = (listener: () => void): (() => void) => {
    if (this.disposed) return () => {}
    this.listeners.add(listener)
    return () => {
      this.listeners.delete(listener)
    }
  }

  /** The board has already committed the move and DOM before this event arrives. */
  play = (point: Intersection, color: StoneColor, board: BoardApi): void => {
    try {
      if (!this.disposed && this.snapshot.canPlay)
        this.accept(
          this.game.play({
            type: 'play',
            color: color === 'black' ? 'Black' : 'White',
            point: { x: point.column, y: point.row },
          }),
        )
    } finally {
      // Always check, even when a rejection leaves the authoritative position unchanged.
      this.reconcile(board)
    }
  }

  /** Reconciliation never calls the engine, emits a move, or advances the turn. */
  reconcile = (board: BoardApi): void => {
    const snapshot = this.snapshot
    const current = board.getState()
    const lastMove = snapshot.moves[snapshot.viewedMoveIndex - 1]?.point ?? null
    const sameLastMove =
      current.lastMove === null
        ? lastMove === null
        : lastMove !== null && samePoint(current.lastMove, lastMove)
    const stones = new Map(
      snapshot.stones.map((stone) => [`${stone.column},${stone.row}`, stone.color]),
    )
    const sameStones =
      current.stones.length === stones.size &&
      current.stones.every((stone) => stones.get(`${stone.column},${stone.row}`) === stone.color)
    if (
      sameStones &&
      sameLastMove &&
      current.turnColor === snapshot.turnColor &&
      current.readOnly === !snapshot.canPlay &&
      current.boardSize === snapshot.boardSize
    )
      return
    board.set({
      boardSize: snapshot.boardSize,
      stones: snapshot.stones,
      turnColor: snapshot.turnColor,
      lastMove,
      readOnly: !snapshot.canPlay,
    })
  }

  pass = (): void => {
    if (!this.disposed && this.snapshot.canPlay) this.accept(this.game.pass())
  }

  undo = (): void => {
    if (this.disposed || !this.snapshot.canUndo) return
    this.game.undo()
    this.refresh()
  }

  viewMove = (index: number): void => {
    if (this.disposed || !Number.isInteger(index) || index < 0 || index >= this.positions.length)
      return
    if (index === this.viewed && this.snapshot.error === null) return
    this.viewed = index
    this.publish()
  }

  dispose = (): void => {
    if (this.disposed) return
    this.disposed = true
    this.listeners.clear()
    this.game.delete()
  }

  private accept(result: EngineMoveResult): void {
    if (result.ok) this.refresh()
    else this.publish(reasons[result.reason])
  }

  private refresh(): void {
    this.positions = this.game.positions()
    this.moves = Object.freeze(
      this.game.history().map(({ move, capturedStones }, index) =>
        Object.freeze({
          number: index + 1,
          color: move.color === 'Black' ? ('black' as const) : ('white' as const),
          label:
            move.type === 'pass'
              ? 'Pass'
              : `${columns[move.point.x]}${this.boardSize - move.point.y}`,
          point:
            move.type === 'pass'
              ? null
              : Object.freeze({ column: move.point.x, row: move.point.y }),
          captureCount: capturedStones.length,
        }),
      ),
    )
    this.viewed = this.positions.length - 1
    this.publish()
  }

  private publish(error: string | null = null): void {
    const position = this.positions[this.viewed]
    const stones: Stone[] = []
    position.board.cells.forEach((color, index) => {
      if (color !== 'Empty')
        stones.push(
          Object.freeze({
            column: index % this.boardSize,
            row: Math.floor(index / this.boardSize),
            color: color === 'Black' ? 'black' : 'white',
          }),
        )
    })
    const latest = this.positions.length - 1
    const captures = { black: 0, white: 0 }
    for (let index = 0; index < this.viewed; index++) {
      const move = this.moves[index]
      captures[move.color] += move.captureCount
    }
    this.snapshot = Object.freeze({
      boardSize: this.boardSize,
      stones: Object.freeze(stones),
      turnColor: position.currentPlayer === 'Black' ? 'black' : 'white',
      captures: Object.freeze(captures),
      moves: this.moves,
      latestMoveIndex: latest,
      viewedMoveIndex: this.viewed,
      canPlay: this.viewed === latest,
      canUndo: latest > 0,
      error,
    })
    this.listeners.forEach((listener) => listener())
  }
}
