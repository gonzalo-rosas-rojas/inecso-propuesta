import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@/styles/base.css";
import "../pitch.css";
import { AppB } from "./AppB";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppB />
  </StrictMode>,
);
