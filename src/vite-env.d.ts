/// <reference types="vite/client" />

/** Content hash of public/Samonwita_Sarker_CV.pdf, defined in vite.config.ts. */
declare const __CV_VERSION__: string;

/** The *-loop.mp4 files in public/shots, listed by vite.config.ts at build time. */
declare const __SHOT_LOOPS__: string[];

/** The images in public/certificates, listed by vite.config.ts at build time. */
declare const __CERTIFICATES__: { file: string; thumb?: string }[];

/**
 * The commit the site was built from and the day it was made, read from git
 * by vite.config.ts. Null when git cannot answer, and then nothing is shown.
 */
declare const __BUILD__: { sha: string; date: string } | null;

interface Document {
  startViewTransition?: (callback: () => void | Promise<void>) => ViewTransition;
}
