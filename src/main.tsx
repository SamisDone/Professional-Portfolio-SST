import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "./motion.css";
import { AppShell } from "./App.tsx";
import TransitionRouter from "./lib/TransitionRouter.tsx";
import { inject } from "@vercel/analytics";

// Cookie-free page views, so it is possible to see which projects visitors
// open. Only on Vercel: its script is served from /_vercel/insights/, which
// exists on no other host, so anywhere else (Cloudflare Pages, a local
// server) the call would only fetch a 404.
if (location.hostname.endsWith("vercel.app")) inject();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <TransitionRouter>
      <AppShell />
    </TransitionRouter>
  </StrictMode>,
);
