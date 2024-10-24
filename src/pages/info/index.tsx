import React, {
  MutableRefObject,
  useCallback,
  useMemo,
  useRef,
  useState,
} from "react";
import { GetStaticProps } from "next";
import { client } from "@/sanity/lib/client";
import CaseStudyNav from "./components/nav";
import { useMotionValueEvent, useScroll } from "framer-motion";
import { useResizeObserver, useWindowSize } from "usehooks-ts";
import MediaGroupLayout from "./components/media-group-layout";
// import {caseStudy}

export interface CaseStudy {
  heading: string;
  media: {
    heading: string;
    caption: string;
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
  // console.log(caseStudy);
  const [currentMediaGroup, setCurrentMediaGroup] = useState<number>(0);
  const [isViewingInfo, setIsViewingInfo] = useState(false);
  const mediaGroupRefs = useRef([]) as MutableRefObject<HTMLDivElement[]>;

  const inforArr = useMemo(() => {
    return caseStudy.media.map((mediaGroup) => {
      return {
        heading: mediaGroup.heading,
        caption: mediaGroup.caption,
      };
    });
  }, [caseStudy]);

  const containerRef = useRef() as MutableRefObject<HTMLDivElement>;
  const containerSize = useResizeObserver({ ref: containerRef });
  const { height: windowHeight, width: windowWidth } = useWindowSize();
  const screenOffset = 0.5 * windowHeight + 0.13 * windowWidth;

  const mediaGroupYPositions = useMemo(
    () =>
      mediaGroupRefs.current.map((elm) => {
        const bound = elm.getBoundingClientRect();
        return {
          anchorY: bound.y + bound.height / 2 + window.scrollY - screenOffset,
          height: bound.height || 0,
        };
      }),
    // mediaGroupBounds reacts to viewport size change
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [containerSize.height, screenOffset],
  );

  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    // find out what is the current viewing group
    let targetSection = 0;
    for (let i = 0; i < mediaGroupYPositions.length; i++) {
      if (mediaGroupYPositions[i].anchorY < latest) {
        targetSection = i;
      } else {
        break;
      }
    }

    setCurrentMediaGroup((prev) => {
      if (prev === targetSection) {
        return prev;
      }
      return targetSection;
    });
  });

  const navigateToMediaGroup = useCallback(
    (groupIndex: number) => {
      const mediaGroupMeasurement = mediaGroupYPositions[groupIndex];
      if (!mediaGroupMeasurement) return;
      const halfHeight = mediaGroupMeasurement.height / 2;
      const target = mediaGroupMeasurement.anchorY + 110 + halfHeight * 0.3;
      window.scrollTo({ top: target, behavior: "smooth" });
    },
    [mediaGroupYPositions, screenOffset],
  );

  const handleNextMediaGroup = useCallback(() => {
    navigateToMediaGroup(currentMediaGroup + 1);
  }, [currentMediaGroup, navigateToMediaGroup]);

  const handlePrevMediaGroup = useCallback(() => {
    navigateToMediaGroup(currentMediaGroup - 1);
  }, [currentMediaGroup, navigateToMediaGroup]);

  return (
    <div className="px-4 py-8 pt-48" ref={containerRef}>
      <CaseStudyNav
        currentInfoIndex={currentMediaGroup}
        highlightInfoArr={inforArr}
        onNextMediaGroup={handleNextMediaGroup}
        onPrevMediaGroup={handlePrevMediaGroup}
        canPrevMediaGroup={currentMediaGroup !== 0}
        canNextMediaGroup={currentMediaGroup !== caseStudy.media.length - 1}
        onExpand={() => setIsViewingInfo(true)}
        onCollapse={() => setIsViewingInfo(false)}
        isExpanded={isViewingInfo}
      />
      <h1 className="mb-8 py-24 text-center text-4xl">{caseStudy.heading}</h1>
      <div className="space-y-4">
        {caseStudy.media.map((mediaGroup, groupIndex) => {
          return (
            <MediaGroupLayout
              key={groupIndex}
              ref={(ref) => {
                mediaGroupRefs.current[groupIndex] = ref as HTMLDivElement;
              }}
              groupIndex={groupIndex}
              currentMediaGroup={currentMediaGroup}
              mediaGroup={mediaGroup}
              boundInfo={mediaGroupYPositions[groupIndex]}
              shouldShirnk={isViewingInfo}
              onClick={(e) => {
                if (isViewingInfo) {
                  setIsViewingInfo(false);
                  return;
                }
                e.stopPropagation();
                e.preventDefault();
                setIsViewingInfo(true);
                navigateToMediaGroup(groupIndex);
              }}
            />
          );
        })}
        <div className="h-screen"></div>
      </div>
    </div>
  );
}

// Fetch data from Sanity CMS
export const getStaticProps: GetStaticProps = async () => {
  const query = `*[_type == "work"][!(_id in path('drafts.**'))][1] {
    "caseStudy": projects[_type == 'caseStudy'][0] {
      ...,
      media[] {
        _type,
        _key,
        heading,
        caption,
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
