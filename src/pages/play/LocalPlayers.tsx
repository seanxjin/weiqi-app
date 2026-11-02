import type { StoneColor, StoneStyleId } from 'weiqi_board'
import { StoneCanvas } from '../../components/board'

interface LocalPlayersProps {
  stoneStyle?: StoneStyleId
  captures?: Readonly<Record<StoneColor, number>>
}

export function LocalPlayers({ stoneStyle = 'polished', captures }: LocalPlayersProps) {
  return (
    <div className="local-game__players" aria-label="Players">
      {(['black', 'white'] as const).map((color) => (
        <div className="local-game__player" key={color}>
          <span className="local-game__player-stone" aria-hidden="true">
            <StoneCanvas color={color} style={stoneStyle} size={29} />
          </span>
          <span className="local-game__player-name">{color === 'black' ? 'Black' : 'White'}</span>
          <span className="local-game__player-captures">Captured {captures?.[color] ?? 0}</span>
        </div>
      ))}
    </div>
  )
}
