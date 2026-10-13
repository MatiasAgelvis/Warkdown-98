import React, { useRef } from "react";
import { Windows95Notepad } from "react-old-icons";
import { useText, useActiveWindow, useMinimized, useMaximized, useWindowLayout } from "../store";
import Draggable from "react-draggable";
import { WINDOW_IDS, clampWindowPosition, measureWindowSize } from "../layout";

import "../index.scss";

export const EditorContent = () => {
  const [input, setText] = useText();
  const onChange = (event) => setText(event.target.value);

  return (
    <>
      <div className="window-body">
        <textarea value={input} onChange={onChange} id="editor" />
      </div>
      <div className="status-bar">
        <div className="status-bar-field">Character Count: {input.length}</div>
      </div>
    </>
  );
};

export const Editor = ({ tabMode = false }) => {
  const [activeWindow, setActiveWindow] = useActiveWindow();
  const [minimized, setMinimized] = useMinimized();
  const [maximized, setMaximized] = useMaximized();
  const [layout, setLayout] = useWindowLayout();

  if (tabMode) return <EditorContent />;

  const nodeRef = useRef(null);

  const syncPosition = (position) => {
    setLayout((current) => ({
      ...current,
      [WINDOW_IDS.EDITOR]: clampWindowPosition(
        position,
        undefined,
        measureWindowSize(WINDOW_IDS.EDITOR)
      ),
    }));
  };

  const isMaximized = maximized.editor;

  const dragOptions = {
    grid: [2, 2],
    bounds: { top: 0 },
    handle: ".handle",
    nodeRef,
    // Win98 doesn't allow dragging a maximized window.
    disabled: isMaximized,
    position: isMaximized ? { x: 0, y: 0 } : layout[WINDOW_IDS.EDITOR],
    onStart: () => setActiveWindow(WINDOW_IDS.EDITOR),
    onDrag: (_, data) => syncPosition({ x: data.x, y: data.y }),
    onStop: (_, data) => syncPosition({ x: data.x, y: data.y }),
  };

  return (
    <Draggable {...dragOptions}>
      <div
        ref={nodeRef}
        className={`window editor-window${minimized.editor ? " is-minimized" : ""}${isMaximized ? " is-maximized" : ""}`}
        style={{
          zIndex: activeWindow === WINDOW_IDS.EDITOR ? 20 : 10,
          "--window-top": isMaximized ? "0px" : `${layout[WINDOW_IDS.EDITOR].y}px`,
          "--window-left": isMaximized ? "0px" : `${layout[WINDOW_IDS.EDITOR].x}px`,
        }}
        onMouseDown={() => setActiveWindow(WINDOW_IDS.EDITOR)}
      >
        <div className="title-bar handle">
          <div className="title-bar-text">
            <Windows95Notepad size={16} alt="" className="title-bar-icon" />
            Editor
          </div>
          <div className="title-bar-controls">
            <button
              aria-label="Minimize"
              onClick={() => setMinimized((m) => ({ ...m, editor: true }))}
            />
            <button
              aria-label={isMaximized ? "Restore" : "Maximize"}
              onClick={() =>
                setMaximized((m) => ({ editor: !m.editor, preview: false }))
              }
            />
            <button aria-label="Close" />
          </div>
        </div>
        <EditorContent />
      </div>
    </Draggable>
  );
};
