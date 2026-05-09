import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { RecoilRoot, useRecoilState } from "recoil";
import "./index.scss";
import { Editor } from "./components/editor";
import Preview from "./components/preview";
import Taskbar from "./components/taskbar";
import { activeTabState } from "./store";

function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(window.innerWidth < breakpoint);
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < breakpoint);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, [breakpoint]);
  return isMobile;
}

function MobileTabView() {
  const [activeTab, setActiveTab] = useRecoilState(activeTabState);

  return (
    <div className="mobile-container">
      <div className="window mobile-window">
        <div className="title-bar">
          <div className="title-bar-text">Warkdown 98</div>
        </div>
        <div className="window-body">
          <menu role="tablist">
            <li
              role="tab"
              aria-selected={activeTab === "editor" ? true : undefined}
            >
              <a
                href="#tabpanel"
                onClick={(e) => {
                  e.preventDefault();
                  setActiveTab("editor");
                }}
              >
                Editor
              </a>
            </li>
            <li
              role="tab"
              aria-selected={activeTab === "preview" ? true : undefined}
            >
              <a
                href="#tabpanel"
                onClick={(e) => {
                  e.preventDefault();
                  setActiveTab("preview");
                }}
              >
                Preview
              </a>
            </li>
          </menu>
          <div id="tabpanel" role="tabpanel" className="tab-panel">
            {activeTab === "editor" ? (
              <Editor tabMode />
            ) : (
              <Preview tabMode />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  const isMobile = useIsMobile();

  return (
    <>
      {isMobile ? (
        <MobileTabView />
      ) : (
        <>
          <Editor />
          <Preview />
        </>
      )}
      <Taskbar isMobile={isMobile} />
    </>
  );
}

ReactDOM.render(
  <RecoilRoot>
    <App />
  </RecoilRoot>,
  document.getElementById("root")
);

