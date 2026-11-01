import { access, copyFile, mkdir } from 'node:fs/promises'

const source = new URL('../../weiqi-ruleset/build/wasm/', import.meta.url)
const destination = new URL('../public/wasm/', import.meta.url)
const files = ['baduk.mjs', 'baduk.wasm']

try {
  await Promise.all(files.map(file => access(new URL(file, source))))
} catch {
  throw new Error('Missing Go engine artifacts. Supply baduk.mjs and baduk.wasm from the same weiqi-ruleset build in weiqi-ruleset/build/wasm/, then rerun the app command.')
}

await mkdir(destination, { recursive: true })
await Promise.all(files.map(file => copyFile(new URL(file, source), new URL(file, destination))))
