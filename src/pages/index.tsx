import { GetStaticProps } from "next";
import { PortableText } from "@portabletext/react";
import { client } from "@/sanity/lib/client";
import SnapArea from "@/pages/components/Snapping/SnapArea";
import SnappingProvider from "@/pages/components/Snapping/SnappingProvider";

// Define a type for your home page data
type HomePageData = {
  missionStatement: any;
  // Add other fields from your home document here
  // For example:
  // title: string;
  // description: string;
  // featuredImage: any;
  // Add any other fields you have in your home document
};

type HomePageProps = {
  data: HomePageData;
};

export default function Home({ data }: HomePageProps) {
  return (
    <main
      style={{
        background:
          "linear-gradient(0deg, rgba(249,242,221,1) 60%, rgba(249,221,213,1) 80%, rgba(168,172,185,1) 100%)",
      }}
    >
      <SnappingProvider>
        <div className="flex h-screen items-center justify-center">
          <h1 className="text-5xl">[Widget]</h1>
        </div>

        <SnapArea className="h-[200vh] rounded-[2rem] bg-white p-8 drop-shadow-2xl">
          <div className="mb-24 text-zinc-400 xl:w-2/3">
            <PortableText value={data.missionStatement} />
          </div>

          {/* You can now use other fields from data here */}
          {/* For example: */}
          {/* <h1>{data.title}</h1> */}
          {/* <p>{data.description}</p> */}
          {/* Add more components using the data as needed */}

          {/* Rest of your component */}
        </SnapArea>
      </SnappingProvider>
    </main>
  );
}

export const getStaticProps: GetStaticProps<HomePageProps> = async () => {
  const query = `*[_type == "home"][0]`;
  const data = await client.fetch(query);

  return {
    props: {
      data,
    },
    revalidate: 60, // Revalidate every 60 seconds
  };
};
