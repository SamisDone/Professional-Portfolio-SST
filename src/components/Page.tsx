import type { ReactNode } from "react";

/**
 * Wraps every route. Pages scroll: the one-screen rule, and the fifteen
 * height queries that held it up, are gone. The document's title and meta
 * tags are set by lib/transitions.ts, before the new page is drawn.
 */
export default function Page({ children, title }: { children: ReactNode; title: string }) {
  return (
    <main id="main" aria-label={title} className="flex-1">
      {children}
    </main>
  );
}
