import Image from "next/image";
import { client } from "@/sanity/lib/client";
import { GetStaticProps } from "next";
import { urlFor } from "@/sanity/lib/image";
import type {
  SanityImageHotspot,
  SanityImageCrop,
  internalGroqTypeReferenceTo,
  Services,
} from "@/sanity/types";
import Stack from "../../components/stack/Stack";
import StackGroupVertical from "../../components/stack/StackGroupVertical";
import { useState } from "react";
import { LayoutGroup, motion } from "framer-motion";
import React from "react";
import StackGroupHorizontal from "../../components/stack/StackGroupHorizontal";

// Simplified media URL function - just handle images for now
const getMediaUrl = (mediaAsset: any) => {
  if (!mediaAsset?._ref) return null;
  return urlFor({ _ref: mediaAsset._ref, _type: "reference" });
};

type ServiceCategoryTab = {
  heading?: string;
  copy?: string;
  image?: {
    asset?: {
      _ref: string;
      _type: "reference";
      _weak?: boolean;
      [internalGroqTypeReferenceTo]?: "sanity.imageAsset";
    };
    hotspot?: SanityImageHotspot;
    crop?: SanityImageCrop;
    _type: "image";
  };
  _type: "tab";
  _key: string;
};

const ServiceCardContent = ({
  index,
  tabs,
  categoryName,
}: {
  index: number;
  tabs: ServiceCategoryTab[];
  categoryName: string;
}) => {
  const [currentTab, setCurrentTab] = useState(0);
  const currentImage = tabs[currentTab]?.image?.asset;

  if (!tabs.length) return null;

  return (
    <Stack
      className="m-1 flex max-h-[90vh] max-w-[70vw] flex-col-reverse gap-4 sm:m-4 sm:grid sm:max-w-4xl sm:grid-cols-5 md:m-8"
      index={index}
      key={index}
    >
      <div className="col-span-2 flex flex-col gap-4 max-sm:px-8 max-sm:pb-8">
        <div className="flex flex-row gap-4 text-sm">
          <LayoutGroup>
            {tabs.map((tab, tabIndex) => (
              <div key={tab._key || tabIndex}>
                <motion.button
                  className="py-2"
                  animate={{
                    opacity: tabIndex === currentTab ? 1 : 0.5,
                  }}
                  onClick={() => setCurrentTab(tabIndex)}
                >
                  {tab.heading}
                </motion.button>
                {tabIndex === currentTab && (
                  <motion.div
                    layout
                    layoutId={`tab-${index}`}
                    className="border-b-2 border-b-black"
                  />
                )}
              </div>
            ))}
          </LayoutGroup>
        </div>
        <h2 className="mt-auto text-3xl opacity-80">
          {tabs[currentTab].heading}
        </h2>
        <p className="text-sm opacity-60">{tabs[currentTab].copy}</p>
      </div>
      {currentImage && (
        <Image
          className="col-span-3 block aspect-square h-full w-full rounded-[26px] object-cover sm:rounded-2xl"
          src={getMediaUrl(currentImage) || ""}
          alt={tabs[currentTab].copy || ""}
          width={597}
          height={597}
        />
      )}
    </Stack>
  );
};

export default function Services({ data }: { data: Services }) {
  if (!data?.serviceCategories) return null;

  return (
    <div>
      <div className="h-[100vh] bg-red-200" />
      <StackGroupVertical>
        {Object.entries(data.serviceCategories).map(
          ([categoryName, category], index) => (
            <ServiceCardContent
              key={categoryName}
              index={index}
              categoryName={categoryName}
              tabs={category.tabs || []}
            />
          ),
        )}
      </StackGroupVertical>
      <div className="h-[100vh] bg-blue-200" />
      <StackGroupHorizontal>
        {Object.entries(data.serviceCategories).map(
          ([categoryName, category], index) => (
            <ServiceCardContent
              key={categoryName}
              index={index}
              categoryName={categoryName}
              tabs={category.tabs || []}
            />
          ),
        )}
      </StackGroupHorizontal>
    </div>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const query = `*[_type == "services"][!(_id in path('drafts.**'))][0]`;
  const data = await client.fetch(query);

  return {
    props: {
      data,
    },
    revalidate: 60,
  };
};
