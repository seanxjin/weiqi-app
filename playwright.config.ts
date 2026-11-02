import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './tests/board',
  fullyParallel: true,
  workers: 2,
  reporter: 'list',
  globalSetup: './tests/board/server.ts',
  use: {
    baseURL: 'http://127.0.0.1:4175',
    channel: 'chrome',
    trace: 'retain-on-failure',
  },
  projects: [
    { name: 'desktop', use: { viewport: { width: 1280, height: 1000 }, deviceScaleFactor: 1 } },
    { name: 'retina', use: { viewport: { width: 640, height: 1000 }, deviceScaleFactor: 2 } },
  ],
})
