/**
 * Renders a route to HTML at build time, with no browser involved.
 *
 * `scripts/prerender.mjs` imports this from the SSR bundle and writes the
 * result into each route's file in `dist`. An earlier version drove a real
 * Chromium through Playwright, which worked locally and made the deploy depend
 * on a browser binary being downloadable in the host's build container. This
 * needs nothing but Node.
 *
 * Nothing in the app reads `window` or `document` while rendering. Every such
 * call sits in an effect or an event handler, and neither runs here.
 */
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router";
import { AppShell } from "./App";

export function render(pathname: string): string {
  return renderToString(
    <StaticRouter location={pathname}>
      <AppShell />
    </StaticRouter>,
  );
}
