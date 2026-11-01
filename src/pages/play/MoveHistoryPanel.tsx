import { useEffect, useRef } from 'react'
import type { LocalGameSnapshot } from '../../game/LocalGameController'
import headingDivider from '../../assets/local-game/heading-divider.svg'
import blackKey from '../../assets/local-game/black-key.svg'
import whiteKey from '../../assets/local-game/white-key.svg'
import currentMove from '../../assets/local-game/current-move.svg'
import skipBack from '../../assets/local-game/skip-back.svg'
import previous from '../../assets/local-game/chevron-left.svg'
import next from '../../assets/local-game/chevron-right.svg'
import skipForward from '../../assets/local-game/skip-forward.svg'
import undo from '../../assets/local-game/undo.svg'

interface Props {
  snapshot: LocalGameSnapshot | null
  onView?: (index: number) => void
  onUndo?: () => void
}

export function MoveHistoryPanel({ snapshot, onView, onUndo }: Props) {
  const scroll = useRef<HTMLDivElement>(null)
  const viewed = snapshot?.viewedMoveIndex ?? 0
  const latest = snapshot?.latestMoveIndex ?? 0
  const moves = snapshot?.moves ?? []
  useEffect(() => {
    const panel = scroll.current
    const selected = panel?.querySelector<HTMLElement>('[aria-current="step"]')
    if (!panel) return
    if (!selected) { panel.scrollTop = 0; return }
    const bounds = selected.getBoundingClientRect()
    const visible = panel.getBoundingClientRect()
    const headerHeight = panel.querySelector('thead')?.getBoundingClientRect().height ?? 0
    if (bounds.top < visible.top + headerHeight) panel.scrollTop -= visible.top + headerHeight - bounds.top
    else if (bounds.bottom > visible.bottom) panel.scrollTop += bounds.bottom - visible.bottom
  }, [viewed, latest])

  const navigation = [
    { label: 'Start', icon: skipBack, index: 0, disabled: viewed === 0 },
    { label: 'Previous', icon: previous, index: viewed - 1, disabled: viewed === 0 },
    { label: 'Next', icon: next, index: viewed + 1, disabled: viewed === latest },
    { label: 'Current', icon: skipForward, index: latest, disabled: viewed === latest },
  ]

  return (
    <aside className="local-game__history" aria-label="Move history">
      <div className="local-game__history-heading">
        <h2>Moves</h2><span>{latest} {latest === 1 ? 'MOVE' : 'MOVES'}</span>
      </div>
      <img className="local-game__heading-divider" src={headingDivider} alt="" />
      <div className="local-game__move-scroll" ref={scroll}>
        <table className="local-game__move-table" aria-label="Black and White moves">
          <colgroup><col className="local-game__pair-column" /><col /><col /></colgroup>
          <thead><tr>
            <th scope="col"><span aria-hidden="true">#</span><span className="local-game__sr-only">Pair</span></th>
            <th scope="col"><span><img src={blackKey} alt="" />Black</span></th>
            <th scope="col"><span><img src={whiteKey} alt="" />White</span></th>
          </tr></thead>
          <tbody>
            {Array.from({ length: Math.ceil(moves.length / 2) }, (_, pair) => (
              <tr key={pair}>
                <th scope="row">{pair + 1}.</th>
                {[moves[pair * 2], moves[pair * 2 + 1]].map((move, column) => (
                  <td key={column}>
                    {move && <button type="button" aria-current={viewed === move.number ? 'step' : undefined}
                      aria-label={`Move ${move.number}, ${move.color === 'black' ? 'Black' : 'White'}, ${move.label}`}
                      onClick={() => onView?.(move.number)}>
                      {move.label}
                      {viewed === move.number && <img src={currentMove} alt="" />}
                    </button>}
                  </td>
                ))}
              </tr>
            ))}
            {!moves.length && <tr><td colSpan={3} className="local-game__empty">No moves yet.</td></tr>}
          </tbody>
        </table>
      </div>
      <div className="local-game__review-controls">
        <div className="local-game__position" role="status" aria-live="polite" aria-atomic="true">
          <span>Move {viewed} of {latest}</span>
          <span>{viewed === latest ? 'CURRENT POSITION' : 'REVIEWING'}</span>
        </div>
        <nav className="local-game__navigation" aria-label="Move history navigation">
          {navigation.map(control => <div key={control.label}>
            <button type="button" aria-label={control.label} disabled={!snapshot || control.disabled}
              onClick={() => onView?.(control.index)}><img src={control.icon} alt="" /></button>
            <span aria-hidden="true">{control.label}</span>
          </div>)}
        </nav>
        <button className="local-game__undo" type="button" disabled={!snapshot?.canUndo} onClick={onUndo}>
          <img src={undo} alt="" />Undo last move
        </button>
        <p className="local-game__encouragement">Take your time. Every move matters.</p>
      </div>
    </aside>
  )
}
