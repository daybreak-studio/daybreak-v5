// ./src/pages/index.tsx

import { SanityDocument } from "next-sanity";
import dynamic from "next/dynamic";

import { getClient } from "@/sanity/lib/client";
import { token } from "@/sanity/lib/token";
import { POSTS_QUERY } from "@/sanity/lib/queries";
import SnapArea from "@/pages/components/Snapping/SnapArea";
import SnappingProvider from "@/pages/components/Snapping/SnappingProvider";

// const PostsPreview = dynamic(() => import("@/components/PostsPreview"));

type PageProps = {
  posts: SanityDocument[];
  draftMode: boolean;
  token: string;
};

export default function Home(props: PageProps) {
  // return props.draftMode ? (
  //   // <PostsPreview posts={props.posts} />
  // ) : (
  //   // <Posts posts={props.posts} />
  // );
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
            <h3 className="text-3xl">
              Daybreak Studio creates brand, web, and software experiences by
              integrating technology to enhance human craft <br />
              <br />
              We work closely with ambitious companies to realize their vision
              for the future. Through everything we do, we aim to build works of
              design that are beautiful, intuitive, and functional. <br />
              <br />
              Design that feels right. Tech that works well.
            </h3>
          </div>

          <div className="text-zinc-400 xl:w-2/3">
            <h5 className="mb-4">About Us</h5>
            <h3 className="text-3xl">
              We’re a team of craftspeople and optimists who are eternally
              curious about new tools, big ideas, and what more we can achieve
              with technology. <br />
              <br />
              It’s right there in the name. We think tomorrow could be Earth’s
              best day yet.
            </h3>
          </div>
        </SnapArea>
      </SnappingProvider>
    </main>
  );
}

export const getStaticProps = async ({ draftMode = false }) => {
  const client = getClient(draftMode ? token : undefined);
  // const posts = await client.fetch<SanityDocument[]>(POSTS_QUERY);

  return {
    props: {
      // posts,
      draftMode,
      token: draftMode ? token : "",
    },
  };
};
