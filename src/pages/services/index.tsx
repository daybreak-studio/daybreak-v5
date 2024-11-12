import Navigation from "@/components/navigation";
import { client } from "@/sanity/lib/client";
import { GetStaticProps } from "next";
import type { Services } from "@/sanity/types";

export default function Services({ data }: { data: Services }) {
  return (
    <div>
      <div className="h-[100vh] bg-red-200"></div>
      <div className="p-96 text-center">Insert your section here.</div>
      <div className="h-[100vh] bg-blue-200"></div>
    </div>
  );
}

// Fetch data from Sanity CMS
export const getStaticProps: GetStaticProps = async () => {
  const query = `*[_type == "services"][!(_id in path('drafts.**'))][0]`;
  const data = await client.fetch(query);

  return {
    props: {
      data,
    },
    revalidate: 60,
  };
};
