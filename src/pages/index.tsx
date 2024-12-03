import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { GetStaticProps } from "next";
import { PortableText, PortableTextProps } from "@portabletext/react";
import { client } from "@/sanity/lib/client";
import type { Home } from "@/sanity/types";
import Drawer from "@/components/drawer";
import Reveal from "@/components/animations/reveal";
import { WidgetGrid } from "@/components/grid";
import Twitter from "@/components/widgets/twitter";
import Media from "@/components/widgets/media";
import Article from "@/components/article";
import CarouselComponent from "@/components/carousel";
import { HOME_QUERY } from "@/sanity/lib/queries";
import { MediaItem } from "@/sanity/lib/media";
import Footer from "@/components/footer";
import MasonryGrid from "@/components/masonry-grid";

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
    <main className="relative">
      <motion.div className="fixed inset-0">
        <WidgetGrid
          layout={layout}
          heading="A technology first design studio"
          // debug
        />
      </motion.div>
      {/* Drawer Content */}
      {windowHeight !== null && data && (
        <Drawer windowHeight={windowHeight}>
          {/* Mission Statement */}
          <div className="space-y-12 pt-20 md:p-8 md:pt-32 lg:p-32">
            <Reveal className="px-8 md:w-8/12 xl:p-0 2xl:w-7/12">
              {data.missionStatement && (
                <PortableText
                  value={data.missionStatement}
                  components={components}
                />
              )}
            </Reveal>

            {/* Carousel - Lazy load when drawer is open */}
            <Reveal>
              {data.media && <CarouselComponent media={data.media} />}
            </Reveal>

            {/* About Us - Simplified animation */}
            <Reveal className="px-8">
              <h2 className="mb-4 text-xl text-zinc-400 md:text-2xl">
                About Us
              </h2>
              {data?.aboutUs && (
                <PortableText value={data.aboutUs} components={components} />
              )}
            </Reveal>

            {/* Newsfeed with Masonry Layout */}
            <Reveal className="px-8">
              <h2 className="mb-4 text-xl text-zinc-400 md:mb-8 md:text-2xl">
                Newsfeed
              </h2>
              <MasonryGrid articles={data?.newsfeed || []} />
            </Reveal>
          </div>

          <Footer />
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
