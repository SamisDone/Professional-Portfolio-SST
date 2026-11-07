import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "./motion.css";
import { AppShell } from "./App.tsx";
import TransitionRouter from "./lib/TransitionRouter.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <TransitionRouter>
      <AppShell />
    </TransitionRouter>
  </StrictMode>,
);
