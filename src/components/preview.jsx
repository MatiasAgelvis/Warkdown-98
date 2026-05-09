import React, { useState } from "react";
import {
  textState,
  activeWindowState,
  minimizedState,
  windowLayoutState,
} from "../store";
import { useRecoilValue, useRecoilState } from "recoil";
import Draggable from "react-draggable";
import ReactMarkdown from "react-markdown";
import { renderToStaticMarkup } from "react-dom/server";
import { saveAs } from 'file-saver';
import { jsPDF } from "jspdf";
import { WINDOW_IDS, clampWindowPosition } from "../layout";

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
  const [activeWindow, setActiveWindow] = useRecoilState(activeWindowState);
  const [minimized, setMinimized] = useRecoilState(minimizedState);
  const [layout, setLayout] = useRecoilState(windowLayoutState);

  if (tabMode) return <PreviewContent />;

  const syncPosition = (position) => {
    setLayout((current) => ({
      ...current,
      [WINDOW_IDS.PREVIEW]: clampWindowPosition(position),
    }));
  };

  const dragOptions = {
    grid: [2, 2],
    bounds: { top: 0 },
    handle: ".handle",
    position: layout[WINDOW_IDS.PREVIEW],
    onStart: () => setActiveWindow(WINDOW_IDS.PREVIEW),
    onDrag: (_, data) => syncPosition({ x: data.x, y: data.y }),
    onStop: (_, data) => syncPosition({ x: data.x, y: data.y }),
  };

  return (
    <Draggable {...dragOptions}>
      <div
        className={`window preview-window${minimized.preview ? " is-minimized" : ""}`}
        style={{ zIndex: activeWindow === WINDOW_IDS.PREVIEW ? 20 : 10 }}
        onMouseDown={() => setActiveWindow(WINDOW_IDS.PREVIEW)}
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
