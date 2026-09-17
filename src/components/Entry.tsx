/**
 * One row of a record: what, where, when, and a line on it. Shared by the
 * education list on About and the lists on Activities, so the two pages read
 * as one ledger split in two rather than as two designs.
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
    <li className="border-t border-rule py-3.5 first:border-ink/30">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h3 className="text-[15px] font-medium leading-snug text-ink">{title}</h3>
        <span className="shrink-0 font-mono text-[12px] text-muted">{period}</span>
      </div>
      <p className="mt-1 max-w-measure text-[14px] leading-relaxed text-muted">
        {meta}. {note}
      </p>
    </li>
  );
}
