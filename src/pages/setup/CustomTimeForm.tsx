import { useId, useState } from 'react'
import arrow from '../../assets/go-home/local-arrow.svg'
import { clockSystems, defaultCustomTime, validateCustomTime } from './timeControls'
import type { ClockSystem, CustomTime } from './timeControls'

export function CustomTimeForm({ onApply }: { onApply: (value: CustomTime) => void }) {
  const id = useId()
  const [draft, setDraft] = useState<CustomTime>(defaultCustomTime)
  const [error, setError] = useState<string | null>(null)
  const update = (key: keyof CustomTime, value: string) => {
    setDraft(current => ({ ...current, [key]: value }))
    setError(null)
  }
  const fields: { key: Exclude<keyof CustomTime, 'system'>; label: string; min?: number; max?: number }[] = [
    { key: 'minutes', label: 'Main · min' },
    { key: 'seconds', label: 'Main · sec', max: 59 },
    ...(draft.system === 'Fischer' ? [{ key: 'increment' as const, label: 'Increment · sec' }] : []),
    ...(draft.system === 'Japanese Byo-yomi' ? [
      { key: 'periods' as const, label: 'Periods', min: 1 },
      { key: 'periodSeconds' as const, label: 'Period · sec', min: 1 },
    ] : []),
  ]
  return (
    <form className="setup-custom" noValidate aria-label="Custom time control" onSubmit={event => {
      event.preventDefault()
      const message = validateCustomTime(draft)
      setError(message)
      if (!message) onApply({ ...draft })
    }}>
      <div className="setup-custom__topline">
        <div><p className="setup-eyebrow">CUSTOM TIME CONTROL</p><h3>Set your own clock</h3></div>
        <label className="setup-field">
          <span>System</span>
          <select value={draft.system} onChange={event => update('system', event.target.value as ClockSystem)}>
            {clockSystems.map(system => <option key={system}>{system}</option>)}
          </select>
        </label>
      </div>
      <div className="setup-fields">
        {fields.map(field => <label className="setup-field" key={field.key}>
          <span>{field.label}</span>
          <input type="number" inputMode="numeric" min={field.min ?? 0} max={field.max} step="1"
            value={draft[field.key]} onChange={event => update(field.key, event.target.value)}
            aria-describedby={error ? `${id}-error` : undefined} />
        </label>)}
      </div>
      {error && <p className="setup-error" id={`${id}-error`} role="alert">{error}</p>}
      <div className="setup-custom__footer">
        <p>{draft.system === 'Japanese Byo-yomi'
          ? 'Overtime uses a fixed number of timed periods.'
          : 'Choose a system, then enter its clock values.'}</p>
        <button className="setup-apply" type="submit">Use custom time<img src={arrow} alt="" /></button>
      </div>
    </form>
  )
}
