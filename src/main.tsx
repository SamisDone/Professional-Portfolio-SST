import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
// Climate Crisis for headings, Libre Franklin for everything else. Climate
// Crisis is a display face only, used at heading sizes and nowhere else.
import "@fontsource-variable/climate-crisis";
import "@fontsource-variable/libre-franklin";
import "./index.css";
import App from "./App.tsx";


createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
