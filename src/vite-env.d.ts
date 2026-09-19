/// <reference types="vite/client" />

/** Content hash of public/Samonwita_Sarker_CV.pdf, defined in vite.config.ts. */
declare const __CV_VERSION__: string;

interface Document {
  startViewTransition?: (callback: () => void | Promise<void>) => ViewTransition;
}
