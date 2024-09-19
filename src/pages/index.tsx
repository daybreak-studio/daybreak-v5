import React, { useState, useEffect } from "react";
import { GetStaticProps } from "next";
import Image from "next/image";
import { PortableText, PortableTextProps } from "@portabletext/react";

// Sanity imports
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import type { Home } from "@/sanity/types";

// Component imports
import Drawer from "@/pages/(components)/drawer";
import Reveal from "@/components/animations/reveal";
import { WidgetGrid } from "@/pages/(components)/grid";
import Twitter from "@/pages/(components)/widgets/twitter";
import Article from "@/pages/(components)/article"; // Add this import

// Utility imports
import { formatDate } from "@/utils/formatDate";

// Type imports
import { LayoutProps } from "@/pages/(components)/grid/props";

// Home layout configuration
const homeLayout: LayoutProps.Item[] = [
  {
    id: "1",
    position: { x: 0, y: 0 },
    size: { w: 2, h: 1 },
    content: <Twitter />,
  },
  {
    id: "2",
    position: { x: 0, y: 1 },
    size: { w: 2, h: 2 },
    content: "",
  },
  {
    id: "3",
    position: { x: 2, y: 0 },
    size: { w: 3, h: 3 },
    content: "",
  },
  {
    id: "4",
    position: { x: 5, y: 0 },
    size: { w: 2, h: 2 },
    content: "",
  },
  {
    id: "5",
    position: { x: 5, y: 2 },
    size: { w: 1, h: 1 },
    content: "",
  },
];

export default function Home({ data }: { data: Home }) {
  const [windowHeight, setWindowHeight] = useState<number | null>(null);

  // Handles updates for window height.
  useEffect(() => {
    const updateHeight = () => {
      setWindowHeight(window.innerHeight);
    };
    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  // Handles text rendering for the CMS text.
  //We are applying reveal animation and controlling font size.
  const components: PortableTextProps["components"] = {
    block: {
      normal: ({ children, index }) => (
        <Reveal delay={index * 0.2}>
          <p className="mb-8 text-3xl text-zinc-400">{children}</p>
        </Reveal>
      ),
    },
  };

  return (
    <main className="relative min-h-[200vh]">
      <div
        className="fixed inset-0 z-0"
        style={{
          background:
            "linear-gradient(0deg, rgba(240,240,220,1) 0%, rgba(249,221,213,1) 25%, rgba(236,236,240,1) 75%)",
        }}
      >
        <WidgetGrid layout={homeLayout} debug />
      </div>
      {/* Drawer Content */}
      {windowHeight !== null && data && (
        <Drawer windowHeight={windowHeight}>
          {/* Mission Statement */}
          <div className="p-12">
            {data.missionStatement && (
              <Reveal>
                <div className="mb-64 md:w-7/12">
                  <PortableText
                    value={data.missionStatement}
                    components={components}
                  />
                </div>
              </Reveal>
            )}
            {/* About Us */}
            <Reveal>
              <h2 className="mb-4 text-xl text-zinc-400">About Us</h2>
              {data?.aboutUs && (
                <div className="mb-64 md:w-7/12">
                  <PortableText value={data.aboutUs} components={components} />
                </div>
              )}
            </Reveal>
            {/* Newsfeed */}
            <Reveal>
              <h2 className="mb-4 text-xl text-zinc-400">Newsfeed</h2>
            </Reveal>
            <div className="md:grid md:grid-cols-2 md:gap-6 xl:grid-cols-3">
              {data?.newsfeed?.map((article) => (
                <Article key={article._key} article={article} />
              ))}
            </div>
          </div>
        </Drawer>
      )}
    </main>
  );
}

// Fetch data from Sanity CMS
export const getStaticProps: GetStaticProps = async () => {
  const query = `*[_type=="home"][!(_id in path('drafts.**'))][0]`;
  const data = await client.fetch(query);
  console.log(data);

  return {
    props: {
      data,
    },
    revalidate: 60,
  };
};
