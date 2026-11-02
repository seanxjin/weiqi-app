import { test, expect } from '@playwright/test'
import type { Page } from '@playwright/test'
import type {} from './fixture'

async function clickPoint(
  page: Page,
  column: number,
  row: number,
  button: 'left' | 'right' = 'left',
) {
  const point = await page.evaluate(
    ({ column, row }) => {
      const surface = document.querySelector('.weiqi-board__surface')!
      const rect = surface.getBoundingClientRect()
      const { geometry } = window.harness.board.getState()
      return {
        x: rect.left + ((geometry.inset + column * geometry.spacing) / geometry.size) * rect.width,
        y: rect.top + ((geometry.inset + row * geometry.spacing) / geometry.size) * rect.height,
      }
    },
    { column, row },
  )
  await page.mouse.click(point.x, point.y, { button })
}

const state = (page: Page) => page.evaluate(() => window.harness.board.getState())
const stones = (page: Page) => page.locator('#primary .weiqi-board__stones img')

test.beforeEach(async ({ page }) => {
  await page.goto('/tests/interactive-board.html')
  await page.waitForFunction(() => window.harness?.ready)
})

test('commits state and DOM before controller verification; unchanged accepted moves need no correction', async ({
  page,
}) => {
  await page.evaluate(() => window.harness.mount({ boardSize: 9 }, true))
  await clickPoint(page, 4, 4)
  const events = await page.evaluate(() => window.harness.events)
  expect(events.map((event) => event.type)).toEqual(['place', 'verify', 'verified'])
  expect(events[0]).toMatchObject({
    color: 'black',
    metadata: { premove: false },
    domCount: 1,
    markerVisible: true,
    state: {
      stones: [{ column: 4, row: 4, color: 'black' }],
      lastMove: { column: 4, row: 4 },
      turnColor: 'white',
    },
  })
  expect(events[2].sets).toBe(0)
  expect(events[2].state?.stones).toEqual(events[0].state?.stones)
  await clickPoint(page, 4, 4)
  expect((await page.evaluate(() => window.harness.events)).length).toBe(3)
})

test('enforces destinations, turn, color, read-only and occupancy even in free mode', async ({
  page,
}) => {
  await page.evaluate(() =>
    window.harness.board.set({
      movable: {
        color: 'black',
        free: false,
        dests: new Map([['black', [{ column: 2, row: 2 }]]]),
      },
      premovable: { enabled: false },
    }),
  )
  await clickPoint(page, 1, 1)
  await expect(stones(page)).toHaveCount(0)
  await clickPoint(page, 2, 2)
  await expect(stones(page)).toHaveCount(1)
  await clickPoint(page, 3, 3)
  await expect(stones(page)).toHaveCount(1)
  await page.evaluate(() => window.harness.board.set({ movable: { color: 'both', free: false } }))
  await clickPoint(page, 3, 3)
  await expect(stones(page)).toHaveCount(1)
  await page.evaluate(() => window.harness.board.set({ movable: { free: true } }))
  await clickPoint(page, 3, 3)
  await expect(stones(page)).toHaveCount(2)
  await page.evaluate(() => window.harness.board.set({ movable: { color: undefined } }))
  await clickPoint(page, 4, 4)
  await expect(stones(page)).toHaveCount(2)
  await page.evaluate(() =>
    window.harness.board.set({ movable: { color: 'both' }, readOnly: true }),
  )
  await clickPoint(page, 4, 4)
  await expect(stones(page)).toHaveCount(2)
  await page.evaluate(() => window.harness.board.set({ readOnly: false }))
  await clickPoint(page, 2, 2)
  await expect(stones(page)).toHaveCount(2)
})

test('clones snapshots, replaces destination maps, preserves omitted fields and validates atomically', async ({
  page,
}) => {
  const result = await page.evaluate(() => {
    const board = window.harness.board
    const input = new Map([['black' as const, [{ column: 1, row: 1 }]]])
    board.set({ movable: { color: 'black', free: false, dests: input } })
    input.get('black')!.push({ column: 2, row: 2 })
    const snapshot = board.getState()
    const inputCloned = snapshot.movable.dests?.get('black')?.length === 1
    ;(snapshot.movable.dests as Map<string, unknown>).clear()
    const snapshotCloned = board.getState().movable.dests?.has('black')
    board.set({ movable: { dests: new Map([['white', [{ column: 3, row: 3 }]]]) } })
    const replaced = board.getState()
    let rejected = false
    try {
      board.set({ stones: [{ column: 99, row: 0, color: 'black' }] })
    } catch {
      rejected = true
    }
    return {
      rejected,
      inputCloned,
      snapshotCloned,
      color: replaced.movable.color,
      free: replaced.movable.free,
      black: replaced.movable.dests?.has('black'),
      white: replaced.movable.dests?.get('white'),
      count: board.getState().stones.length,
    }
  })
  expect(result).toEqual({
    rejected: true,
    inputCloned: true,
    snapshotCloned: true,
    color: 'black',
    free: false,
    black: false,
    white: [{ column: 3, row: 3 }],
    count: 0,
  })
})

test('queues, replaces, toggles and cancels exactly one future placement without playing', async ({
  page,
}) => {
  await page.evaluate(() =>
    window.harness.board.set({ turnColor: 'white', movable: { color: 'black', free: false } }),
  )
  await clickPoint(page, 1, 1)
  expect((await state(page)).premovable.current).toEqual({
    point: { column: 1, row: 1 },
    color: 'black',
  })
  await expect(page.locator('.weiqi-board__premove')).toBeVisible()
  await expect(stones(page)).toHaveCount(0)
  await clickPoint(page, 2, 2)
  await clickPoint(page, 2, 2)
  expect((await state(page)).premovable.current).toBeNull()
  await expect(page.locator('.weiqi-board__premove')).toBeHidden()
  expect((await state(page)).turnColor).toBe('white')
  expect((await state(page)).lastMove).toBeNull()
  expect(await page.evaluate(() => window.harness.events.map((event) => event.type))).toEqual([
    'queue',
    'unqueue',
    'queue',
    'unqueue',
  ])
  await clickPoint(page, 3, 3)
  await page.evaluate(() => {
    window.harness.board.cancelPremove()
    window.harness.board.cancelPremove()
  })
  expect(
    await page.evaluate(
      () => window.harness.events.filter((event) => event.type === 'unqueue').length,
    ),
  ).toBe(3)
})

test('only explicit playPremove executes against refreshed destinations and commits before its event', async ({
  page,
}) => {
  await page.evaluate(() =>
    window.harness.board.set({ turnColor: 'white', movable: { color: 'black', free: false } }),
  )
  await clickPoint(page, 2, 2)
  await page.evaluate(() =>
    window.harness.board.set({
      stones: [{ column: 0, row: 0, color: 'white' }],
      turnColor: 'black',
      lastMove: { column: 0, row: 0 },
      movable: { dests: new Map([['black', [{ column: 2, row: 2 }]]]) },
    }),
  )
  await expect(stones(page)).toHaveCount(1)
  expect((await state(page)).premovable.current).not.toBeNull()
  expect(await page.evaluate(() => window.harness.board.playPremove())).toBe(true)
  const events = await page.evaluate(() => window.harness.events)
  const placed = events.find((event) => event.type === 'place')!
  expect(placed).toMatchObject({
    metadata: { premove: true },
    color: 'black',
    domCount: 2,
    state: { turnColor: 'white', lastMove: { column: 2, row: 2 }, premovable: { current: null } },
  })
  expect(events.filter((event) => event.type === 'unqueue')).toHaveLength(1)
  expect(await page.evaluate(() => window.harness.board.playPremove())).toBe(false)
})

test('clicking a queued point cancels even after a host turn or occupancy update', async ({
  page,
}) => {
  for (const occupied of [false, true]) {
    await page.evaluate(() =>
      window.harness.mount({ turnColor: 'white', movable: { color: 'black' } }),
    )
    await clickPoint(page, 2, 2)
    await page.evaluate(
      (occupied) =>
        window.harness.board.set({
          turnColor: 'black',
          stones: occupied ? [{ column: 2, row: 2, color: 'white' }] : [],
        }),
      occupied,
    )
    await clickPoint(page, 2, 2)
    expect((await state(page)).premovable.current).toBeNull()
    expect((await state(page)).turnColor).toBe('black')
    expect(await page.evaluate(() => window.harness.events.map((event) => event.type))).toEqual([
      'queue',
      'unqueue',
    ])
  }
})

test('failed premoves are consumed for wrong turn, new occupancy or disallowed destination', async ({
  page,
}) => {
  for (const failure of ['turn', 'occupied', 'destination']) {
    await page.evaluate(() =>
      window.harness.mount({ turnColor: 'white', movable: { color: 'black', free: false } }),
    )
    await clickPoint(page, 2, 2)
    await page.evaluate((failure) => {
      if (failure !== 'turn') window.harness.board.set({ turnColor: 'black' })
      if (failure === 'occupied')
        window.harness.board.set({ stones: [{ column: 2, row: 2, color: 'white' }] })
      return undefined
    }, failure)
    expect(await page.evaluate(() => window.harness.board.playPremove())).toBe(false)
    expect((await state(page)).premovable.current).toBeNull()
    expect(await page.evaluate(() => window.harness.events.map((event) => event.type))).toEqual([
      'queue',
      'unqueue',
    ])
  }
})

test('permissions, board size, read-only and destruction clear the queue once', async ({
  page,
}) => {
  for (const change of ['disabled', 'readOnly', 'color', 'size', 'destroy']) {
    await page.evaluate(() =>
      window.harness.mount({ turnColor: 'white', movable: { color: 'black' } }),
    )
    await clickPoint(page, 2, 2)
    await page.evaluate((change) => {
      const board = window.harness.board
      if (change === 'disabled') board.set({ premovable: { enabled: false } })
      if (change === 'readOnly') board.set({ readOnly: true })
      if (change === 'color') board.set({ movable: { color: undefined } })
      if (change === 'size') board.set({ boardSize: 9 })
      if (change === 'destroy') {
        board.destroy()
        board.destroy()
      }
    }, change)
    expect((await state(page)).premovable.current).toBeNull()
    expect(await page.evaluate(() => window.harness.events.map((event) => event.type))).toEqual([
      'queue',
      'unqueue',
    ])
    expect(await page.evaluate(() => window.harness.board.playPremove())).toBe(false)
  }
})

test('rejects keyboard, touch, pen, non-primary pointers and secondary mouse placement', async ({
  page,
}) => {
  for (const key of ['ArrowRight', 'ArrowDown', 'Enter', 'Space']) await page.keyboard.press(key)
  await clickPoint(page, 2, 2, 'right')
  await page.evaluate(() => {
    const surface = document.querySelector('.weiqi-board__surface')!
    const rect = surface.getBoundingClientRect()
    for (const [pointerType, isPrimary] of [
      ['touch', true],
      ['pen', true],
      ['mouse', false],
    ] as const) {
      for (const type of ['pointermove', 'pointerdown', 'pointerup'])
        surface.dispatchEvent(
          new PointerEvent(type, {
            pointerType,
            isPrimary,
            button: 0,
            clientX: rect.left + rect.width / 2,
            clientY: rect.top + rect.height / 2,
            bubbles: true,
          }),
        )
      surface.dispatchEvent(new MouseEvent('click', { button: 0, bubbles: true }))
    }
  })
  await expect(stones(page)).toHaveCount(0)
  expect(await page.locator('.weiqi-board__surface').getAttribute('tabindex')).toBeNull()
  await expect(page.locator('.weiqi-board__instructions')).not.toContainText(
    /arrow|Enter|Space|tap/,
  )
  await clickPoint(page, 2, 2)
  await expect(stones(page)).toHaveCount(1)
})

test('placements and hover reuse stone nodes and cached images without repainting the board', async ({
  page,
}) => {
  await clickPoint(page, 1, 1)
  const first = await stones(page).first().elementHandle()
  await page.evaluate(() => {
    const node = document.querySelector('.weiqi-board__stones img')!
    node.setAttribute('data-sentinel', 'unchanged')
  })
  const before = await page.evaluate(() => ({ ...window.harness.metrics }))
  const source = await first!.getAttribute('src')
  await clickPoint(page, 2, 2)
  await expect(stones(page)).toHaveCount(2)
  expect(await first!.evaluate((node) => node.isConnected)).toBe(true)
  expect(await first!.getAttribute('src')).toBe(source)
  expect(await first!.getAttribute('data-sentinel')).toBe('unchanged')
  const after = await page.evaluate(() => ({ ...window.harness.metrics }))
  expect(after.boardPaints).toBe(before.boardPaints)
  expect(after.spriteBuilds).toBe(before.spriteBuilds)
  await expect(page.locator('#primary canvas')).toHaveCount(1)
})

test('ruleset captures reconcile only removed stones and preserve surviving nodes', async ({
  page,
}) => {
  await page.evaluate(() => window.harness.mount({ boardSize: 9 }, true))
  for (const [column, row] of [
    [1, 0],
    [0, 0],
    [1, 1],
    [0, 1],
    [8, 8],
    [8, 7],
  ])
    await clickPoint(page, column, row)
  const survivor = await page.locator('[data-key="1,0"]').elementHandle()
  const before = await page.evaluate(() => ({ ...window.harness.metrics }))
  await clickPoint(page, 0, 2)
  const events = await page.evaluate(() => window.harness.events.slice(-3))
  expect(events[0].domCount).toBe(7)
  expect(events[2].sets).toBe(1)
  await expect(stones(page)).toHaveCount(5)
  expect(await survivor!.evaluate((node) => node.isConnected)).toBe(true)
  await expect(page.locator('[data-key="0,0"]')).toHaveCount(0)
  await expect(page.locator('[data-key="0,1"]')).toHaveCount(0)
  const after = await page.evaluate(() => ({ ...window.harness.metrics }))
  expect(after.boardPaints).toBe(before.boardPaints)
  expect(after.spriteBuilds).toBe(before.spriteBuilds)
})

test('suicide rejection restores stones, turn and last move, including repeated rejection', async ({
  page,
}) => {
  await page.evaluate(() => window.harness.mount({ boardSize: 9 }, true))
  for (const [column, row] of [
    [8, 8],
    [1, 0],
    [8, 7],
    [0, 1],
  ])
    await clickPoint(page, column, row)
  for (let attempt = 0; attempt < 2; attempt++) {
    await clickPoint(page, 0, 0)
    const events = await page.evaluate(() => window.harness.events.slice(-3))
    expect(events[0]).toMatchObject({
      domCount: 5,
      color: 'black',
      state: { turnColor: 'white', lastMove: { column: 0, row: 0 } },
    })
    expect(events[2]).toMatchObject({
      sets: 1,
      state: { turnColor: 'black', lastMove: { column: 0, row: 1 } },
    })
    await expect(stones(page)).toHaveCount(4)
    expect(await page.evaluate(() => window.harness.controller!.getSnapshot().error)).toContain(
      'Suicide',
    )
  }
})

test('resizing and density changes refresh material resolution while retaining nodes', async ({
  page,
}) => {
  await clickPoint(page, 3, 3)
  const first = await stones(page).first().elementHandle()
  const before = await first!.getAttribute('src')
  await page.evaluate(() => {
    document.querySelector<HTMLElement>('#primary')!.style.width = '320px'
  })
  await expect.poll(() => first!.getAttribute('src')).not.toBe(before)
  expect(await first!.evaluate((node) => node.isConnected)).toBe(true)
  const actual = await first!.evaluate((node) => {
    const rect = node.getBoundingClientRect()
    const surface = node.closest('.weiqi-board__surface')!.getBoundingClientRect()
    return {
      x: rect.left + rect.width / 2 - surface.left,
      y: rect.top + (rect.height * 82) / 176 - surface.top,
    }
  })
  expect(actual.x).toBeCloseTo(((58 + 3 * 38) / 800) * 320, 0)
  expect(actual.y).toBeCloseTo(((58 + 3 * 38) / 800) * 320, 0)
  const resized = await first!.getAttribute('src')
  await page.evaluate(() => {
    Object.defineProperty(window, 'devicePixelRatio', { value: 3, configurable: true })
    window.dispatchEvent(new Event('resize'))
  })
  await expect.poll(() => first!.getAttribute('src')).not.toBe(resized)
  expect(
    await page.locator('#primary canvas').evaluate((node: HTMLCanvasElement) => node.width),
  ).toBe(960)
})

test('all board sizes, materials and finishes preserve positions and correctly sized images', async ({
  page,
}) => {
  for (const boardSize of [9, 13, 19] as const) {
    await page.evaluate((boardSize) => window.harness.mount({ boardSize }), boardSize)
    await clickPoint(page, boardSize - 1, boardSize - 1)
    for (const stoneStyle of ['polished', 'satin', 'matte', 'snow'] as const) {
      await page.evaluate((stoneStyle) => window.harness.board.set({ stoneStyle }), stoneStyle)
      const source = await stones(page).first().getAttribute('src')
      for (const boardTheme of ['kaya', 'walnut', 'ash'] as const) {
        await page.evaluate((boardTheme) => window.harness.board.set({ boardTheme }), boardTheme)
        await expect(stones(page)).toHaveCount(1)
        expect(await stones(page).first().getAttribute('src')).toBe(source)
        expect((await state(page)).lastMove).toEqual({ column: boardSize - 1, row: boardSize - 1 })
      }
    }
  }
})

test('React Strict Mode exposes the current API and appearance rerenders do not restore stale positions', async ({
  page,
}) => {
  await page.evaluate(() =>
    window.harness.renderReact({ stones: [], turnColor: 'black', boardTheme: 'kaya' }),
  )
  await clickPoint(page, 3, 3)
  await expect(stones(page)).toHaveCount(1)
  await page.evaluate(() => {
    // Use the same authoritative input references, like an unrelated parent rerender.
    window.harness.renderReact({ ...window.harness.reactConfig, boardTheme: 'ash' })
  })
  await expect(stones(page)).toHaveCount(1)
  expect((await state(page)).turnColor).toBe('white')
  await page.evaluate(() =>
    window.harness.renderReact({ stones: [], turnColor: 'black', lastMove: null }),
  )
  await expect(stones(page)).toHaveCount(0)
  await expect(page.locator('.weiqi-board')).toHaveCount(1)
  await page.evaluate(() => window.harness.mount())
  await expect(page.locator('.weiqi-board')).toHaveCount(1)
})

test('controller verifies the notified color rather than silently substituting its own turn', async ({
  page,
}) => {
  await page.evaluate(() => window.harness.mount({ boardSize: 9, turnColor: 'white' }, true))
  await clickPoint(page, 4, 4)
  await expect(stones(page)).toHaveCount(0)
  expect((await state(page)).turnColor).toBe('black')
  expect((await state(page)).lastMove).toBeNull()
  expect(await page.evaluate(() => window.harness.controller!.getSnapshot().error)).toContain(
    'other player',
  )
})

test('ko rejection rolls back the attempted recapture', async ({ page }) => {
  await page.evaluate(() => window.harness.mount({ boardSize: 9 }, true))
  for (const [column, row] of [
    [0, 1],
    [1, 1],
    [1, 0],
    [0, 2],
    [2, 1],
    [2, 2],
    [8, 8],
    [1, 3],
    [1, 2],
  ])
    await clickPoint(page, column, row)
  await expect(stones(page)).toHaveCount(8)
  await clickPoint(page, 1, 1)
  await expect(stones(page)).toHaveCount(8)
  expect((await state(page)).turnColor).toBe('white')
  expect((await state(page)).lastMove).toEqual({ column: 1, row: 2 })
  expect(await page.evaluate(() => window.harness.controller!.getSnapshot().error)).toContain('ko')
})

test('multiple instances and destroyed observers stay independent', async ({ page }) => {
  const result = await page.evaluate(() => {
    const host = document.createElement('div')
    host.style.width = '200px'
    document.body.append(host)
    const other = window.harness.create(host, {
      boardSize: 9,
      boardTheme: 'ash',
      readOnly: true,
      stones: [{ column: 1, row: 1, color: 'white' }],
    })
    window.harness.board.destroy()
    window.harness.board.set({ stones: [{ column: 2, row: 2, color: 'black' }] })
    window.harness.board.redraw()
    window.dispatchEvent(new Event('resize'))
    const snapshot = other.getState()
    const count = host.querySelectorAll('.weiqi-board__stones img').length
    other.destroy()
    const cleaned = host.childElementCount === 0
    host.remove()
    return { count, cleaned, size: snapshot.boardSize, color: snapshot.stones[0].color }
  })
  expect(result).toEqual({ count: 1, cleaned: true, size: 9, color: 'white' })
})

test('real app stays synchronized through rejection, pass, undo and history review', async ({
  page,
}) => {
  await page.goto('/play/local?size=9')
  await expect(page.getByRole('button', { name: 'Pass', exact: true })).toBeEnabled()
  async function play(column: number, row: number) {
    const point = await page.locator('.weiqi-board__surface').evaluate(
      (surface, { column, row }) => {
        const rect = surface.getBoundingClientRect()
        return {
          x: rect.left + ((48 + column * 81) / 744) * rect.width,
          y: rect.top + ((48 + row * 81) / 744) * rect.height,
        }
      },
      { column, row },
    )
    await page.mouse.click(point.x, point.y)
  }
  const placed = page.locator('.weiqi-board__stones img')
  for (const [column, row] of [
    [8, 8],
    [1, 0],
    [8, 7],
    [0, 1],
  ])
    await play(column, row)
  await play(0, 0)
  await expect(page.getByRole('alert')).toContainText('Suicide')
  await expect(placed).toHaveCount(4)
  await page.getByRole('button', { name: 'Pass', exact: true }).click()
  await expect(page.locator('.weiqi-board__last-move')).toBeHidden()
  await expect(page.locator('.local-game__last-move')).toContainText('Black Pass')
  await page.getByRole('button', { name: 'Undo last move' }).click()
  await expect(page.locator('.weiqi-board__last-move')).toBeVisible()
  await page.getByRole('button', { name: 'Start', exact: true }).click()
  await expect(placed).toHaveCount(0)
  await expect(page.getByRole('button', { name: 'Pass', exact: true })).toBeDisabled()
  await play(4, 4)
  await expect(placed).toHaveCount(0)
  await page.getByRole('button', { name: 'Current', exact: true }).click()
  await expect(placed).toHaveCount(4)
  await play(4, 4)
  await expect(placed).toHaveCount(5)
  await page.getByRole('button', { name: 'Undo last move' }).click()
  await expect(placed).toHaveCount(4)
})
