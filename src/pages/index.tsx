import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { GetStaticProps } from "next";
import { PortableText, PortableTextProps } from "@portabletext/react";
import { client } from "@/sanity/lib/client";
import type { Home, Clients } from "@/sanity/types";
import Reveal from "@/components/animations/reveal";
import { WidgetGrid } from "@/components/widgets/grid";
import CarouselComponent from "@/components/carousel";
import { CLIENTS_QUERY, HOME_QUERY } from "@/sanity/lib/queries";
import { MediaItem } from "@/sanity/lib/media";
import Footer from "@/components/footer";
import MasonryGrid from "@/components/masonry-grid";
import { WidgetDataProvider } from "@/components/widgets/grid/context";
import { Widget, WidgetRegistry } from "@/components/widgets/grid/types";
import TwitterWidget from "@/components/widgets/variants/twitter";
import MediaWidget from "@/components/widgets/variants/media";
import ProjectWidget from "@/components/widgets/variants/project";
import RecentsWidget from "@/components/widgets/variants/recents";
import RiveWidget from "@/components/widgets/variants/rive";
import { EASINGS } from "@/components/animations/easings";
import ScrollDrawer from "@/components/scroll-drawer";
import Lenis from "lenis";
import BlurReveal from "@/components/animations/blur";
import { urlFor } from "@/sanity/lib/image";
import Metadata from "@/components/metadata";
import TeamWidget from "@/components/widgets/variants/team";

// Register widgets specific to the home page
const homeWidgets: WidgetRegistry = {
  twitter: TwitterWidget,
  media: MediaWidget,
  project: ProjectWidget,
  recents: RecentsWidget,
  rive: RiveWidget,
  team: TeamWidget,
};

export default function Home({
  homeData,
  clientsData,
}: {
  homeData: Home;
  clientsData: Clients[];
}) {
  useEffect(() => {
    const lenis = new Lenis();
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    return () => {
      lenis.destroy();
    };
  }, []);

  // Handles text rendering for the CMS text.
  // We are applying reveal animation and controlling font size.
  const components: PortableTextProps["components"] = {
    block: {
      normal: ({ children, index }) => (
        <div>
          <p className="mb-8 text-2xl text-neutral-400 md:text-3xl xl:text-4xl xl:leading-tight 3xl:text-5xl 3xl:leading-[3.25rem]">
            {children}
          </p>
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
    <>
      <Metadata
        title="Daybreak Studio"
        description={"A technology first design studio"}
      />
      <main className="relative">
        <motion.div className="fixed inset-0">
          <div className="flex h-full flex-col items-center justify-center space-y-6 lg:space-y-8">
            <BlurReveal
              // initial={{ opacity: 0, y: 25, filter: "blur(10px)" }}
              // animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              // transition={{
              //   delay: 0.3,
              //   duration: 1,
              //   ease: EASINGS.easeOutQuart,
              // }}
              className="max-w-[16ch] text-center text-3xl font-[450] text-neutral-700/50 lg:text-3xl 2xl:text-4xl"
            >
              A (people-first) design first design studio but also technology
              only a little bit?
            </BlurReveal>
            <WidgetDataProvider
              data={{
                widgets: homeData.widgets as Widget[],
                clients: clientsData,
              }}
            >
              <WidgetGrid components={homeWidgets} />
            </WidgetDataProvider>
          </div>
        </motion.div>

        <ScrollDrawer>
          <div className="space-y-16 pt-20 md:space-y-32 xl:space-y-48">
            {/* Mission Statement */}
            <div>
              <Reveal className="px-8 pb-8 md:w-10/12 md:px-20 xl:w-9/12 xl:px-36 2xl:w-7/12">
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
            <Reveal className="px-8 md:w-10/12 md:px-20 xl:w-9/12 xl:px-36 2xl:w-7/12">
              <h2 className="mb-4 text-lg text-neutral-400 md:text-lg lg:text-2xl">
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
              <h2 className="mb-4 text-lg text-neutral-400 md:text-lg lg:text-2xl">
                Newsfeed
              </h2>
              <MasonryGrid articles={homeData?.newsfeed || []} />
            </Reveal>
          </div>

          <Footer />
        </ScrollDrawer>
      </main>
    </>
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
