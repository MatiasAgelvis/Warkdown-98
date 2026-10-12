import { create } from "zustand";
import { useShallow } from "zustand/react/shallow";
import {
  WINDOW_IDS,
  WINDOW_LAYOUT_STORAGE_KEY,
  getDefaultWindowLayout,
  sanitizeWindowLayout,
} from "./layout";

const defaultMarkdown = 
`# Welcome to my React Markdown Previewer

## Quick sample
### Styled text and content

Use **bold** text, _italic_, and **_both_** for emphasis.

- Unordered item 1
- Unordered item 2
  - Nested item

1. Ordered step one
1. Ordered step two

> This is a blockquote to highlight a note.

Inline code looks like "const x = 5;".

">
">
The sample below shows a fenced code block:

\`\`\`
function greet(name) {
  return "Hello, ${name}!";
}
console.log(greet('World'));
\`\`\`

Link to [Vite](https://vitejs.dev) for fast dev build.

| Feature | Example |
| --- | --- |
| Heading | H1, H2, H3 |
| List | Ordered + unordered |

- [x] Task one
- [ ] Task two

---

Ready to edit and export with clear sections and code samples.
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

// Setters accept either a value or an updater function, mirroring the
// functional-update signature the previous Recoil setters exposed.
const resolve = (update, current) =>
  typeof update === "function" ? update(current) : update;

export const useAppStore = create((set) => ({
  text: defaultMarkdown,
  activeWindow: WINDOW_IDS.EDITOR,
  windowLayout: getInitialWindowLayout(),
  minimized: { editor: false, preview: false },
  activeTab: "editor",

  setText: (update) => set((state) => ({ text: resolve(update, state.text) })),
  setActiveWindow: (activeWindow) => set({ activeWindow }),
  setWindowLayout: (update) =>
    set((state) => ({ windowLayout: resolve(update, state.windowLayout) })),
  setMinimized: (update) =>
    set((state) => ({ minimized: resolve(update, state.minimized) })),
  setActiveTab: (activeTab) => set({ activeTab }),
}));

// Per-slice hooks: each returns [value, setter] for destructuring,
// mirroring the previous Recoil `useRecoilState` API. `useShallow`
// keeps the tuple referentially stable so zustand doesn't re-render
// when an unrelated slice changes.
export const useText = () =>
  useAppStore(useShallow((s) => [s.text, s.setText]));

export const useActiveWindow = () =>
  useAppStore(useShallow((s) => [s.activeWindow, s.setActiveWindow]));

export const useWindowLayout = () =>
  useAppStore(useShallow((s) => [s.windowLayout, s.setWindowLayout]));

export const useMinimized = () =>
  useAppStore(useShallow((s) => [s.minimized, s.setMinimized]));

export const useActiveTab = () =>
  useAppStore(useShallow((s) => [s.activeTab, s.setActiveTab]));

// Write-only hook for components that don't need to read the value.
export const useSetWindowLayout = () =>
  useAppStore((s) => s.setWindowLayout);
