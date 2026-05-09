import React, { useState } from "react";
import { useRecoilState } from "recoil";
import { minimizedState, activeTabState } from "../store";

export default function Taskbar({ isMobile }) {
  const [minimized, setMinimized] = useRecoilState(minimizedState);
  const [activeTab, setActiveTab] = useRecoilState(activeTabState);
  const [startOpen, setStartOpen] = useState(false);

  const handleEditorClick = () => {
    if (isMobile) {
      setActiveTab("editor");
    } else {
      setMinimized((m) => ({ ...m, editor: !m.editor }));
    }
  };

  const handlePreviewClick = () => {
    if (isMobile) {
      setActiveTab("preview");
    } else {
      setMinimized((m) => ({ ...m, preview: !m.preview }));
    }
  };

  const editorActive = isMobile ? activeTab === "editor" : !minimized.editor;
  const previewActive = isMobile ? activeTab === "preview" : !minimized.preview;

  return (
    <div className="taskbar">
      <div className="taskbar-start-wrapper">
        <button
          className={`taskbar-start${startOpen ? " taskbar-btn--active" : ""}`}
          onClick={() => setStartOpen((o) => !o)}
        >
          <span className="taskbar-start-icon">📎</span>
          Start
        </button>

        {startOpen && (
          <div className="start-menu" onClick={() => setStartOpen(false)}>
            <div className="start-menu-sidebar">Warkdown 98</div>
            <ul className="start-menu-list">
              <li
                className="start-menu-item"
                onClick={handleEditorClick}
              >
                <span className="start-menu-icon">✏️</span>
                Editor
              </li>
              <li
                className="start-menu-item"
                onClick={handlePreviewClick}
              >
                <span className="start-menu-icon">📄</span>
                Preview
              </li>
            </ul>
          </div>
        )}
      </div>

      <div className="taskbar-separator" />

      <button
        className={`taskbar-btn${editorActive ? " taskbar-btn--active" : ""}`}
        onClick={handleEditorClick}
      >
        ✏️ Editor
      </button>
      <button
        className={`taskbar-btn${previewActive ? " taskbar-btn--active" : ""}`}
        onClick={handlePreviewClick}
      >
        👁 Preview
      </button>
    </div>
  );
}
