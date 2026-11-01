import { useEffect, useState } from 'react'
import { AnimatedBoardScene } from '../../components/AnimatedBoardScene'
import { boardLoopSeconds, welcomeAppearance, welcomeMoves } from '../../lib/baduk/welcomeScene'
import { PlayerPlaceholder } from './PlayerPlaceholder'

export function SetupBoard({ mode }: { mode: 'local' | 'online' }) {
  const [visible, setVisible] = useState(() => !window.matchMedia('(max-width: 46rem)').matches)
  useEffect(() => {
    const query = window.matchMedia('(max-width: 46rem)')
    const update = () => setVisible(!query.matches)
    update()
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])
  return visible ? <div className="setup-board">
    <PlayerPlaceholder name={mode === 'local' ? 'Player 2' : 'Opponent'} />
    <AnimatedBoardScene {...welcomeAppearance} moves={welcomeMoves} duration={boardLoopSeconds}
      paused={false} reducedMotion={false} showCaption={false} />
    <PlayerPlaceholder name={mode === 'local' ? 'Player 1' : 'You (Guest)'} />
  </div> : null
}
