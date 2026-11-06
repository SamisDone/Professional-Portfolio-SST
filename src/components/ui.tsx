import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import Arrow, { type ArrowDir } from "./Arrow";

/*
 * The controls, built from the tokens and nothing else. A button is the only
 * thing with a shadow at rest, because a shadow means "you can press this".
 */

type Target = { to: string; href?: never } | { href: string; to?: never };

const external = { target: "_blank", rel: "noopener noreferrer" } as const;

/** Primary is filled with the section colour and appears once per view.
    Secondary is paper. */
export function Button({
  variant = "secondary",
  arrow,
  children,
  className = "",
  ...target
}: Target & {
  variant?: "primary" | "secondary";
  /** Defaults to → for a route and ↗ for a link that leaves the site. */
  arrow?: ArrowDir | false;
  children: ReactNode;
  className?: string;
}) {
  const cls = `btn btn-${variant} press ${className}`;
  const dir = arrow === undefined ? (target.to ? "right" : "out") : arrow;
  const body = (
    <>
      {dir === "left" && <Arrow dir="left" />}
      {children}
      {dir && dir !== "left" && <Arrow dir={dir} />}
    </>
  );
  return target.to ? (
    <Link to={target.to} className={cls}>
      {body}
    </Link>
  ) : (
    <a href={target.href} {...external} className={cls}>
      {body}
    </a>
  );
}

/** Ink, a 2px underline, and the arrow that says where it goes. */
export function TextLink({
  children,
  arrow,
  className = "",
  label,
  ...target
}: Target & { children: ReactNode; arrow?: ArrowDir | false; className?: string; label?: string }) {
  const dir = arrow === undefined ? (target.to ? "right" : "out") : arrow;
  const body = (
    <>
      {dir === "left" && (
        <>
          <Arrow dir="left" />{" "}
        </>
      )}
      {children}
      {dir && dir !== "left" && (
        <>
          {" "}
          <Arrow dir={dir} />
        </>
      )}
    </>
  );
  const cls = `link tap ${className}`;
  return target.to ? (
    <Link to={target.to} className={cls} aria-label={label}>
      {body}
    </Link>
  ) : (
    <a href={target.href} {...external} className={cls} aria-label={label}>
      {body}
    </a>
  );
}

/**
 * A claim with its receipt: yellow behind it, underlined, ending in an arrow.
 * Yellow is used for nothing else, so it always means "checkable".
 */
export function ProofMark({
  children,
  className = "",
  label,
  ...target
}: Target & { children: ReactNode; className?: string; label?: string }) {
  const body = (
    <>
      {children} <Arrow dir={target.to ? "right" : "out"} />
    </>
  );
  const cls = `proof-mark tap ${className}`;
  return target.to ? (
    <Link to={target.to} className={cls} aria-label={label}>
      {body}
    </Link>
  ) : (
    <a href={target.href} {...external} className={cls} aria-label={label}>
      {body}
    </a>
  );
}

/** Martian Mono, uppercase, 12px. Every small label on the site. */
export function Label({
  children,
  as: Tag = "p",
  className = "",
  id,
}: {
  children: ReactNode;
  as?: "p" | "span" | "dt" | "h2" | "h3" | "div";
  className?: string;
  id?: string;
}) {
  return (
    <Tag id={id} className={`t-label text-ink-2 ${className}`}>
      {children}
    </Tag>
  );
}
