import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import type { BoardSize } from 'weiqi_board'
import arrow from '../../assets/go-home/local-arrow.svg'
import { SetupBoard } from './SetupBoard'
import { TimeControlSelector } from './TimeControlSelector'
import './GameSetupPage.css'

export default function GameSetupPage({ mode }: { mode: 'local' | 'online' }) {
  const navigate = useNavigate()
  const [notice, setNotice] = useState(0)
  const [boardSize, setBoardSize] = useState<BoardSize>(19)
  useEffect(() => { document.title = `Baduk — ${mode === 'local' ? 'Local' : 'Online'} Game Setup` }, [mode])
  return (
    <main className="game-setup" id="main-content" aria-label={`${mode === 'local' ? 'Local' : 'Online'} game setup`}>
      <Link className="setup-back" to="/play"><img src={arrow} alt="" />Back to menu</Link>
      <div className="setup-layout">
        <SetupBoard mode={mode} />
        <section className="setup-controls" aria-label="Game settings">
          {mode === 'online' ? <TimeControlSelector /> : (
            <label className="setup-field setup-board-size">
              <span>BOARD SIZE</span>
              <select value={boardSize} onChange={event => setBoardSize(Number(event.target.value) as BoardSize)}>
                <option value={9}>9 × 9</option>
                <option value={13}>13 × 13</option>
                <option value={19}>19 × 19</option>
              </select>
            </label>
          )}
          <button className="setup-play" type="button" onClick={() => {
            if (mode === 'local') navigate(`/play/local?size=${boardSize}`)
            else setNotice(value => value + 1)
          }}>Play Go<img src={arrow} alt="" /></button>
          <div className="setup-notice" role="status" aria-live="polite" aria-atomic="true">
            {notice > 0 && <p key={notice}>Online play is coming soon.</p>}
          </div>
        </section>
      </div>
    </main>
  )
}
