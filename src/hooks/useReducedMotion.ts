import { useCallback, useMemo, useSyncExternalStore } from 'react'

/** Reactively follows the OS preference, including changes while a scene is open. */
export function useReducedMotion() {
  const query = useMemo(() => window.matchMedia('(prefers-reduced-motion: reduce)'), [])
  const subscribe = useCallback((onChange: () => void) => {
    query.addEventListener('change', onChange)
    return () => query.removeEventListener('change', onChange)
  }, [query])
  const getSnapshot = useCallback(() => query.matches, [query])
  return useSyncExternalStore(subscribe, getSnapshot)
}
