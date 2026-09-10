/// <reference types="vite/client" />

interface Document {
  startViewTransition?: (callback: () => void | Promise<void>) => ViewTransition;
}
