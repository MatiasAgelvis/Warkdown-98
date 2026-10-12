<p align="center">
  <img src="favicon/favicon.png" alt="Warkdown 98" width="96" />
</p>

<h1 align="center">Warkdown 98</h1>

<p align="center">
  A retro Windows 98 themed markdown editor, running entirely in your browser.
</p>

---

Drag the editor around, drag the preview around, type markdown on one side and
watch it render on the other. Then export the result as Markdown, HTML, or PDF.
Everything is local: your text never leaves the browser.

## Features

- **Windows 98 look and feel** — 98.css styling, pixelated fonts, and classic
  system icons
- **Draggable windows** — reposition the editor and preview like real desktop
  windows; positions persist between sessions
- **Live preview** — markdown renders as you type, using `react-markdown`
- **Word wrap toggle** — switch the preview between wrapping and scrolling
- **Export** — download your document as Markdown, HTML, or PDF
- **Character count** — live count in the editor's status bar
- **Taskbar** — start menu with a Reset layout action, plus a live clock
- **Mobile mode** — on narrow screens the windows collapse into tabs

## Getting started

```sh
npm install
npm run dev
```

Then open the printed local URL (usually `http://localhost:3000`).

### Other scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the dev server with hot reload |
| `npm run build` | Production build into `dist/` |
| `npm run preview` | Serve the production build locally |

## Deploy

Deploys are handled by GitHub Actions: every push builds the app and publishes
`dist/` to the `gh-pages` branch. See
[`.github/workflows`](.github/workflows) for the workflow.

## Tech stack

| Layer | Choice |
| --- | --- |
| Build | Vite |
| UI | React 17 |
| Styling | SCSS + [98.css](https://github.com/jdan/98.css) |
| State | Recoil |
| Markdown | `react-markdown` |
| Exports | `file-saver` (Markdown/HTML), `jspdf` (PDF) |
| Icons | `react-old-icons` |
| Window dragging | `react-draggable` |

## Project layout

```
src/
├── main.jsx            # App shell, mobile tab view, window layout persistence
├── store.jsx           # Recoil atoms (text, active window, minimized state)
├── layout.js           # Window position math and clamping
├── index.scss          # Theme, taskbar, start menu, status bars
├── _preview.scss       # Markdown typography in the preview pane
├── _modest.scss        # Print styles
└── components/
    ├── editor.jsx      # Editor window
    ├── preview.jsx     # Preview window + exports
    └── taskbar.jsx     # Taskbar, start menu, system clock
```

## Roadmap

See [ROADMAP.md](ROADMAP.md) for planned improvements and [todo.md](todo.md)
for feature ideas.

## License

[AGPL-3.0](LICENSE.txt)
