import { useId, useRef, useState } from 'react'
import { CustomTimeForm } from './CustomTimeForm'
import { presetGroups } from './timeControls'
import type { CustomTime, TimePreset } from './timeControls'

export function TimeControlSelector() {
  const id = useId()
  const trigger = useRef<HTMLButtonElement>(null)
  const [open, setOpen] = useState(false)
  const [customOpen, setCustomOpen] = useState(false)
  const [preset, setPreset] = useState<TimePreset>({ label: '10 min', system: 'Absolute' })
  const [custom, setCustom] = useState<CustomTime | null>(null)
  const close = () => { setOpen(false); trigger.current?.focus() }

  return (
    <div className="setup-selector" onKeyDown={event => {
      if (event.key === 'Escape' && open) { event.preventDefault(); event.stopPropagation(); close() }
    }}>
      <button ref={trigger} className="setup-selector__trigger" type="button"
        aria-expanded={open} aria-controls={`${id}-options`} onClick={() => setOpen(value => !value)}>
        <span><span className="setup-eyebrow">TIME CONTROL</span>
          <span className="setup-selector__value">{custom ? `Custom · ${custom.system}` : `${preset.system} · ${preset.label}`}</span>
        </span>
        <span className="setup-chevron" aria-hidden="true">{open ? '↑' : '↓'}</span>
      </button>
      <div className="setup-options" id={`${id}-options`} hidden={!open}>
        {presetGroups.map(group => <section className="setup-speed" key={group.name} aria-label={group.name}>
          <h2 className="setup-speed__heading">{group.name}</h2>
          <div className="setup-presets">
            {group.presets.map(option => <button key={option.label} type="button" className="setup-preset"
              aria-pressed={!custom && preset.label === option.label}
              aria-label={`${option.label}, ${option.system}`} onClick={() => {
                setPreset(option); setCustom(null); close()
              }}>{option.label}</button>)}
          </div>
        </section>)}
        <button className="setup-more" type="button" aria-expanded={customOpen}
          aria-controls={`${id}-custom`} onClick={() => setCustomOpen(value => !value)}>
          <span>{customOpen ? 'Fewer Time Controls' : 'More Time Controls'}</span>
          <span aria-hidden="true">{customOpen ? '−' : '+'}</span>
        </button>
        <div id={`${id}-custom`} hidden={!customOpen}>
          <CustomTimeForm onApply={value => { setCustom(value); setCustomOpen(false); close() }} />
        </div>
      </div>
    </div>
  )
}
