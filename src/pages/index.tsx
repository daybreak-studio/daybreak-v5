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
import Navigation from "@/components/navigation";
// Type imports
import { LayoutProps } from "@/components/grid/props";

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
  const [isReady, setIsReady] = useState(false);

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
        <Reveal delay={index * 0.2}>
          <p className="mb-8 text-3xl text-zinc-400">{children}</p>
        </Reveal>
      ),
    },
  };

  // Transform Sanity widgets to LayoutProps.Item[]
  const layout = transformWidgetsToLayout(data.widgets);

  return (
    <main className="relative min-h-[200vh]">
      <motion.div
        className="fixed inset-0 z-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.25, delay: 1.6, ease: "easeInOut" }}
        style={{
          background:
            "linear-gradient(0deg, rgba(240,240,220,1) 0%, rgba(249,221,213,1) 25%, rgba(236,236,240,1) 75%)",
        }}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.6, ease: "easeInOut" }}
        >
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
  const query = `*[_type=="home"][!(_id in path('drafts.**'))][0]{
  ...,
  widgets[]{
    ...,
    _type == 'mediaWidget' => {
      "media": media[]{
        ...,
        _type,
        asset->{
          _id,
          url,
          "metadata": metadata{
            dimensions,
            lqip
          }
        }
      }
    }
  }
}`;
  const data = await client.fetch(query);
  console.log(data);

  return {
    props: {
      data,
    },
    revalidate: 60,
  };
};
