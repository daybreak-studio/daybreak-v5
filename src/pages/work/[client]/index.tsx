// src/pages/work/[client]/index.tsx
import { GetStaticProps, GetStaticPaths } from "next";
import { client } from "@/sanity/lib/client";
import { CaseStudy, Preview, Work } from "@/sanity/types"; // Import the Work type
import Link from "next/link";
import { useEffect, useState } from "react";
import { assetUrlFor } from "@/sanity/lib/builder";
import Image from "next/image";
// Function to fetch work data by slug
const fetchWorkBySlug = async (slug: string): Promise<Work> => {
  const query = `*[_type == "work" && slug.current == $slug][0]`;
  const data = await client.fetch<Work>(query, { slug });
  return data;
};

// Function to fetch all client slugs
const fetchAllClientSlugs = async (): Promise<string[]> => {
  const query = `*[_type == "work"]{slug}`;
  const data = await client.fetch<{ slug: { current: string } }[]>(query);
  return data.map((work) => work.slug.current);
};

const ProjectPreview = ({ project }: { project: Preview }) => {
  console.log(project);
  return (
    <div>
      <h1>{project._type}</h1>
      <h2>{project.heading}</h2>
      <p>{project.caption}</p>
      {/* Add more project details as needed */}
    </div>
  );
};

const ProjectCaseStudy = ({ project }: { project: CaseStudy }) => {
  console.log(project);

  return (
    <div>
      <h1>{project._type}</h1>
      <h2>{project.heading}</h2>
      <p>{project.category}</p>
      {/* Add more case study details as needed */}
    </div>
  );
};

const ProjectSelector = ({ data }: { data: Work }) => {
  const { name, slug, projects } = data;
  return (
    <div>
      <h1>Select a Project Type</h1>
      <div>
        {projects?.map((project) => (
          <Link
            key={project._key}
            href={`/work/${slug?.current}/${project.category}`}
          >
            <div>{project.category}</div>
          </Link>
        ))}
      </div>
    </div>
  );
};

const ClientWorksPage = ({ data }: { data: Work }) => {
  const { name, slug, projects } = data; // Updated reference
  console.log(data);

  return (
    <div>
      {projects?.length === 1 ? (
        // Conditional rendering based on project type
        projects[0]._type === "preview" ? (
          <ProjectPreview project={projects[0] as Preview} />
        ) : projects[0]._type === "caseStudy" ? (
          <ProjectCaseStudy project={projects[0] as CaseStudy} />
        ) : null // Fallback if the type doesn't match
      ) : (
        // Render project selector if there are multiple projects
        <ProjectSelector data={data} />
      )}
    </div>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  const { client } = context.params as { client: string };
  const data = await fetchWorkBySlug(client);

  return {
    props: {
      data,
    },
    revalidate: 60,
  };
};

export const getStaticPaths = async () => {
  const slugs = await fetchAllClientSlugs();
  const paths = slugs.map((slug) => ({
    params: { client: slug },
  }));

  return {
    paths,
    fallback: "blocking",
  };
};

export default ClientWorksPage;
