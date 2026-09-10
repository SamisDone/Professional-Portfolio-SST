import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
// IBM Plex: drawn for technical documentation, and the sans and mono are one
// superfamily rather than two faces that happen to sit together.
import "@fontsource-variable/ibm-plex-sans";
import "@fontsource/ibm-plex-mono/400.css";
import "@fontsource/ibm-plex-mono/500.css";
import "./index.css";
import App from "./App.tsx";
import { storedTheme } from "./lib/theme";

// Applied before first paint so a stored dark choice never flashes light.
const stored = storedTheme();
if (stored) document.documentElement.setAttribute("data-theme", stored);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
