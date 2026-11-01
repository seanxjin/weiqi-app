export const clockSystems = ['Absolute', 'Fischer', 'Japanese Byo-yomi'] as const
export type ClockSystem = typeof clockSystems[number]
export interface TimePreset { label: string; system: ClockSystem }
export interface CustomTime {
  system: ClockSystem
  minutes: string
  seconds: string
  increment: string
  periods: string
  periodSeconds: string
}

export const defaultCustomTime: CustomTime = {
  system: 'Japanese Byo-yomi', minutes: '10', seconds: '00',
  increment: '5', periods: '5', periodSeconds: '30',
}

export const presetGroups: { name: string; presets: TimePreset[] }[] = [
  { name: 'Bullet', presets: [
    { label: '30 sec', system: 'Absolute' },
    { label: '30s + 5s', system: 'Fischer' },
    { label: '30s + 5×10s', system: 'Japanese Byo-yomi' },
    { label: '1 min', system: 'Absolute' },
    { label: '1m + 2s', system: 'Fischer' },
  ] },
  { name: 'Blitz', presets: [
    { label: '3 min', system: 'Absolute' },
    { label: '3m + 5s', system: 'Fischer' },
    { label: '2m + 5×30s', system: 'Japanese Byo-yomi' },
    { label: '5 min', system: 'Absolute' },
    { label: '5m + 5s', system: 'Fischer' },
  ] },
  { name: 'Rapid', presets: [
    { label: '10 min', system: 'Absolute' },
    { label: '10m + 5s', system: 'Fischer' },
    { label: '5m + 5×30s', system: 'Japanese Byo-yomi' },
    { label: '15 min', system: 'Absolute' },
    { label: '15m + 10s', system: 'Fischer' },
  ] },
  { name: 'Classical', presets: [
    { label: '30 min', system: 'Absolute' },
    { label: '30m + 15s', system: 'Fischer' },
    { label: '30m + 5×60s', system: 'Japanese Byo-yomi' },
    { label: '60 min', system: 'Absolute' },
    { label: '60m + 5×60s', system: 'Japanese Byo-yomi' },
  ] },
  { name: 'Correspondence', presets: [1, 3, 5, 7, 14].map(days => ({
    label: `${days} ${days === 1 ? 'day' : 'days'} / move`, system: 'Absolute',
  })) },
]

export function validateCustomTime(value: CustomTime): string | null {
  const fields = [value.minutes, value.seconds,
    ...(value.system === 'Fischer' ? [value.increment] : []),
    ...(value.system === 'Japanese Byo-yomi' ? [value.periods, value.periodSeconds] : []),
  ]
  if (fields.some(field => !/^\d+$/.test(field) || !Number.isSafeInteger(Number(field)))) {
    return 'Enter a nonnegative whole number in each clock field.'
  }
  if (Number(value.seconds) > 59) return 'Main seconds must be between 0 and 59.'
  if (value.system === 'Japanese Byo-yomi' && (Number(value.periods) < 1 || Number(value.periodSeconds) < 1)) {
    return 'Byo-yomi needs at least one period lasting at least one second.'
  }
  const main = Number(value.minutes) * 60 + Number(value.seconds)
  if (main === 0 && value.system !== 'Japanese Byo-yomi') {
    return 'Set main time greater than zero.'
  }
  return null
}
