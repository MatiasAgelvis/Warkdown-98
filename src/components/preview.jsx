import React, { useRef } from "react";
import ReactMarkdown from "react-markdown";
import { textState, focusState } from "../store";
import { useRecoilValue, useRecoilState } from "recoil";
import Draggable from "react-draggable";

import "../index.scss";

export default function Preview() {
  const input = useRecoilValue(textState);
  const [focused, setFocused] = useRecoilState(focusState);
  const ref = useRef(null);

  const dragOptions = {
    grid: [2, 2],
    bounds: { top: 0 },
    handle: ".handle",
    onMouseDown: (e) => {
      setFocused(ref);
      console.log(ref == focused);
    },
  };

  return (
    <Draggable {...dragOptions}>
      <div
        className="window preview-window"
        ref={ref}
        style={{ zIndex: focused === ref ? 10 : 0 }}
      >
        <div className="title-bar handle">
          <div className="title-bar-text">Preview</div>
          <div className="title-bar-controls">
            <button aria-label="Minimize" />
            <button aria-label="Maximize" />
            <button aria-label="Close" />
          </div>
        </div>

        <div className="window-body">
          <ReactMarkdown className="textzone resizable" id="preview">
            {input}
          </ReactMarkdown>
        </div>
      </div>
    </Draggable>
  );
};
