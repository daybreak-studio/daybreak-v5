import React, { useState, useEffect } from "react";
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

// export interface Position {
//   x: number;
//   y: number;
// }

// export interface TwitterWidget {
//   _key: string;
//   _type: "twitterWidget";
//   size: string;
//   position: Position;
//   tweet: string;
//   author: string;
//   link: string;
// }

// export interface MediaWidget {
//   _key: string;
//   _type: "mediaWidget";
//   size: string;
//   position: Position;
//   media: {
//     _type: "image" | "file";
//     asset: {
//       _ref: string;
//     };
//   }[];
// }

// export type Widget = TwitterWidget | MediaWidget;

// export interface Home {
//   missionStatement?: any[];
//   aboutUs?: any[];
//   newsfeed?: any[];
//   widgets?: Widget[];
// }

// Home layout configuration
// const homeLayout: LayoutProps.Item[] = [
//   {
//     id: "1",
//     position: { x: 1, y: 0 },
//     size: { w: 1, h: 1 },
//     content: <Twitter />,
//   },
//   {
//     id: "2",
//     position: { x: 0, y: 1 },
//     size: { w: 2, h: 2 },
//     content: "",
//   },
//   {
//     id: "3",
//     position: { x: 2, y: 0 },
//     size: { w: 3, h: 3 },
//     content: "",
//   },
//   {
//     id: "4",
//     position: { x: 5, y: 0 },
//     size: { w: 2, h: 2 },
//     content: "",
//   },
//   {
//     id: "5",
//     position: { x: 5, y: 2 },
//     size: { w: 1, h: 1 },
//     content: "",
//   },
// ];

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

  // Transform Sanity widgets to LayoutProps.Item[]
  const layout = transformWidgetsToLayout(data.widgets);
  console.log(layout);
  return (
    <main className="relative min-h-[200vh]">
      <div
        className="fixed inset-0 z-0"
        style={{
          background:
            "linear-gradient(0deg, rgba(240,240,220,1) 0%, rgba(249,221,213,1) 25%, rgba(236,236,240,1) 75%)",
        }}
      >
        <WidgetGrid
          layout={layout}
          heading="A technology first design studio"
          // debug
        />
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
