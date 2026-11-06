/**
 * Writes structured data into the page, so the prerendered HTML carries it.
 * `<` is escaped so no string in the content can close the script early.
 */
export default function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replaceAll("<", "\\u003c") }}
    />
  );
}
