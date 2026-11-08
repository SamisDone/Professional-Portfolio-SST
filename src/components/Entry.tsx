import type { Receipt } from "../data/content";
import { Label, ProofMark, TextLink } from "./ui";

/**
 * One row of a record: what, where, when, and a line on it. Shared by the
 * education list on About and the lists on Activities, so the two pages read
 * as one ledger split in two.
 */
export default function Entry({
  title,
  meta,
  period,
  note,
  receipts = [],
}: {
  title: string;
  meta: string;
  period: string;
  note: string;
  /** A published record is a proof mark; a page on this site, a link. */
  receipts?: Receipt[];
}) {
  return (
    <li className="tint-row border-t border-ink py-3 first:border-t-2">
      {/* Two columns, so a title that wraps keeps its date on the right
          instead of dropping it under itself. */}
      <div className="grid grid-cols-[1fr_auto] items-baseline gap-x-4">
        <h3 className="t-h3">{title}</h3>
        <Label as="span" date>
          {period}
        </Label>
      </div>
      <p className="t-body mt-2 max-w-measure">
        {meta}. {note}
      </p>
      {receipts.length > 0 && (
        <p className="m-0 mt-2 flex flex-wrap gap-x-6 gap-y-2">
          {receipts.map((r) =>
            r.href ? (
              <ProofMark key={r.label} href={r.href} className="t-small">
                {r.label}
              </ProofMark>
            ) : (
              <TextLink key={r.label} to={r.to!} className="t-small">
                {r.label}
              </TextLink>
            ),
          )}
        </p>
      )}
    </li>
  );
}
