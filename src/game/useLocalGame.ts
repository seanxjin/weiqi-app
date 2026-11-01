import { useCallback, useEffect, useState, useSyncExternalStore } from 'react'
import type { BoardSize } from 'weiqi_board'
import { LocalGameController } from './LocalGameController'
import { loadEngine } from './loadEngine'

interface LoadedGame {
  boardSize: BoardSize
  attempt: number
  controller?: LocalGameController
  error?: string
}

const noSubscribe = () => () => {}
const noSnapshot = () => null

export function useLocalGame(boardSize: BoardSize) {
  const [attempt, setAttempt] = useState(0)
  const [loaded, setLoaded] = useState<LoadedGame | null>(null)
  useEffect(() => {
    let active = true
    let controller: LocalGameController | undefined
    loadEngine().then(module => {
      if (!active) return
      controller = new LocalGameController(module, boardSize)
      setLoaded({ boardSize, attempt, controller })
    }).catch(() => {
      if (active) setLoaded({ boardSize, attempt, error: 'The Go engine could not be loaded. Please retry.' })
    })
    return () => {
      active = false
      controller?.dispose()
    }
  }, [boardSize, attempt])

  const current = loaded?.boardSize === boardSize && loaded.attempt === attempt ? loaded : null
  const controller = current?.controller
  const snapshot = useSyncExternalStore(controller?.subscribe ?? noSubscribe, controller?.getSnapshot ?? noSnapshot)
  const retry = useCallback(() => setAttempt(value => value + 1), [])
  return { controller, snapshot, error: current?.error, retry }
}
