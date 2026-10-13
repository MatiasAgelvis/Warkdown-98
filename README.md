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
- **Draggable, resizable windows** — reposition and resize the editor and
  preview like real desktop windows; positions persist between sessions
- **Maximize / restore** — fills the desktop above the taskbar, as Win98 did
- **Live preview** — markdown renders as you type, using `react-markdown`
- **GitHub Flavored Markdown** — tables, task lists, and strikethrough via
  `remark-gfm`, in both the preview and the exports
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

Then open the printed local URL (defaults to `http://localhost:5173`).

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
| Build | [Vite](https://vite.dev) 8 |
| UI | React 19 |
| Styling | SCSS + [98.css](https://github.com/jdan/98.css) |
| State | [zustand](https://github.com/pmndrs/zustand) 5 |
| Markdown | `react-markdown` 10 + `remark-gfm` 4 |
| Exports | `file-saver` (Markdown/HTML), `jspdf` 4 (PDF) |
| Icons | `react-old-icons` |
| Window dragging | `react-draggable` |

### Toolchain notes

Everything above is on a current release, with two things worth knowing
before you contribute:

- **`file-saver`** has not been published since 2018. The version in use is
  the latest, and it works, but it is unmaintained. Replacing it is a small
  job: the [`download` attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#download)
  covers the Markdown and HTML exports.
- **`vite.config.js` carries a small PostCSS plugin** that rewrites 98.css's
  `@media (not(hover))` to `@media not (hover)`. The original is valid
  Media Queries Level 4, but Vite 8's CSS minifier (lightningcss) only
  implements Level 3 and fails the build on it. The two forms are
  semantically identical.

## Project layout

```
vite.config.js       # Vite config + the 98.css media-query workaround
src/
├── main.jsx            # App shell, mobile tab view, window layout persistence
├── store.jsx           # zustand store + per-slice hooks
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
