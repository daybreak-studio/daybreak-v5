import { GetStaticProps, GetStaticPaths } from "next";
import { worksApi } from "@/sanity/lib/work";
import { Work, Preview, CaseStudy } from "@/sanity/types";
import { useRouter } from "next/router";
import { useEffect } from "react";
import ProjectPreview from "./components/preview";
import ProjectCaseStudy from "./components/case-study";

const ProjectPage = ({ data, project }: { data: Work; project: string }) => {
  const { projects } = data;

  // Find the project that matches the category
  const projectData = projects?.find((p) => p.category === project);

  if (!projectData) {
    return <div>Project not found</div>;
  }

  // Render the appropriate component based on project type
  if (projectData._type === "preview") {
    return <ProjectPreview project={projectData as Preview} />;
  } else if (projectData._type === "caseStudy") {
    return <ProjectCaseStudy project={projectData as CaseStudy} />;
  }

  return null;
};

export const getStaticProps: GetStaticProps = async (context) => {
  const { client: clientSlug, project } = context.params as {
    client: string;
    project: string;
  };

  const data = await worksApi.getWorkBySlug(clientSlug);

  return {
    props: {
      data,
      project,
    },
    revalidate: 60,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = await worksApi.getAllClientProjectPaths();

  return {
    paths: paths.map(({ client, project }) => ({
      params: { client, project },
    })),
    fallback: "blocking",
  };
};

export default ProjectPage;
