import React, { useState, useEffect } from "react";
import {
  MicrosoftWord5,
  Windows95FlyingWindows,
  Windows95Notepad,
  Windows98WriteDocument,
  Windows95Explorer,
} from "react-old-icons";
import {
  useMinimized,
  useSetMaximized,
  useActiveTab,
  useActiveWindow,
  useSetWindowLayout,
} from "../store";
import { WINDOW_IDS, getDefaultWindowLayout } from "../layout";

const ICON_SIZE = 16;
const MENU_ICON_SIZE = 20;

function useClock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(id);
  }, []);
  return now;
}

export default function Taskbar({ isMobile }) {
  const [minimized, setMinimized] = useMinimized();
  const setMaximized = useSetMaximized();
  const [activeTab, setActiveTab] = useActiveTab();
  const [activeWindow, setActiveWindow] = useActiveWindow();
  const setWindowLayout = useSetWindowLayout();
  const [startOpen, setStartOpen] = useState(false);
  const now = useClock();

  // Close the Start menu on any click outside it (as Win98 does).
  useEffect(() => {
    if (!startOpen) return undefined;

    const handleOutside = (event) => {
      if (!event.target.closest(".taskbar-start-wrapper")) {
        setStartOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [startOpen]);
  const clockLabel = now.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  const handleEditorClick = () => {
    if (isMobile) {
      setActiveTab("editor");
    } else {
      if (minimized.editor) {
        setMinimized((m) => ({ ...m, editor: false }));
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
      } else {
        setMinimized((m) => ({ ...m, preview: true }));
        setActiveWindow(WINDOW_IDS.EDITOR);
      }
    }
  };

  const handleResetLayout = () => {
    setWindowLayout(getDefaultWindowLayout());
    setMinimized({ editor: false, preview: false });
    setMaximized({ editor: false, preview: false });
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
          <span className="taskbar-start-icon" aria-hidden="true">
            <Windows95FlyingWindows size={ICON_SIZE} alt="Start" />
          </span>
          Start
        </button>

        {startOpen && (
          <div className="start-menu" onClick={() => setStartOpen(false)}>
            <div className="start-menu-sidebar">
              <span className="start-menu-sidebar-icon" aria-hidden="true">
                <MicrosoftWord5 size={32} alt="" />
              </span>
              Warkdown 98
            </div>
            <ul className="start-menu-list">
              <li
                className="start-menu-item"
                onClick={handleEditorClick}
              >
                <span className="start-menu-icon" aria-hidden="true">
                  <Windows95Notepad size={MENU_ICON_SIZE} alt="Editor" />
                </span>
                Editor
              </li>
              <li
                className="start-menu-item"
                onClick={handlePreviewClick}
              >
                <span className="start-menu-icon" aria-hidden="true">
                  <Windows98WriteDocument size={MENU_ICON_SIZE} alt="Preview" />
                </span>
                Preview
              </li>
              {!isMobile && (
                <li
                  className="start-menu-item"
                  onClick={handleResetLayout}
                >
                  <span className="start-menu-icon" aria-hidden="true">
                    <Windows95Explorer size={MENU_ICON_SIZE} alt="Reset layout" />
                  </span>
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
        <span className="taskbar-btn-icon" aria-hidden="true">
          <Windows95Notepad size={ICON_SIZE} alt="Editor" />
        </span>
        Editor
      </button>
      <button
        className={`taskbar-btn${previewActive ? " taskbar-btn--active" : ""}`}
        onClick={handlePreviewClick}
      >
        <span className="taskbar-btn-icon" aria-hidden="true">
          <Windows98WriteDocument size={ICON_SIZE} alt="Preview" />
        </span>
        Preview
      </button>

      <div className="taskbar-tray" aria-label="System clock">
        {clockLabel}
      </div>
    </div>
  );
}
