// src/pages/work/[client].tsx
import { GetStaticProps, GetStaticPaths } from "next";
import { client } from "@/sanity/lib/client";
import Head from "next/head";
import { Work } from "@/sanity/types"; // Import the Work type
import router from "next/router";
import Link from "next/link";
import { useEffect, useState } from "react";

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

const ClientWorksPage = ({ data }: { data: Work }) => {
  console.log(data);
  const { name, slug, projects } = data; // Updated reference
  const [hasRedirected, setHasRedirected] = useState(false); // State to track redirection

  useEffect(() => {
    if (projects?.length === 1 && !hasRedirected) {
      // Redirect to the project type page if there's only one project
      router.replace(`/work/${slug?.current}/${projects[0].category}`);
      setHasRedirected(true); // Set the state to indicate redirection has occurred
    }
  }, [projects, slug, name, hasRedirected]);

  return (
    <div>
      <Head>
        <title>{`${name} - Works`}</title>
        <meta name="description" content={`Explore the works of ${name}.`} />
        <meta property="og:title" content={`${name} - Works`} />
        <meta
          property="og:description"
          content={`Explore the works of ${name}.`}
        />
        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content={`https://yourdomain.com/work/${data?.slug?.current}`}
        />
        <meta
          property="og:image"
          content="https://yourdomain.com/path/to/image.jpg"
        />
        {/* Replace with actual image URL */}
      </Head>
      <h1>{name}</h1>
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
