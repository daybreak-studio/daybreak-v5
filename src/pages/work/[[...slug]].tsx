import { GetStaticPaths, GetStaticProps } from "next";
import { client } from "@/sanity/lib/client";
import { Work } from "@/sanity/types";
import ProjectMasonry from "@/components/project/masonry";
import ProjectSelector from "@/components/project/selector";
import ProjectPreview from "@/components/project/preview";
import ProjectCaseStudy from "@/components/project/case-study";
import { useRouter } from "next/router";
import { worksApi } from "@/sanity/lib/work";
import { useEffect } from "react";
interface WorkPageProps {
  data: Work[];
}

export default function WorkPage({ data }: WorkPageProps) {
  const router = useRouter();
  const { slug } = router.query;

  useEffect(() => {
    // Add this page to browser history when mounted
    if (!slug) {
      window.history.pushState({ path: "/work" }, "", "/work");
    }

    const handlePopState = (event: PopStateEvent) => {
      // If we're on a work item page and going back
      if (slug && event.state?.path === "/work") {
        router.push("/work", undefined, { shallow: true });
        event.preventDefault();
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [router, slug]);

  const clientSlug = Array.isArray(slug) ? slug[0] : slug;
  const projectSlug = Array.isArray(slug) ? slug[1] : undefined;

  const currentClient = data.find((work) => work.slug?.current === clientSlug);

  if (!currentClient?.projects) {
    return <ProjectMasonry data={data} />;
  }

  if (currentClient.projects.length === 1) {
    const project = currentClient.projects[0];
    return project._type === "preview" ? (
      <ProjectPreview data={currentClient} />
    ) : (
      <ProjectCaseStudy data={currentClient} />
    );
  }

  if (!projectSlug) {
    return <ProjectSelector data={currentClient} />;
  }

  const selectedProject = currentClient.projects.find(
    (project) => project.category === projectSlug,
  );

  if (!selectedProject) {
    return null;
  }

  return selectedProject._type === "preview" ? (
    <ProjectPreview data={currentClient} />
  ) : (
    <ProjectCaseStudy data={currentClient} />
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  try {
    const works: Work[] = await worksApi.getAllWorks();

    const paths = works.flatMap(
      (work) =>
        work.projects?.map((project) => ({
          params: {
            slug: [work.slug?.current || "", project.category || ""],
          },
        })) || [],
    );

    // Add the base path for /work
    paths.push({ params: { slug: [] } });

    return {
      paths,
      fallback: "blocking",
    };
  } catch (error) {
    console.error("Error fetching works:", error);
    return { paths: [], fallback: "blocking" };
  }
};

export const getStaticProps: GetStaticProps = async () => {
  try {
    const data: Work[] = await worksApi.getAllWorks();
    return {
      props: { data },
      revalidate: 60,
    };
  } catch (error) {
    console.error("Error fetching works:", error);
    return { props: { data: [] }, revalidate: 60 };
  }
};
