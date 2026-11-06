import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { AppShell } from "./App.tsx";
import TransitionRouter from "./lib/TransitionRouter.tsx";
import { inject } from "@vercel/analytics";

// Cookie-free page views, so it is possible to see which projects visitors
// open. Does nothing until Web Analytics is enabled for the project on Vercel.
inject();


createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <TransitionRouter>
      <AppShell />
    </TransitionRouter>
  </StrictMode>,
);
