/// <reference types="vite/client" />

/** Content hash of public/Samonwita_Sarker_CV.pdf, defined in vite.config.ts. */
declare const __CV_VERSION__: string;

/** The images in public/certificates, listed by vite.config.ts at build time. */
declare const __CERTIFICATES__: { file: string; thumb?: string }[];

interface Document {
  startViewTransition?: (callback: () => void | Promise<void>) => ViewTransition;
}
