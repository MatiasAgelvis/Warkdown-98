import React from "react";
import {
  textState,
  activeWindowState,
  minimizedState,
  windowLayoutState,
} from "../store";
import { useRecoilState } from "recoil";
import Draggable from "react-draggable";
import { WINDOW_IDS, clampWindowPosition } from "../layout";

import "../index.scss";

export const EditorContent = () => {
  const [input, setInput] = useRecoilState(textState);
  const onChange = (event) => setInput(event.target.value);

  return (
    <>
      <div className="window-body">
        <textarea value={input} onChange={onChange} id="editor" />
      </div>
      <div className="status-bar">
        <p className="status-bar-field">Character Count: {input.length}</p>
      </div>
    </>
  );
};

export const Editor = ({ tabMode = false }) => {
  const [activeWindow, setActiveWindow] = useRecoilState(activeWindowState);
  const [minimized, setMinimized] = useRecoilState(minimizedState);
  const [layout, setLayout] = useRecoilState(windowLayoutState);

  if (tabMode) return <EditorContent />;

  const syncPosition = (position) => {
    setLayout((current) => ({
      ...current,
      [WINDOW_IDS.EDITOR]: clampWindowPosition(position),
    }));
  };

  const dragOptions = {
    grid: [2, 2],
    bounds: { top: 0 },
    handle: ".handle",
    position: layout[WINDOW_IDS.EDITOR],
    onStart: () => setActiveWindow(WINDOW_IDS.EDITOR),
    onDrag: (_, data) => syncPosition({ x: data.x, y: data.y }),
    onStop: (_, data) => syncPosition({ x: data.x, y: data.y }),
  };

  return (
    <Draggable {...dragOptions}>
      <div
        className={`window editor-window${minimized.editor ? " is-minimized" : ""}`}
        style={{ zIndex: activeWindow === WINDOW_IDS.EDITOR ? 20 : 10 }}
        onMouseDown={() => setActiveWindow(WINDOW_IDS.EDITOR)}
      >
        <div className="title-bar handle">
          <div className="title-bar-text">Editor</div>
          <div className="title-bar-controls">
            <button
              aria-label="Minimize"
              onClick={() => setMinimized((m) => ({ ...m, editor: true }))}
            />
            <button aria-label="Maximize" />
            <button aria-label="Close" />
          </div>
        </div>
        <EditorContent />
      </div>
    </Draggable>
  );
};
