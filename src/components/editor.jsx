import React, { useRef } from "react";
import { textState, focusState, minimizedState } from "../store";
import { useRecoilState } from "recoil";
import Draggable from "react-draggable";

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
  const [focused, setFocused] = useRecoilState(focusState);
  const [minimized, setMinimized] = useRecoilState(minimizedState);
  const ref = useRef(null);

  if (tabMode) return <EditorContent />;

  const dragOptions = {
    grid: [2, 2],
    bounds: { top: 0 },
    handle: ".handle",
    onMouseDown: () => setFocused(ref),
  };

  return (
    <Draggable {...dragOptions}>
      <div
        className={`window editor-window${minimized.editor ? " is-minimized" : ""}`}
        ref={ref}
        style={{ zIndex: focused === ref ? 10 : 0 }}
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
