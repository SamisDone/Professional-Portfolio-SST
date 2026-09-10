import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
// Climate Crisis for headings, Libre Franklin for everything else. Climate
// Crisis is a display face only, used at heading sizes and nowhere else.
import "@fontsource-variable/climate-crisis";
import "@fontsource-variable/libre-franklin";
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
