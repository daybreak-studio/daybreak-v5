import React, { useState, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { GetStaticProps } from "next";
import { PortableText, PortableTextProps } from "@portabletext/react";

// Sanity imports
import { client } from "@/sanity/lib/client";
import type { Home } from "@/sanity/types";

// Component imports
import Drawer from "@/components/drawer";
import Reveal from "@/components/animations/reveal";
import { WidgetGrid } from "@/components/grid";
import Twitter from "@/components/widgets/twitter";
import Media from "@/components/widgets/media";
import Article from "@/components/article";
// Type imports
import { LayoutProps } from "@/components/grid/props";
import Navigation from "@/components/navigation";
import Layout from "@/components/layout";
import CarouselComponent from "@/components/carousel";
import { HOME_QUERY } from "@/sanity/lib/queries";
import { MediaItem } from "@/sanity/lib/media";
function transformWidgetsToLayout(widgets: Home["widgets"]) {
  if (!widgets) return [];

  return widgets.map((widget) => {
    const [w, h] = (widget.size || "1x1").split("x").map(Number);

    let content: React.ReactNode;
    switch (widget._type) {
      case "twitterWidget":
        content = (
          <Twitter
            tweet={widget.tweet || ""}
            author={widget.author || ""}
            link={widget.link || ""}
          />
        );
        break;
      case "mediaWidget":
        content = widget.media?.[0] ? <Media media={widget.media[0]} /> : null;
        break;
      default:
        content = null;
    }

    return {
      id: widget._key,
      position: { x: widget.position?.x || 0, y: widget.position?.y || 0 },
      size: { w, h },
      content,
    };
  });
}

export default function Home({ data }: { data: Home }) {
  console.log(data);
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
  // We are applying reveal animation and controlling font size.
  const components: PortableTextProps["components"] = {
    block: {
      normal: ({ children, index }) => (
        <div>
          <p className="mb-8 text-3xl text-zinc-400">{children}</p>
        </div>
      ),
    },
    types: {
      carousel: ({ value }: { value: { media: MediaItem[] } }) => {
        return <CarouselComponent media={value.media} />;
      },
    },
  };

  // Transform Sanity widgets to LayoutProps.Item[]
  const layout = transformWidgetsToLayout(data.widgets);

  return (
    <main className="relative min-h-[200vh]">
      <motion.div
        className="fixed inset-0 z-0"
        style={{
          background:
            "linear-gradient(0deg, rgba(240,240,220,1) 0%, rgba(249,221,213,1) 25%, rgba(236,236,240,1) 75%)",
        }}
      >
        <motion.div>
          <WidgetGrid
            layout={layout}
            heading="A technology first design studio"
            // debug
          />
        </motion.div>
      </motion.div>
      {/* Drawer Content */}
      {windowHeight !== null && data && (
        <Drawer windowHeight={windowHeight}>
          {/* Mission Statement */}
          {data.missionStatement && (
            <div className="p-8 md:w-7/12">
              <PortableText
                value={data.missionStatement}
                components={components}
              />
            </div>
          )}
          {/* Carousel */}
          <div className="pb-12">
            {data.media && <CarouselComponent media={data.media} />}
          </div>
          {/* About Us */}
          <div className="p-8">
            <h2 className="mb-4 text-xl text-zinc-400 md:text-2xl">About Us</h2>
            {data?.aboutUs && (
              <div className="md:w-7/12">
                <PortableText value={data.aboutUs} components={components} />
              </div>
            )}
          </div>
          {/* Newsfeed */}
          <div className="p-8">
            <h2 className="mb-4 text-xl text-zinc-400 md:mb-8 md:text-2xl">
              Newsfeed
            </h2>
            <div className="md:grid md:grid-cols-2 md:gap-6 xl:grid-cols-4">
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
  const data = await client.fetch(HOME_QUERY);
  return {
    props: {
      data,
    },
    revalidate: 60,
  };
};
