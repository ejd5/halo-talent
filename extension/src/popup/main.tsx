// ─── Popup entry point — Halo Companion ───────────

import React from "react";
import ReactDOM from "react-dom/client";
import Popup from "./Popup";

const root = document.getElementById("root");
if (!root) throw new Error("Root element not found");

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>
);
