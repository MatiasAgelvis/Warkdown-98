import React, { useState } from "react";
import { useRecoilState } from "recoil";
import {
  minimizedState,
  activeTabState,
  activeWindowState,
  windowLayoutState,
} from "../store";
import { WINDOW_IDS, getDefaultWindowLayout } from "../layout";

export default function Taskbar({ isMobile }) {
  const [minimized, setMinimized] = useRecoilState(minimizedState);
  const [activeTab, setActiveTab] = useRecoilState(activeTabState);
  const [activeWindow, setActiveWindow] = useRecoilState(activeWindowState);
  const [, setWindowLayout] = useRecoilState(windowLayoutState);
  const [startOpen, setStartOpen] = useState(false);

  const handleEditorClick = () => {
    if (isMobile) {
      setActiveTab("editor");
    } else {
      if (minimized.editor) {
        setMinimized((m) => ({ ...m, editor: false }));
        setActiveWindow(WINDOW_IDS.EDITOR);
      } else if (activeWindow !== WINDOW_IDS.EDITOR) {
        setActiveWindow(WINDOW_IDS.EDITOR);
      } else {
        setMinimized((m) => ({ ...m, editor: true }));
        setActiveWindow(WINDOW_IDS.PREVIEW);
      }
    }
  };

  const handlePreviewClick = () => {
    if (isMobile) {
      setActiveTab("preview");
    } else {
      if (minimized.preview) {
        setMinimized((m) => ({ ...m, preview: false }));
        setActiveWindow(WINDOW_IDS.PREVIEW);
      } else if (activeWindow !== WINDOW_IDS.PREVIEW) {
        setActiveWindow(WINDOW_IDS.PREVIEW);
      } else {
        setMinimized((m) => ({ ...m, preview: true }));
        setActiveWindow(WINDOW_IDS.EDITOR);
      }
    }
  };

  const handleResetLayout = () => {
    setWindowLayout(getDefaultWindowLayout());
    setMinimized({ editor: false, preview: false });
    setActiveWindow(WINDOW_IDS.EDITOR);
    setStartOpen(false);
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
              {!isMobile && (
                <li
                  className="start-menu-item"
                  onClick={handleResetLayout}
                >
                  <span className="start-menu-icon">🧭</span>
                  Reset layout
                </li>
              )}
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
      {!isMobile && (
        <button className="taskbar-btn" onClick={handleResetLayout}>
          🧭 Reset
        </button>
      )}
    </div>
  );
}
