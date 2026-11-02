import { createServer } from 'vite'

// Own Vite in this process so teardown closes its listeners and watchers on Windows too.
export default async function setup() {
  const server = await createServer({ server: { host: '127.0.0.1', port: 4175, strictPort: true } })
  await server.listen()
  return async () => {
    await server.close()
  }
}
