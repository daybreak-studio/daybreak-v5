import React from "react";
import { GetStaticProps } from "next";
import { client } from "@/sanity/lib/client";
import Image from "next/image";
// import {caseStudy}

interface CaseStudy {
  heading: string;
  media: {
    items: {
      _type: "image" | "file";
      asset: {
        url: string;
      };
    }[];
  }[];
}

// Update the Info component
export default function Info({ caseStudy }: { caseStudy: CaseStudy }) {
  console.log(caseStudy);
  return (
    <div className="px-4 py-8 pt-48">
      <h1 className="mb-8 py-24 text-center text-4xl">{caseStudy.heading}</h1>
      <div className="space-y-4">
        {caseStudy.media.map((mediaGroup, groupIndex) => {
          return (
            <div
              key={groupIndex}
              className="grid grid-cols-1 gap-4 md:grid-cols-2"
            >
              {mediaGroup.items.map((item, itemIndex) => {
                const isSingleItem = mediaGroup.items.length === 1;
                if (item._type === "image") {
                  gi;
                  return (
                    <Image
                      key={`${groupIndex}-${itemIndex}`}
                      className={`relative w-full ${isSingleItem && "md:col-span-2"} h-full w-full rounded-lg object-cover`}
                      src={item.asset.url}
                      alt="Case Study Image"
                      width={2000}
                      height={2000}
                      priority
                    />
                  );
                } else if (item._type === "file") {
                  return (
                    <video
                      key={`${groupIndex}-${itemIndex}`}
                      className={`h-full w-full rounded-lg ${isSingleItem && "md:col-span-2"}`}
                      src={item.asset.url}
                      autoPlay
                      muted
                    />
                  );
                }
                return null;
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Fetch data from Sanity CMS
export const getStaticProps: GetStaticProps = async () => {
  const query = `*[_type == "work"][!(_id in path('drafts.**'))][0] {
    "caseStudy": projects[_type == 'caseStudy'][0] {
      ...,
      media[] {
        _type,
        _key,
        items[] {
          _type,
          _key,
          asset-> {
            url
          }
        }
      }
    }
}`;

  const data = await client.fetch(query);
  console.log(data.caseStudy);

  return {
    props: {
      caseStudy: data.caseStudy || null,
    },
    revalidate: 60,
  };
};
