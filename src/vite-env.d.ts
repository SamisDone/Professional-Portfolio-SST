/// <reference types="vite/client" />

// View Transitions API. Still absent from some lib.dom versions, and the
// theme toggle feature-detects it before use.
interface ViewTransition {
  ready: Promise<void>;
  finished: Promise<void>;
  updateCallbackDone: Promise<void>;
  skipTransition(): void;
}
interface Document {
  startViewTransition?: (callback: () => void | Promise<void>) => ViewTransition;
}
