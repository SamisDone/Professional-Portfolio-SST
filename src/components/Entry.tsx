import { Label } from "./ui";

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
}: {
  title: string;
  meta: string;
  period: string;
  note: string;
}) {
  return (
    <li className="tint-row border-t border-ink py-4 first:border-t-2">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h3 className="t-h3">{title}</h3>
        <Label as="span" className="shrink-0">
          {period}
        </Label>
      </div>
      <p className="t-body mt-2 max-w-measure">
        {meta}. {note}
      </p>
    </li>
  );
}
