import { useParams } from "react-router-dom";
import Page from "../components/Page";
import CaseStudy from "../components/CaseStudy";
import { findProject } from "../lib/projects";
import NotFoundPage from "./NotFoundPage";

export default function CaseStudyPage() {
  const { slug } = useParams();
  const project = findProject(slug);
  if (!project) return <NotFoundPage />;

  return (
    <Page title={`${project.title} case study`}>
      {/* Keyed so moving between case studies starts each one fresh. */}
      <CaseStudy key={project.slug} project={project} />
    </Page>
  );
}
