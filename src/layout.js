export const WINDOW_IDS = {
  EDITOR: "editor",
  PREVIEW: "preview",
};

export const WINDOW_LAYOUT_STORAGE_KEY = "warkdown98.windowLayout";
const TASKBAR_HEIGHT = 32;
const DEFAULT_VIEWPORT = { width: 1280, height: 720 };

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

export function clampWindowPosition(position, viewport = getViewportSize()) {
  const { width, height } = getWindowSize(viewport);
  const maxX = Math.max(0, viewport.width - width);
  const maxY = Math.max(0, viewport.height - TASKBAR_HEIGHT - height);

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
      viewport
    ),
    [WINDOW_IDS.PREVIEW]: clampWindowPosition(
      layout?.[WINDOW_IDS.PREVIEW] ?? fallback[WINDOW_IDS.PREVIEW],
      viewport
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