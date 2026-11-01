import { useMemo } from 'react'
import { createBoardGeometry } from 'weiqi_board'
import type { BoardSize, Intersection } from 'weiqi_board'
import { Board } from '../../components/board'
import type { BoardProps } from '../../components/board/Board'
import type { LocalGameSnapshot } from '../../game/LocalGameController'
import lastMoveMarker from '../../assets/local-game/last-move-marker.svg'
import turnMarker from '../../assets/local-game/turn-marker.svg'
import lastMoveSymbol from '../../assets/local-game/last-move-symbol.svg'

type Props = Pick<BoardProps, 'boardTheme' | 'stoneStyle'> & {
  boardSize: BoardSize
  snapshot: LocalGameSnapshot | null
  onPlay?: (point: Intersection) => void
  onPass?: () => void
}
const columns = 'ABCDEFGHJKLMNOPQRST'

export function LocalBoardStage({ boardSize, snapshot, onPlay, onPass, ...appearance }: Props) {
  const geometry = useMemo(() => ({
    ...createBoardGeometry(boardSize),
    size: 744, inset: 48, spacing: 648 / (boardSize - 1),
    lineWidth: .7, edgeWidth: .7, starRadius: 2.5,
  }), [boardSize])
  const lastMove = snapshot?.moves[(snapshot?.viewedMoveIndex ?? 0) - 1]
  const reviewing = snapshot !== null && !snapshot.canPlay
  const turn = snapshot?.turnColor === 'white' ? 'White' : 'Black'
  const marker = lastMove?.point
  return (
    <>
      <div className="local-game__board-stage">
        <Board {...appearance} boardSize={boardSize} geometry={geometry} stones={snapshot?.stones}
          turnColor={snapshot?.turnColor} readOnly={!snapshot?.canPlay} onPlace={onPlay} />
        <svg className="local-game__board-overlay" viewBox="0 0 744 744" aria-hidden="true" focusable="false">
          <g className="local-game__coordinates">
            {Array.from({ length: boardSize }, (_, index) => {
              const coordinate = geometry.inset + index * geometry.spacing
              return <g key={index}>
                <text x={coordinate} y={22}>{columns[index]}</text>
                <text x={coordinate} y={722}>{columns[index]}</text>
                <text x={22} y={coordinate}>{boardSize - index}</text>
                <text x={722} y={coordinate}>{boardSize - index}</text>
              </g>
            })}
          </g>
          {marker && <image href={lastMoveMarker} width={10} height={10}
            className={lastMove.color === 'black' ? 'local-game__marker--black' : undefined}
            x={geometry.inset + marker.column * geometry.spacing - 5}
            y={geometry.inset + marker.row * geometry.spacing - 5} />}
        </svg>
      </div>
      <div className="local-game__board-footer">
        <p className="local-game__turn" role="status" aria-live="polite" aria-atomic="true">
          <img src={turnMarker} alt="" />
          {!snapshot ? 'Preparing board' : reviewing ? 'Reviewing · Return to Current to play' : `${turn} to play`}
        </p>
        <button className="local-game__pass" type="button" disabled={!snapshot?.canPlay} onClick={onPass}>Pass</button>
        <p className="local-game__last-move">
          <img src={lastMoveSymbol} alt="" />
          {lastMove ? `Last move: ${lastMove.color === 'black' ? 'Black' : 'White'} ${lastMove.label}` : 'Starting position'}
        </p>
      </div>
    </>
  )
}
