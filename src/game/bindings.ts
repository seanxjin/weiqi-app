export type EngineColor = 'Black' | 'White'
type Cell = EngineColor | 'Empty'
type Point = { x: number; y: number }
export type EngineMove =
  | { type: 'play'; color: EngineColor; point: Point }
  | { type: 'pass'; color: EngineColor }

export interface EnginePosition {
  board: { size: number; cells: Cell[] }
  currentPlayer: EngineColor
  moveNumber: number
  consecutivePasses: number
  koPoint: Point | null
}

export type IllegalMoveReason =
  | 'OutOfBounds' | 'Occupied' | 'WrongPlayer' | 'Suicide' | 'Ko' | 'GameEnded' | 'Superko'

export type EngineMoveResult =
  | { ok: true; nextPosition: EnginePosition }
  | { ok: false; reason: IllegalMoveReason }

export interface EngineGame {
  play(move: EngineMove): EngineMoveResult
  pass(): EngineMoveResult
  turn(): EngineColor
  undo(): { move: EngineMove } | null
  history(): { move: EngineMove }[]
  positions(): EnginePosition[]
  delete(): void
}

export interface EngineModule {
  Game: new (config: {
    boardSize: number
    startingPlayer: EngineColor
    rules: { superko: 'None'; suicide: 'Forbidden'; passEnding: 'NoAutomaticEnd' }
  }) => EngineGame
}

export type EngineFactory = (options: {
  locateFile(path: string, prefix: string): string
}) => Promise<EngineModule>
