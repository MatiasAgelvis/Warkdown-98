import React from "react";
import ReactDOM from "react-dom";
import { RecoilRoot } from "recoil";
import "./index.scss";
import { Editor } from "./components/editor";
import { Preview } from "./components/preview";

ReactDOM.render(
  <>
    <RecoilRoot>
        <Editor />
        <Preview />
    </RecoilRoot>
  </>,
  document.getElementById("root")
);
