import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "./motion.css";
import { AppShell } from "./App.tsx";
import TransitionRouter from "./lib/TransitionRouter.tsx";
import { loadPage, preloadOnIntent } from "./lib/pages";

const start = () =>
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <TransitionRouter>
        <AppShell />
      </TransitionRouter>
    </StrictMode>,
  );

// The prerendered page stays on screen until its code has arrived.
const first = loadPage(window.location.pathname);
if (first) first.then(start, start);
else start();
preloadOnIntent();
