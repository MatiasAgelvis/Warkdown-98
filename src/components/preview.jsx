import { saveAs } from 'file-saver';
import { jsPDF } from "jspdf";
import { useState } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import Draggable from "react-draggable";
import ReactMarkdown from "react-markdown";
import { Windows98WriteDocument } from "react-old-icons";
import remarkGfm from "remark-gfm";
import { WINDOW_IDS, clampWindowPosition, measureWindowSize } from "../layout";
import { useActiveWindow, useMinimized, useMaximized, useText, useWindowLayout } from "../store";

import "../index.scss";

export const PreviewContent = () => {
  const [markdownInput] = useText();
  const [wordWrap, setWordWrap] = useState(false);

  const htmlRender = renderToStaticMarkup(
    <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdownInput}</ReactMarkdown>
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
    <>
      <div className="window-body">
        <div className={`textzone resizable ${wordWrap ? "wrapText" : ""}`} id="preview">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdownInput}</ReactMarkdown>
        </div>
      </div>

      <div className="status-bar">
        <div className="status-bar-field">
          <input type="checkbox" id="wrodwrap" onChange={() => setWordWrap(!wordWrap)} />
          <label htmlFor="wrodwrap">Word Wrap</label>
        </div>
        <div className="status-bar-field status-bar-field--grow">Download formats
          <button onClick={() => textDownloader(markdownInput, 'text/markdown', 'Warkdown98.md')}>Markdown</button>
          <button onClick={() => textDownloader(htmlRender, 'text/html', 'Warkdown98.html')}>HTML</button>
          <button onClick={() => htmlPdf(htmlRender, 'Warkdown98.pdf')}>PDF</button>
        </div>
      </div>
    </>
  );
};

export default function Preview({ tabMode = false }) {
  const [activeWindow, setActiveWindow] = useActiveWindow();
  const [minimized, setMinimized] = useMinimized();
  const [maximized, setMaximized] = useMaximized();
  const [layout, setLayout] = useWindowLayout();

  if (tabMode) return <PreviewContent />;

  const syncPosition = (position) => {
    setLayout((current) => ({
      ...current,
      [WINDOW_IDS.PREVIEW]: clampWindowPosition(
        position,
        undefined,
        measureWindowSize(WINDOW_IDS.PREVIEW)
      ),
    }));
  };

  const isMaximized = maximized.preview;

  const dragOptions = {
    grid: [2, 2],
    bounds: { top: 0 },
    handle: ".handle",
    // Win98 doesn't allow dragging a maximized window.
    disabled: isMaximized,
    position: isMaximized ? { x: 0, y: 0 } : layout[WINDOW_IDS.PREVIEW],
    onStart: () => setActiveWindow(WINDOW_IDS.PREVIEW),
    onDrag: (_, data) => syncPosition({ x: data.x, y: data.y }),
    onStop: (_, data) => syncPosition({ x: data.x, y: data.y }),
  };

  return (
    <Draggable {...dragOptions}>
      <div
        className={`window preview-window${minimized.preview ? " is-minimized" : ""}${isMaximized ? " is-maximized" : ""}`}
        style={{
          zIndex: activeWindow === WINDOW_IDS.PREVIEW ? 20 : 10,
          "--window-top": isMaximized ? "0px" : `${layout[WINDOW_IDS.PREVIEW].y}px`,
          "--window-left": isMaximized ? "0px" : `${layout[WINDOW_IDS.PREVIEW].x}px`,
        }}
        onMouseDown={() => setActiveWindow(WINDOW_IDS.PREVIEW)}
      >
        <div className="title-bar handle">
          <div className="title-bar-text">
            <Windows98WriteDocument size={16} alt="" className="title-bar-icon" />
            Preview
          </div>
          <div className="title-bar-controls">
            <button
              aria-label="Minimize"
              onClick={() => setMinimized((m) => ({ ...m, preview: true }))}
            />
            <button
              aria-label={isMaximized ? "Restore" : "Maximize"}
              onClick={() =>
                setMaximized((m) => ({ editor: false, preview: !m.preview }))
              }
            />
            <button aria-label="Close" />
          </div>
        </div>
        <PreviewContent />
      </div>
    </Draggable>
  );
};
