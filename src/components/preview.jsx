import React, { useRef, useState } from "react";
import { textState, focusState, minimizedState } from "../store";
import { useRecoilValue, useRecoilState } from "recoil";
import Draggable from "react-draggable";
import ReactMarkdown from "react-markdown";
import { renderToStaticMarkup } from "react-dom/server";
import { saveAs } from 'file-saver';
import { jsPDF } from "jspdf";

import "../index.scss";

export const PreviewContent = () => {
  const markdownInput = useRecoilValue(textState);
  const [wordWrap, setWordWrap] = useState(false);

  const htmlRender = renderToStaticMarkup(
    <ReactMarkdown>{markdownInput}</ReactMarkdown>
  );

  async function htmlPdf(html, filename) {
    const doc = new jsPDF('p', 'pt', 'a4');
    const styledHtml = `<div style='width:500px; margin: 1rem 2rem'>${html}</div>`;
    await doc.html(styledHtml);
    doc.save(filename);
  }

  function textDownloader(blob, type, filename) {
    var blob = new Blob([blob], { type: type });
    saveAs(blob, filename);
  }

  return (
    <div className="window-body">
      <div className={`textzone resizable ${wordWrap ? "wrapText" : ""}`} id="preview">
        <ReactMarkdown>{markdownInput}</ReactMarkdown>
      </div>

      <div className="status-bar">
        <p className="status-bar-field">
          <input type="checkbox" id="wrodwrap" onChange={() => setWordWrap(!wordWrap)} />
          <label htmlFor="wrodwrap">Word Wrap</label>
        </p>
        <p className="status-bar-field">Download formats:{"\t"}
          <button onClick={() => textDownloader(markdownInput, 'text/markdown', 'Warkdown98.md')}>Markdown</button>
          <button onClick={() => textDownloader(htmlRender, 'text/html', 'Warkdown98.html')}>HTML</button>
          <button onClick={() => htmlPdf(htmlRender, 'Warkdown98.pdf')}>PDF</button>
        </p>
      </div>
    </div>
  );
};

export default function Preview({ tabMode = false }) {
  const [focused, setFocused] = useRecoilState(focusState);
  const [minimized, setMinimized] = useRecoilState(minimizedState);
  const ref = useRef(null);

  if (tabMode) return <PreviewContent />;

  const dragOptions = {
    grid: [2, 2],
    bounds: { top: 0 },
    handle: ".handle",
    onMouseDown: () => setFocused(ref),
  };

  return (
    <Draggable {...dragOptions}>
      <div
        className={`window preview-window${minimized.preview ? " is-minimized" : ""}`}
        ref={ref}
        style={{ zIndex: focused === ref ? 10 : 0 }}
      >
        <div className="title-bar handle">
          <div className="title-bar-text">Preview</div>
          <div className="title-bar-controls">
            <button
              aria-label="Minimize"
              onClick={() => setMinimized((m) => ({ ...m, preview: true }))}
            />
            <button aria-label="Maximize" />
            <button aria-label="Close" />
          </div>
        </div>
        <PreviewContent />
      </div>
    </Draggable>
  );
};
