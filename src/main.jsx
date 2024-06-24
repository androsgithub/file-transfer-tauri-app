import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { HotkeysProvider } from "react-hotkeys-hook";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <HotkeysProvider initiallyActiveScopes={["settings"]}>
      <App />
    </HotkeysProvider>
  </React.StrictMode>
);
