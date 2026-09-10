import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@fontsource-variable/geist";
import "@fontsource-variable/geist-mono";
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
