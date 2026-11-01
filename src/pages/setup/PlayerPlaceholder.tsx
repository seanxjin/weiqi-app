export function PlayerPlaceholder({ name }: { name: string }) {
  return (
    <div className="setup-player">
      <span className="setup-player__avatar" aria-hidden="true" />
      <span>{name}</span>
    </div>
  )
}
