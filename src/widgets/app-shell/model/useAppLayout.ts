import { useOutletContext } from 'react-router'

export type AppLayoutContext = {
  comingSoon: (label: string) => void
}

export function useAppLayout() {
  return useOutletContext<AppLayoutContext>()
}
