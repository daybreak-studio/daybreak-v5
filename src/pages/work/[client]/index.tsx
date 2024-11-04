// src/pages/work/[client]/index.tsx
import { GetStaticProps, GetStaticPaths } from "next";
import { worksApi } from "@/sanity/lib/work";
import { Work } from "@/sanity/types";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import ProjectPreview from "./[project]/components/preview";
import ProjectCaseStudy from "./[project]/components/case-study";
import { Preview, CaseStudy } from "@/sanity/types";
import { getProjectFirstMedia } from "@/sanity/lib/media";
import { assetUrlFor } from "@/sanity/lib/builder";
import Image from "next/image";
import { MediaRenderer } from "@/components/media-renderer";

const ProjectSelector = ({ data }: { data: Work }) => {
  const { name, slug, projects } = data;

  return (
    <div>
      <h1>Select a Project Type</h1>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {projects?.map((project) => {
          const mediaAsset = getProjectFirstMedia(project);
          // const mediaUrl = assetUrlFor(mediaAsset);

          return (
            <Link
              key={project._key}
              href={`/work/${slug?.current}/${project.category}`}
              className="relative"
            >
              <MediaRenderer media={mediaAsset} />
              <div className="mt-2">{project.category}</div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

const ClientWorksPage = ({ data }: { data: Work }) => {
  const { projects } = data;

  // If there's only one project, render it directly here
  if (projects?.length === 1) {
    const projectData = projects[0];

    if (projectData._type === "preview") {
      return <ProjectPreview project={projectData as Preview} />;
    } else if (projectData._type === "caseStudy") {
      return <ProjectCaseStudy project={projectData as CaseStudy} />;
    }
  }

  // Otherwise show the project selector for multiple projects
  return <ProjectSelector data={data} />;
};

export const getStaticProps: GetStaticProps = async (context) => {
  const { client } = context.params as { client: string };
  const data = await worksApi.getWorkBySlug(client);

  return {
    props: { data },
    revalidate: 60,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const slugs = await worksApi.getAllClientSlugs();

  return {
    paths: slugs.map((slug) => ({
      params: { client: slug },
    })),
    fallback: "blocking",
  };
};

export default ClientWorksPage;
