import { defineConfig } from "@playwright/test";

export default defineConfig({
	testDir: "./tests",
	fullyParallel: true,
	workers: 2,
	reporter: "list",
	globalSetup: "./tests/board/server.ts",
	use: {
		baseURL: "http://127.0.0.1:4175",
		channel: "chrome",
		trace: "retain-on-failure",
	},
	projects: [
		// Pure logic tests; they need no browser.
		{ name: "online", testDir: "./tests/online" },
		{
			name: "desktop",
			testDir: "./tests/board",
			use: { viewport: { width: 1280, height: 1000 }, deviceScaleFactor: 1 },
		},
		{ name: "retina", testDir: "./tests/board", use: { viewport: { width: 640, height: 1000 }, deviceScaleFactor: 2 } },
	],
});
