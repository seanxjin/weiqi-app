# Baduk

React + TypeScript + Vite, with plain CSS and Canvas 2D. The welcome page at `/` introduces the game with an animated opening and sakura branches. Play opens the Go Home menu at `/play`; Play local opens the interactive board at `/play/local`. The original material library lives at `/materials`, displaying three empty 19×19 boards and four black/white stone pairs.

## Development

```sh
npm install
npm run dev
npm run build
npm run lint
```

## Reusable components

```tsx
import { BoardCanvas } from './components/BoardCanvas'
import { StoneCanvas } from './components/StoneCanvas'

<BoardCanvas theme="kaya" />
<BoardCanvas theme="walnut" size={480} label="Walnut board preview" />
<StoneCanvas style="polished" color="white" size={37} />
<StoneCanvas style="snow" color="white" size={138} />
```

- Board themes: `kaya`, `walnut`, `ash`. `size` is the optional CSS width; without it the board fills its container.
- Stone styles: `polished` (Slate), `satin` (Ceramic), `matte` (Natural stone), `snow` (Clamshell · Yuki / Snow Grade). Colors: `black`, `white`. `size` is the stone diameter, defaulting to 138px. Its transparent Canvas includes additional space for shadows and shrinks to fit its container.
- Both components accept an accessible `label` and redraw on appearance, layout, texture, and pixel-density changes. Their shared Canvas surface handles bitmap scaling and observer cleanup.
- The components use the Canvas sizing rules in `src/index.css` and shared presentation rules in `src/index.css`; material-library styles are scoped in `src/pages/material-library/MaterialLibraryPage.css`.

## Drawing into a game scene

The rendering functions are independent of React and do not clear the destination Canvas. Import the renderers, appearance registries, and public types from `src/lib/baduk`.

```ts
import { drawBoard, drawStone, boardThemes } from './lib/baduk'
import { loadTexture } from './lib/baduk/textures'

const texture = await loadTexture(boardThemes.kaya.texture)
drawBoard(ctx, { theme: 'kaya', size: 800, texture, x: 0, y: 0 })
drawStone(ctx, { style: 'polished', color: 'black', x: 172, y: 172, radius: 18.3 })
```

`drawBoard` scales the original 800-unit geometry to `size`. Intersections start at 58, end at 742, and use 38-unit spacing. Star points are at zero-based grid indices 3, 9, and 15. The texture argument is optional for callers managing their own loading; `BoardCanvas` loads and caches it automatically and reports load failures.

`drawStone` uses center coordinates and a radius excluding the cast shadow. Leave extra room around stones when making thumbnails. Both renderers save and restore the drawing context. When composing directly, the caller owns Canvas sizing, pixel-density transforms, and clearing between frames.

The original timber textures come from the supplied [Baduk Figma design](https://www.figma.com/design/YaV7YvRRuqgdu8vjDIgBeL/Baduk-Design?node-id=0-1) and are bundled locally. Stone details are procedural interpretations of the approved material study; no temporary Figma URLs or additional icon/rendering packages are used.

The `polished` ID remains compatible with existing callers, but now displays Slate: a smooth white stone with subtle mineral grain and the original black slate. Shell striations belong exclusively to `snow`. Its white stone uses milky shading and fine, closely spaced, mostly straight growth lines, following [Kuroki's Snow Grade reference](https://www.kurokigoishi.co.jp/english/2016/02/03/new-products/) and [Ohishi-Tengudo's Yukijirushi description](https://go.tengudo.jp/en/knowledge-s). The black companion shares the polished slate rendering. Shell grain is deterministic and loses contrast at playing size to reduce aliasing. Reference photographs are not runtime textures.

## Browser verification

With the dev server running, open `/tests/canvas.html`. This standalone fixture checks the 1440, 1100, 768, 700, and 375px layouts, resizing, bitmap density (including simulated DPR 2), accessible labels, texture loading, grid geometry, deterministic stones, and transparency. It also checks that shell grain is exclusive to white Yuki stones and displays all eight stones at 37px diameter with desktop/mobile previews for visual review. It is not an entry point in the production build.


## Welcome screen

`src/pages/` owns the welcome, Go Home, Local Play, and material-library pages and their document titles. `main.tsx` wraps `App` in React Router's `BrowserRouter`; `App` declares `/`, `/play`, `/play/local`, `/materials`, and a welcome-page fallback for unknown paths. Internal navigation uses `Link` to update the URL without reloading the document. A production host must serve `index.html` for all application routes and unknown paths.

Go Home matches Figma frame `46:381`, with local SVG assets in `src/assets/go-home/` and the shared `StoneMark` logo. Unavailable menu, learning, account, and settings actions announce a temporary coming-soon message. Local Play reuses `InteractiveBoard` with its default kaya board and polished stones; each visit starts a fresh board. `/tests/routing.html` also checks this navigation flow, coming-soon feedback, local keyboard placement, and fresh-board behavior. `/tests/interactive-board.html` checks the board component directly.

With the dev server running, `/tests/routing.html` checks route titles, internal links without document reloads, browser Back/Forward, animation restart after returning from the material library, trailing slashes, URL search/hash values, and the unknown-path fallback.

- `AnimatedBoardScene` composes the shared board and stone canvases. Its typed move tracks use zero-based grid coordinates and normalized animation times. The 22-move opening in `pages/welcome/welcomeScene.ts` preserves the Figma frame `26:936` tracks on an 18-second loop.
- `BoardCanvas` and `drawBoard` accept an optional `geometry`. `welcomeBoardGeometry` uses a 610-unit square, 35-unit inset, and 30-unit spacing. Existing callers keep the original 800-unit geometry and appearance.
- `welcomeAppearance` sets the shared `boardTheme` and `stoneStyle`. The board, identity mark, navigation mark, and caption use the existing local ash texture and polished stone renderer. No temporary Figma URLs are used at runtime.
- `SakuraBranches` accepts `paused`. Connected SVG paths grow from shared joints, blossoms open at twig tips, and three bounded petals fall from blossom positions. The geometry and timing live in `components/sakura/branches.ts`.
- Pause/resume holds both the board and decorative animation. The welcome board always starts empty and plays from move one, including when the browser requests reduced motion. Per the requested animation behavior, branches always grow, blossoms open, and petals fall exactly as in the full-motion preview, including when the browser requests reduced motion. Pause remains available in either mode. Both scenes restart on reload and browser-history restoration.
- Inter is bundled locally for the welcome page with its SIL Open Font License in `public/licenses/Inter-OFL.txt`. The material library retains its existing font stack.

With the dev server running, `/tests/welcome.html` exercises a complete loop, ordering, restart, pause/resume, Strict Mode cleanup, five responsive widths, canvas density, texture loading, and live reduced-motion changes. `/tests/welcome-preview.html?motion=full` and `?motion=reduce` are isolated visual fixtures; their media emulation is test-only and is not included in the production build. The canvas regression fixture now loads `/materials`.


The welcome hero stays horizontal from 800px upward, with fluid side gutters and a board that expands with the viewport while fitting the available height. The board scene is displayed at 75% of that available size to leave clearance around the branches. Below 800px the hero stacks. Navigation stones use larger bodies and a small local shadow to separate the white stone from the ivory background.

`/tests/welcome-feedback.html` covers the 927px horizontal layout, larger navigation marks, branch entrances in both motion modes, reload/history restoration, and expansion at 1440px and 2560px.
