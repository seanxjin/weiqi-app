import { useImperativeHandle, useLayoutEffect, useRef } from 'react'
import type { Ref } from 'react'
import { WeiqiBoard } from 'weiqi_board'
import type { BoardApi, BoardConfig } from 'weiqi_board'
import './appearance.css'

export type BoardProps = BoardConfig & { ref?: Ref<BoardApi> }

/** React owns the host; weiqi_board owns everything rendered inside it. */
export function Board({
  boardSize = 19,
  geometry,
  size,
  boardTheme = 'kaya',
  stoneStyle = 'polished',
  stones,
  turnColor,
  lastMove,
  movable,
  premovable,
  readOnly = false,
  onPlace,
  onSelect,
  ref,
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

  useImperativeHandle(ref, () => board.current!, [])

  // Configuration renders must never replay stale authoritative position props.
  useLayoutEffect(() => {
    board.current?.set({
      boardSize,
      geometry,
      size,
      boardTheme,
      stoneStyle,
      movable,
      premovable,
      readOnly,
      onPlace,
      onSelect,
    })
  }, [
    boardSize,
    geometry,
    size,
    boardTheme,
    stoneStyle,
    movable,
    premovable,
    readOnly,
    onPlace,
    onSelect,
  ])

  useLayoutEffect(() => {
    const position: BoardConfig = {}
    if (stones !== undefined) position.stones = stones
    if (turnColor !== undefined) position.turnColor = turnColor
    if (lastMove !== undefined) position.lastMove = lastMove
    if (Object.keys(position).length) board.current?.set(position)
  }, [stones, turnColor, lastMove])

  return <div ref={host} />
}
