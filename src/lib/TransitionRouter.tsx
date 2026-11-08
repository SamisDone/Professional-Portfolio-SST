import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { flushSync } from "react-dom";
import { Router, UNSAFE_createBrowserHistory as createBrowserHistory } from "react-router";
import { loadPage } from "./pages";
import { transitionTo } from "./transitions";

/**
 * BrowserRouter, with each history change wrapped in a view transition.
 *
 * BrowserRouter applies a location the moment history changes, which leaves
 * nowhere to stand between the old page and the new one. This listens to the
 * same history itself and hands the state update to `transitionTo`, which
 * runs it inside `document.startViewTransition` where that exists and the
 * visitor has not asked for reduced motion, and at once where not.
 *
 * The new page's code is in hand before the transition starts: usually from
 * the preload a link starts when it is pointed at, focused or touched.
 *
 * Client only. The prerender renders under StaticRouter, so the server HTML
 * is every page in its final state and none of this runs there.
 */
const history = createBrowserHistory({ v5Compat: true });

export default function TransitionRouter({ children }: { children: ReactNode }) {
  const [state, setState] = useState({ action: history.action, location: history.location });
  // Where the last navigation was headed, not what is on screen: during a run
  // of fast arrow presses the direction is taken from the previous target.
  const last = useRef(history.location.pathname + history.location.search);
  const latest = useRef(0);

  useLayoutEffect(() => {
    // The scroll position is set by the transition, before the new page is
    // drawn. The browser restoring it as well would fight that.
    window.history.scrollRestoration = "manual";
    return history.listen(({ action, location }) => {
      const from = last.current;
      const to = location.pathname + location.search;
      last.current = to;
      const id = ++latest.current;
      const go = () => {
        // A newer navigation has already taken over while this page loaded.
        if (id !== latest.current) return;
        transitionTo(from, to, action === "REPLACE", action === "POP", () =>
          flushSync(() => setState({ action, location })),
        );
      };
      const loading = loadPage(location.pathname);
      if (!loading) go();
      // A chunk that will not load is usually a new deploy: load the page whole.
      else loading.then(go, () => window.location.assign(location.pathname + location.search));
    });
  }, []);

  return (
    <Router location={state.location} navigationType={state.action} navigator={history}>
      {children}
    </Router>
  );
}
