import { certifications } from "../data/content";
import { TextLink } from "./ui";
import DecodeText from "./DecodeText";

/** Lowercase words joined by hyphens: the name a certificate's file should have. */
const slug = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

/** "web-design_2024" to "Web design 2024". */
const fromFile = (stem: string) => {
  const words = stem.replace(/[-_]+/g, " ").trim();
  return words.charAt(0).toUpperCase() + words.slice(1);
};

/**
 * The images in public/certificates, listed at build time (vite.config.ts). A
 * file named for its certificate, full-stack-development-freecodecamp.jpg,
 * takes that certificate's name from content.ts; any other file is titled
 * from its own name. A file with a thumbnail beside it, written by
 * scripts/make-image-variants.py, shows that in the grid.
 */
const IMAGES = __CERTIFICATES__.map(({ file, thumb }) => {
  const stem = file.replace(/\.\w+$/, "");
  const named = certifications.items.find((c) => slug(c) === slug(stem));
  return { src: `/certificates/${file}`, thumb: thumb ? `/certificates/${thumb}` : undefined, stem, title: named ?? fromFile(stem), named };
});

/**
 * Every certificate as a thumbnail, each opening full size in the same sheet
 * as the site's screenshots (Inspect, through `data-inspect`). Certificates
 * with no image yet are listed by name under the grid.
 */
export default function Certificates() {
  const withoutImage = certifications.items.filter((c) => !IMAGES.some((i) => i.named === c));

  return (
    <>
      <section className="shell tier-a">
        <DecodeText tabIndex={-1} className="t-h1 band">
          Certificates.
        </DecodeText>
      </section>

      <section aria-label="Certificates" className="shell tier-b">
        {IMAGES.length > 0 && (
          <ul className="m-0 grid list-none grid-cols-2 gap-4 p-0 md:grid-cols-3 lg:grid-cols-4">
            {IMAGES.map((c) => (
              <li key={c.src}>
                <figure className="m-0">
                  <a
                    href={c.src}
                    data-inspect
                    aria-label={`${c.title}, full size`}
                    className="block border-2 border-ink bg-paper-2"
                    style={{ aspectRatio: "1.414" }}
                  >
                    <img
                      src={c.thumb ?? c.src}
                      alt={`Certificate: ${c.title}`}
                      loading="lazy"
                      decoding="async"
                      width={480}
                      height={339}
                      className="block h-full w-full object-contain"
                    />
                  </a>
                  <figcaption className="t-small mt-2">{c.title}</figcaption>
                </figure>
              </li>
            ))}
          </ul>
        )}

        {withoutImage.length > 0 && (
          <ul data-ledger="bottom" className={`m-0 list-none border-t-2 border-ink p-0 ${IMAGES.length > 0 ? "mt-8" : ""}`}>
            {withoutImage.map((c) => (
              <li key={c} className="tint-row t-body border-b border-ink py-3">
                {c}
              </li>
            ))}
          </ul>
        )}

        <p className="t-small mt-6">
          <TextLink href={certifications.href}>Originals on Google Drive</TextLink>
        </p>
      </section>
    </>
  );
}
