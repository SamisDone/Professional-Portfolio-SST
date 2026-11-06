import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { findProject } from "../lib/projects";
import { metaFor } from "../lib/meta";
import { afterNavigation, startMotion } from "../lib/motion";

/**
 * What happens after a page change: focus moves to the new page's heading,
 * and its title is announced through the one live region in AppShell, so a
 * screen reader and a keyboard land on the new page. Scroll is reset before
 * the swap, by lib/transitions.ts, so the new page is drawn from its top.
 *
 * Also forwards the old case study links. Case studies used to open in a
 * dialog at /work#slug; they are pages at /work/slug now, and any link still
 * pointing at the hash lands on the right one.
 */
/**
 * Slugs that were renamed. Finance Tracker became FinPulse, which became
 * Sixpence; both old repositories now resolve to SixPence on GitHub. Old case
 * study links only ever had the slug in the hash, which never reaches the
 * server, so this is the one place they can be forwarded.
 */
const OLD_SLUGS: Record<string, string> = { financetracker: "sixpence", finpulse: "sixpence" };

export default function RouteEffects() {
  const { pathname, hash } = useLocation();
  const navigate = useNavigate();
  const first = useRef(true);

  useEffect(() => {
    if (pathname !== "/work" || !hash) return;
    const slug = decodeURIComponent(hash.slice(1));
    const project = findProject(OLD_SLUGS[slug] ?? slug);
    if (project) navigate(`/work/${project.slug}`, { replace: true });
  }, [pathname, hash, navigate]);

  useEffect(() => {
    // On first load the visitor has not navigated, so moving focus would only
    // pull them out of wherever the browser put them.
    if (first.current) {
      first.current = false;
      // The motion layer starts after React's first render, never before:
      // until then the prerendered page shows everything in its end state.
      startMotion();
      return;
    }
    afterNavigation();
    document.querySelector<HTMLElement>("main h1")?.focus({ preventScroll: true });
    const announcer = document.getElementById("route-announcer");
    if (announcer) announcer.textContent = metaFor(pathname).title;
  }, [pathname]);

  return null;
}
