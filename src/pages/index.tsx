import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { GetStaticProps } from "next";
import { PortableText, PortableTextProps } from "@portabletext/react";
import { client } from "@/sanity/lib/client";
import type { Home, Clients } from "@/sanity/types";
import Drawer from "@/components/drawer";
import Reveal from "@/components/animations/reveal";
import { WidgetGrid } from "@/components/grid";
import Twitter from "@/components/widgets/twitter";
import Media from "@/components/widgets/media";
import Article from "@/components/article";
import CarouselComponent from "@/components/carousel";
import { CLIENTS_QUERY, HOME_QUERY } from "@/sanity/lib/queries";
import { MediaItem } from "@/sanity/lib/media";
import Footer from "@/components/footer";
import MasonryGrid from "@/components/masonry-grid";
import Project from "@/components/widgets/project";
import { LayoutProps } from "@/components/grid/props";

function transformWidgetsToLayout(
  homeData: Home,
  clientsData: Clients[],
): LayoutProps.Item[] {
  if (!homeData?.widgets) return [];

  return homeData.widgets.map((widget) => {
    const [w, h] = (widget.size || "1x1").split("x").map(Number);

    let content: React.ReactNode;
    switch (widget._type) {
      case "twitterWidget":
        content = (
          <Twitter
            tweet={widget.tweet}
            author={widget.author}
            link={widget.link}
          />
        );
        break;
      case "mediaWidget":
        content = <Media media={widget.media?.[0]} />;
        break;
      case "projectWidget":
        content = (
          <Project
            clientsData={clientsData}
            selectedClient={widget.selectedClient}
            projectType={widget.projectType}
            projectCategory={widget.projectCategory}
          />
        );
        break;
      default:
        content = null;
    }

    return {
      id: widget._key || String(Math.random()),
      position: { x: widget.position?.x || 0, y: widget.position?.y || 0 },
      dimensions: { w, h },
      size: widget.size || "1x1",
      content,
    };
  });
}

export default function Home({
  homeData,
  clientsData,
}: {
  homeData: Home;
  clientsData: Clients[];
}) {
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
  // Corrected the argument type for transformWidgetsToLayout by wrapping clientsData in an array.
  const layout = transformWidgetsToLayout(homeData, clientsData);

  return (
    <main className="relative">
      <motion.div className="fixed inset-0">
        <WidgetGrid
          heading="A technology first <br/> design studio"
          widgets={homeData.widgets || []}
          clientsData={clientsData}
        />
      </motion.div>
      {/* Drawer Content */}
      {windowHeight !== null && homeData && (
        <Drawer windowHeight={windowHeight}>
          {/* Mission Statement */}
          <div className="space-y-12 pt-20 md:pt-32">
            <Reveal className="px-8 md:w-10/12 md:px-20 xl:px-36 2xl:w-7/12">
              {homeData.missionStatement && (
                <PortableText
                  value={homeData.missionStatement}
                  components={components}
                />
              )}
            </Reveal>

            {/* Carousel - Lazy load when drawer is open */}
            <Reveal>
              {homeData.media && <CarouselComponent media={homeData.media} />}
            </Reveal>

            {/* About Us - Simplified animation */}
            <Reveal className="px-8 md:w-10/12 md:px-20 xl:px-36 2xl:w-7/12">
              <h2 className="mb-4 text-xl text-zinc-400 md:text-2xl">
                About Us
              </h2>
              {homeData?.aboutUs && (
                <PortableText
                  value={homeData.aboutUs}
                  components={components}
                />
              )}
            </Reveal>

            {/* Newsfeed with Masonry Layout */}
            <Reveal className="px-8 pb-8 md:px-20 xl:px-36">
              <h2 className="mb-4 text-xl text-zinc-400 md:mb-8 md:text-2xl">
                Newsfeed
              </h2>
              <MasonryGrid articles={homeData?.newsfeed || []} />
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
  const [homeData, clientsData] = await Promise.all([
    client.fetch(HOME_QUERY),
    client.fetch(CLIENTS_QUERY),
  ]);

  return {
    props: {
      homeData,
      clientsData,
    },
    revalidate: 60,
  };
};
