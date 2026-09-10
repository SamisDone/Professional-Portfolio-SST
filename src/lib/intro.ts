const SESSION_KEY = "ss-intro-seen";

/**
 * The intro is shown once per browser session. A reviewer who opens the site,
 * leaves, and comes back should not sit through it a second time — and anyone
 * who has asked their system to reduce motion should never see it at all.
 */
export function shouldShowIntro(): boolean {
  if (typeof window === "undefined") return false;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  try {
    return sessionStorage.getItem(SESSION_KEY) === null;
  } catch {
    // Private mode or blocked storage: showing it is the harmless fallback.
    return true;
  }
}

export function markIntroSeen(): void {
  try {
    sessionStorage.setItem(SESSION_KEY, "1");
  } catch {
    /* storage blocked — the intro just shows again next time */
  }
}
