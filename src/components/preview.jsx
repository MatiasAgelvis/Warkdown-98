import React, { useRef, useState, useEffect } from "react";
import { textState, focusState } from "../store";
import { useRecoilValue, useRecoilState } from "recoil";
import Draggable from "react-draggable";
import { useRemark } from "react-remark";
import { saveAs } from 'file-saver';
import { jsPDF } from "jspdf";
import { micromark } from 'micromark'

import "../index.scss";

export default function Preview() {
  const markdownInput = useRecoilValue(textState);
  const [focused, setFocused] = useRecoilState(focusState);
  // const [htmlRender, setMarkdownSource] = useRemark();
  const ref = useRef(null);
  const [htmlRender, setHtml] = useState('')
  const [wordWrap, setWordWrap] = useState(false)

  const dragOptions = {
    grid: [2, 2],
    bounds: { top: 0 },
    handle: ".handle",
    onMouseDown: (e) => {
      setFocused(ref);
      // console.log(ref == focused);
    },
  };

  useEffect(() => {
    setHtml(micromark(markdownInput));
  }, [markdownInput]);

  async function htmlPdf(html, filename){
    const doc = new jsPDF('p', 'pt', 'a4');
    const styledHtml = `<div class="" style='width:500px; margin: 1rem 2rem'>${html}</div>`
    await doc.html(styledHtml);
    // console.log(doc.internal.pageSize.getWidth())
    doc.save(filename);
  }

  function textDownloader (blob, type, filename){
    var blob = new Blob([blob], {type: type});
    saveAs(blob, filename);
  }


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
          
          <div className={`textzone resizable ${wordWrap? "wrapText":""}`}
          id="preview"
          dangerouslySetInnerHTML={{__html:htmlRender}}>
          </div>

          <div className="status-bar">
    {/* word wrap */}
    <p className="status-bar-field">
    <input type="checkbox" id="wrodwrap" onChange={() => setWordWrap( !wordWrap )} />
    <label htmlFor="wrodwrap">Word Wrap</label>
    </p>

    {/* downloads */}
    <p className="status-bar-field">Download formats:{"\t"}
    <button onClick={() => textDownloader(markdownInput, 'text/markdown', 'Warkdown98.md')}>Markdown</button>
    <button onClick={() => textDownloader(htmlRender, 'text/html', 'Warkdown98.html')}>HTML</button>
    <button onClick={() => htmlPdf(htmlRender, 'Warkdown98.pdf')}>PDF</button>
    </p>

  </div>
        </div>
      </div>
    </Draggable>
  );
};
