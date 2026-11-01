import type { StoneStyleId } from 'weiqi_board'
import { StoneCanvas } from '../../components/board'

export function LocalPlayers({ stoneStyle = 'polished' }: { stoneStyle?: StoneStyleId }) {
  return (
    <div className="local-game__players" aria-label="Players">
      {(['black', 'white'] as const).map(color => (
        <div className="local-game__player" key={color}>
          <span className="local-game__player-stone" aria-hidden="true">
            <StoneCanvas color={color} style={stoneStyle} size={29} />
          </span>
          <span>{color === 'black' ? 'Black' : 'White'}</span>
        </div>
      ))}
    </div>
  )
}
