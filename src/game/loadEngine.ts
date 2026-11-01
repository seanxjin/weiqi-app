import type { EngineFactory, EngineModule } from './bindings'

let pending: Promise<EngineModule> | undefined
let attempt = 0

export function loadEngine(): Promise<EngineModule> {
  if (!pending) {
    const assets = new URL(`${import.meta.env.BASE_URL}wasm/`, document.baseURI)
    const loader = new URL('baduk.mjs', assets)
    if (attempt > 0) loader.searchParams.set('retry', String(attempt))
    pending = (async () => {
      const { default: createModule } = await import(/* @vite-ignore */ loader.href) as { default: EngineFactory }
      return createModule({
        locateFile: (path, prefix) => path.endsWith('.wasm')
          ? new URL('baduk.wasm', assets).href
          : prefix + path,
      })
    })().catch(error => {
      pending = undefined
      attempt += 1
      throw error
    })
  }
  return pending
}
