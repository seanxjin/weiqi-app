import { useLayoutEffect, useRef } from 'react'
import { WeiqiBoard } from 'weiqi_board'
import type { BoardApi, BoardConfig, Stone } from 'weiqi_board'
import './appearance.css'

export type BoardProps = BoardConfig

const emptyStones: readonly Stone[] = []

/** React owns the host; weiqi_board owns everything rendered inside it. */
export function Board({
  boardSize = 19, geometry, size, boardTheme = 'kaya', stoneStyle = 'polished',
  stones = emptyStones, turnColor = 'black', allowedIntersections, readOnly = false,
  onPlace, onSelect,
}: BoardProps) {
  const host = useRef<HTMLDivElement>(null)
  const board = useRef<BoardApi | null>(null)

  useLayoutEffect(() => {
    const instance = WeiqiBoard(host.current!)
    board.current = instance
    return () => {
      instance.destroy()
      board.current = null
    }
  }, [])

  useLayoutEffect(() => {
    board.current?.set({
      boardSize, geometry, size, boardTheme, stoneStyle, stones, turnColor,
      allowedIntersections, readOnly, onPlace, onSelect,
    })
  }, [boardSize, geometry, size, boardTheme, stoneStyle, stones, turnColor, allowedIntersections, readOnly, onPlace, onSelect])

  return <div ref={host} />
}
