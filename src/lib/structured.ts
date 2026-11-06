/**
 * schema.org structured data, built from content.ts.
 *
 * A personal site, so the entity is a Person, never an Organization. Every
 * other item points back to that Person by its @id rather than repeating it.
 * Case studies are SoftwareSourceCode, a kind of CreativeWork that carries
 * the repository; on work done with others she is a contributor, not the
 * author, the same line the case study itself draws.
 */
import { education, profile, research, type Project } from "../data/content";
import { SITE_URL, absolute } from "./site";

const PERSON_ID = `${SITE_URL}/#person`;
const ref = { "@id": PERSON_ID };

export function personAndWebsite() {
  const school = education[0];
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": PERSON_ID,
        name: profile.name,
        url: absolute("/"),
        jobTitle: "Software engineer and explainable AI researcher",
        description: profile.positioning,
        alumniOf: {
          "@type": "CollegeOrUniversity",
          name: school.school,
          url: "https://www.cuet.ac.bd/",
        },
        sameAs: [profile.github, profile.linkedin],
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: absolute("/"),
        name: profile.name,
        inLanguage: "en",
        publisher: ref,
      },
    ],
  };
}

/** One ScholarlyArticle per paper, with the author list as the venue prints it. */
export function scholarlyArticles() {
  return {
    "@context": "https://schema.org",
    "@graph": research.map((m) => ({
      "@type": "ScholarlyArticle",
      headline: m.title,
      name: m.title,
      datePublished: m.year,
      url: m.href,
      isPartOf: { "@type": "PublicationIssue", name: m.venue },
      author: (m.authors ?? []).map((name, i) =>
        i === m.selfIndex ? { "@type": "Person", "@id": PERSON_ID, name } : { "@type": "Person", name },
      ),
      description: m.note,
    })),
  };
}

/** A case study page: the project, and the breadcrumb that leads to it. */
export function caseStudy(p: Project) {
  const url = absolute(`/work/${p.slug}`);
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareSourceCode",
        name: p.title,
        description: p.summary,
        url,
        codeRepository: p.repo,
        programmingLanguage: p.stack,
        dateCreated: p.year,
        ...(p.shot ? { image: `${SITE_URL}${p.shot.replace(/\.(jpg|jpeg|png)$/i, ".webp")}` } : {}),
        ...(p.team ? { contributor: ref } : { author: ref }),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Work", item: absolute("/work") },
          { "@type": "ListItem", position: 2, name: p.title, item: url },
        ],
      },
    ],
  };
}
