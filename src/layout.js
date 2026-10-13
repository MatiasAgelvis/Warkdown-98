export const WINDOW_IDS = {
  EDITOR: "editor",
  PREVIEW: "preview",
};

export const WINDOW_LAYOUT_STORAGE_KEY = "warkdown98.windowLayout";
// Fallback for the CSS custom property when it isn't readable (SSR, or
// before stylesheets load). Must stay in sync with --taskbar-height.
const DEFAULT_TASKBAR_HEIGHT = 28;
const DEFAULT_VIEWPORT = { width: 1280, height: 720 };

// Single source of truth for the taskbar size is the CSS custom property,
// so clamping stays correct if the bar is resized in the stylesheet.
function getTaskbarHeight() {
  if (typeof window === "undefined") return DEFAULT_TASKBAR_HEIGHT;

  const raw = window
    .getComputedStyle(document.documentElement)
    .getPropertyValue("--taskbar-height");
  const parsed = parseFloat(raw);
  return Number.isFinite(parsed) ? parsed : DEFAULT_TASKBAR_HEIGHT;
}

// Reads the real rendered size of a pane; null when it isn't measurable
// (not yet mounted, or minimized to display:none), so callers can fall
// back to the viewport-based guess.
export function measureWindowSize(id) {
  if (typeof document === "undefined") return null;

  const el = document.querySelector(`.${id}-window`);
  if (!el) return null;

  const { width, height } = el.getBoundingClientRect();
  if (!width || !height) return null;

  return { width, height };
}

function getViewportSize() {
  if (typeof window === "undefined") {
    return DEFAULT_VIEWPORT;
  }

  return {
    width: window.innerWidth,
    height: window.innerHeight,
  };
}

function getWindowSize(viewport) {
  return {
    width: Math.max(360, Math.floor(viewport.width * 0.4)),
    height: Math.max(280, Math.floor(viewport.height * 0.56)),
  };
}

export function clampWindowPosition(
  position,
  viewport = getViewportSize(),
  size = null
) {
  const { width, height } = size ?? getWindowSize(viewport);
  const taskbarHeight = getTaskbarHeight();
  const maxX = Math.max(0, viewport.width - width);
  const maxY = Math.max(0, viewport.height - taskbarHeight - height);

  return {
    x: Math.min(Math.max(Number(position?.x) || 0, 0), maxX),
    y: Math.min(Math.max(Number(position?.y) || 0, 0), maxY),
  };
}

export function getDefaultWindowLayout(viewport = getViewportSize()) {
  return {
    [WINDOW_IDS.EDITOR]: clampWindowPosition({ x: 0, y: 0 }, viewport),
    [WINDOW_IDS.PREVIEW]: clampWindowPosition(
      { x: Math.floor(viewport.width * 0.45), y: 0 },
      viewport
    ),
  };
}

export function sanitizeWindowLayout(layout, viewport = getViewportSize()) {
  const fallback = getDefaultWindowLayout(viewport);

  return {
    [WINDOW_IDS.EDITOR]: clampWindowPosition(
      layout?.[WINDOW_IDS.EDITOR] ?? fallback[WINDOW_IDS.EDITOR],
      viewport,
      measureWindowSize(WINDOW_IDS.EDITOR)
    ),
    [WINDOW_IDS.PREVIEW]: clampWindowPosition(
      layout?.[WINDOW_IDS.PREVIEW] ?? fallback[WINDOW_IDS.PREVIEW],
      viewport,
      measureWindowSize(WINDOW_IDS.PREVIEW)
    ),
  };
}

export function layoutsEqual(left, right) {
  return (
    left?.[WINDOW_IDS.EDITOR]?.x === right?.[WINDOW_IDS.EDITOR]?.x &&
    left?.[WINDOW_IDS.EDITOR]?.y === right?.[WINDOW_IDS.EDITOR]?.y &&
    left?.[WINDOW_IDS.PREVIEW]?.x === right?.[WINDOW_IDS.PREVIEW]?.x &&
    left?.[WINDOW_IDS.PREVIEW]?.y === right?.[WINDOW_IDS.PREVIEW]?.y
  );
}