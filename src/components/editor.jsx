import React, { useRef } from "react";
import { textState, focusState } from "../store";
import { useRecoilState } from "recoil";
import Draggable from "react-draggable";

import "../index.scss";

export const Editor = () => {
  const [input, setInput] = useRecoilState(textState);
  const [focused, setFocused] = useRecoilState(focusState);
  const ref = useRef(null);

  const onChange = (event) => {
    setInput(event.target.value);
  };

  const dragOptions = {
    grid: [2, 2],
    bounds: { top: 0 },
    handle: ".handle",
    onMouseDown: (e) => {
      setFocused(ref);
    },
  };

  return (
    <Draggable {...dragOptions}>
      <div
        className="window editor-window"
        ref={ref}
        style={{ zIndex: focused === ref ? 10 : 0 }}
      >
        <div className="title-bar handle">
          <div className="title-bar-text">Editor</div>
          <div className="title-bar-controls">
            <button aria-label="Minimize" />
            <button aria-label="Maximize" />
            <button aria-label="Close" />
          </div>
        </div>

        <div className="window-body">
          <textarea value={input} onChange={onChange} id="editor" />
        </div>

        <div className="status-bar">
          <p className="status-bar-field">Character Count: {input.length}</p>
        </div>
      </div>
    </Draggable>
  );
};
