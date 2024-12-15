import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { GetStaticProps } from "next";
import { PortableText, PortableTextProps } from "@portabletext/react";
import { client } from "@/sanity/lib/client";
import type { Home, Clients } from "@/sanity/types";
import Drawer from "@/components/drawer";
import Reveal from "@/components/animations/reveal";
import { WidgetGrid } from "@/components/widgets/grid";
import CarouselComponent from "@/components/carousel";
import { CLIENTS_QUERY, HOME_QUERY } from "@/sanity/lib/queries";
import { MediaItem } from "@/sanity/lib/media";
import Footer from "@/components/footer";
import MasonryGrid from "@/components/masonry-grid";
import { useScramble } from "use-scramble";
import { WidgetDataProvider } from "@/components/widgets/context/WidgetDataContext";
import { Widget } from "@/components/widgets/grid/types";

export default function Home({
  homeData,
  clientsData,
}: {
  homeData: Home;
  clientsData: Clients[];
}) {
  const [windowHeight, setWindowHeight] = useState<number | null>(null);

  const { ref: headingRef, replay } = useScramble({
    text: "A technology first design studio",
    speed: 1,
    playOnMount: false,
  });

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

  return (
    <main className="relative">
      <motion.div className="fixed inset-0">
        <div className="flex h-full flex-col items-center justify-center space-y-8">
          <h1
            ref={headingRef}
            onMouseOver={replay}
            onFocus={replay}
            className="max-w-[16ch] text-center text-3xl font-[450] text-zinc-400 lg:text-4xl"
          />
          <WidgetDataProvider
            data={{
              widgets: homeData.widgets as Widget[],
              clients: clientsData,
            }}
          >
            <WidgetGrid />
          </WidgetDataProvider>
        </div>
      </motion.div>
      {/* Drawer Content */}
      {windowHeight !== null && homeData && (
        <Drawer windowHeight={windowHeight}>
          {/* Mission Statement */}
          <div className="space-y-16 pt-20 md:space-y-32 xl:space-y-48">
            <div>
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
            </div>

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
              <h2 className="mb-4 text-xl text-zinc-400 md:text-2xl">
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
