import type { BoardConfig } from 'weiqi_board'
import { useLocalGame } from '../../game/useLocalGame'
import { LocalPlayers } from './LocalPlayers'
import { LocalBoardStage } from './LocalBoardStage'
import { MoveHistoryPanel } from './MoveHistoryPanel'
import './LocalBoard.css'

export type LocalBoardProps = Pick<BoardConfig, 'boardTheme' | 'stoneStyle' | 'size' | 'boardSize'>

export function LocalBoard({ boardSize = 19, ...appearance }: LocalBoardProps) {
  return <LocalGameBoard key={boardSize} {...appearance} boardSize={boardSize} />
}

function LocalGameBoard({ boardSize = 19, ...appearance }: LocalBoardProps) {
  const { controller, snapshot, error, retry } = useLocalGame(boardSize)
  return (
    <section className="local-game" aria-label="Local Go game">
      <div className="local-game__playing-area" style={{ maxWidth: appearance.size }}>
        <LocalPlayers stoneStyle={appearance.stoneStyle} />
        <LocalBoardStage boardTheme={appearance.boardTheme} stoneStyle={appearance.stoneStyle}
          boardSize={boardSize} snapshot={snapshot} onPlay={controller?.play} onPass={controller?.pass} />
        <div className="local-game__feedback">
          <p role="status" aria-live="polite">{error ?? (!snapshot ? 'Loading Go engine…' : '')}</p>
          {error && <button type="button" onClick={retry}>Retry</button>}
          <p className="local-game__error" role="alert">{snapshot?.error}</p>
        </div>
      </div>
      <MoveHistoryPanel snapshot={snapshot} onView={controller?.viewMove} onUndo={controller?.undo} />
    </section>
  )
}
