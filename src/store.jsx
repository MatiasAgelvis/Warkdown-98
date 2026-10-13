import { create } from "zustand";
import { useShallow } from "zustand/react/shallow";
import {
  WINDOW_IDS,
  WINDOW_LAYOUT_STORAGE_KEY,
  getDefaultWindowLayout,
  sanitizeWindowLayout,
} from "./layout";

const defaultMarkdown = 
`# Warkdown 98

A markdown editor that never stopped believing in floppy disks.

## Why this exists

Most editors ask you to make an account before you can write a
paragraph. This one opens, takes your text, and renders it — no
network call, no sign-in, no cookie banner.

> Everything happens in your browser. Close the tab and nothing
> was uploaded, because nothing ever left.

## What it does

- **Drag the panes** wherever you like — the layout is remembered
  - resize from the bottom-right corner
  - hit *Start -> Reset layout* if you get lost
- **Preview as you type**, with word wrap on demand
- **Export** to Markdown or HTML, or print to paper (or PDF) straight
  from the status bar

## Under the hood

Rendering is handled by \`react-markdown\`, which walks the source and
builds an element tree — no \`dangerouslySetInnerHTML\` in this app:

\`\`\`js
const tree = toHast(parse(source));
render(tree);
\`\`\`

| Feature | Format | Handler |
| ------- | ------ | ------- |
| Source | .md | file-saver |
| Markup | .html | renderToStaticMarkup |
| Paper | print | browser |

## Still to come

- [x] Draggable, persistent windows
- [x] Status bar exports
- [ ] Image upload
- [ ] Find and replace

See the [roadmap](https://github.com/MatiasAgelvis/Warkdown-98) for the rest.
`;

function getInitialWindowLayout() {
  if (typeof window === "undefined") {
    return getDefaultWindowLayout();
  }

  try {
    const raw = window.localStorage.getItem(WINDOW_LAYOUT_STORAGE_KEY);
    if (!raw) {
      return getDefaultWindowLayout();
    }

    return sanitizeWindowLayout(JSON.parse(raw));
  } catch {
    return getDefaultWindowLayout();
  }
}

// Setters accept either a value or an updater function, so call sites can
// use `setText("x")` or `setText((prev) => ...)` interchangeably.
const resolve = (update, current) =>
  typeof update === "function" ? update(current) : update;

export const useAppStore = create((set) => ({
  text: defaultMarkdown,
  activeWindow: WINDOW_IDS.EDITOR,
  windowLayout: getInitialWindowLayout(),
  minimized: { editor: false, preview: false },
  maximized: { editor: false, preview: false },
  activeTab: "editor",

  setText: (update) => set((state) => ({ text: resolve(update, state.text) })),
  setActiveWindow: (activeWindow) => set({ activeWindow }),
  setWindowLayout: (update) =>
    set((state) => ({ windowLayout: resolve(update, state.windowLayout) })),
  setMinimized: (update) =>
    set((state) => ({ minimized: resolve(update, state.minimized) })),
  setMaximized: (update) =>
    set((state) => ({ maximized: resolve(update, state.maximized) })),
  setActiveTab: (activeTab) => set({ activeTab }),
}));

// Per-slice hooks: each returns [value, setter] for destructuring, matching
// the `useState` shape callers expect. `useShallow` keeps the tuple
// referentially stable so zustand doesn't re-render when an unrelated
// slice changes.
export const useText = () =>
  useAppStore(useShallow((s) => [s.text, s.setText]));

export const useActiveWindow = () =>
  useAppStore(useShallow((s) => [s.activeWindow, s.setActiveWindow]));

export const useWindowLayout = () =>
  useAppStore(useShallow((s) => [s.windowLayout, s.setWindowLayout]));

export const useMinimized = () =>
  useAppStore(useShallow((s) => [s.minimized, s.setMinimized]));

export const useMaximized = () =>
  useAppStore(useShallow((s) => [s.maximized, s.setMaximized]));

export const useActiveTab = () =>
  useAppStore(useShallow((s) => [s.activeTab, s.setActiveTab]));

// Write-only hooks for components that don't need to read the value.
export const useSetWindowLayout = () =>
  useAppStore((s) => s.setWindowLayout);

export const useSetMaximized = () =>
  useAppStore((s) => s.setMaximized);
