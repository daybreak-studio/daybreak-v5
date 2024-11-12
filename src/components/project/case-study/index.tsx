import { Work, CaseStudy } from "@/sanity/types";
import React, {
  MutableRefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import CaseStudyNav from "./components/nav";
import { useMotionValueEvent, useScroll } from "framer-motion";
import { useResizeObserver, useWindowSize } from "usehooks-ts";
import MediaGroupLayout from "./components/layout";
import * as Modal from "@/components/modal";
import { useRouter } from "next/router";
import { getProjectFirstMedia } from "@/sanity/lib/media";
import { MediaRenderer } from "@/components/media-renderer";

// Update the Info component
export default function ProjectCaseStudy({ data }: { data: Work }) {
  const router = useRouter();
  const project = data.projects?.[0] as CaseStudy;
  const [currentMediaGroup, setCurrentMediaGroup] = useState<number>(0);
  const [isViewingInfo, setIsViewingInfo] = useState(false);
  const mediaGroupRefs = useRef([]) as MutableRefObject<HTMLDivElement[]>;

  // Generate layoutId similar to preview component
  const layoutId = router.query.project
    ? `image-${data.slug?.current}-${router.query.project}`
    : `image-${data.slug?.current}`;

  // Extract the hero image
  const heroMedia = getProjectFirstMedia(project);

  const inforArr = useMemo(() => {
    return project.media?.map((mediaGroup) => {
      return {
        heading: mediaGroup.heading,
        caption: mediaGroup.caption,
      };
    });
  }, [project]);

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
    [screenOffset],
  );

  const { scrollY } = useScroll();

  const docRef = useRef() as MutableRefObject<HTMLElement>;
  useEffect(() => {
    docRef.current = document.body;
  }, []);
  const pageSize = useResizeObserver({ ref: docRef });

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest === 0) {
      setCurrentMediaGroup(0);
      setIsViewingInfo(false);
      return;
    }
    if (
      pageSize.height !== undefined &&
      latest >= pageSize.height - windowHeight - 200
    ) {
      setIsViewingInfo(false);
      return;
    }

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

  const findNextGroupWithCaption = useCallback(
    (
      startIndex: number,
      direction: 1 | -1,
      shouldSkipEmpty: boolean = false,
    ) => {
      if (!project.media) return null;
      let index = startIndex + direction;

      while (index >= 0 && index < project.media.length) {
        const mediaItem = project.media[index];

        if (mediaItem.heading && mediaItem.caption) {
          return index;
        }

        if (shouldSkipEmpty) {
          index += direction;
        } else {
          return index;
        }
      }

      return null;
    },
    [project],
  );

  const navigateToMediaGroup = useCallback(
    (groupIndex: number) => {
      const mediaGroupMeasurement = mediaGroupYPositions[groupIndex];
      if (!mediaGroupMeasurement) return;
      const halfHeight = mediaGroupMeasurement.height / 2;
      const target = mediaGroupMeasurement.anchorY + 110 + halfHeight * 0.3;
      window.scrollTo({ top: target, behavior: "smooth" });
    },
    [mediaGroupYPositions],
  );

  const handleNextMediaGroup = useCallback(() => {
    const nextGroup = findNextGroupWithCaption(
      currentMediaGroup,
      1,
      isViewingInfo,
    );
    if (nextGroup === null) return;
    navigateToMediaGroup(nextGroup);
  }, [
    currentMediaGroup,
    findNextGroupWithCaption,
    isViewingInfo,
    navigateToMediaGroup,
  ]);

  const handlePrevMediaGroup = useCallback(() => {
    const nextGroup = findNextGroupWithCaption(
      currentMediaGroup,
      -1,
      isViewingInfo,
    );
    if (nextGroup === null) return;
    navigateToMediaGroup(nextGroup);
  }, [
    currentMediaGroup,
    findNextGroupWithCaption,
    isViewingInfo,
    navigateToMediaGroup,
  ]);

  return (
    <div className="px-4 py-8 pt-48" ref={containerRef}>
      <CaseStudyNav
        currentInfoIndex={currentMediaGroup}
        highlightInfoArr={inforArr}
        onNextMediaGroup={handleNextMediaGroup}
        onPrevMediaGroup={handlePrevMediaGroup}
        canPrevMediaGroup={currentMediaGroup !== 0}
        canNextMediaGroup={
          project.media ? currentMediaGroup !== project.media.length - 1 : false
        }
        onExpand={() => setIsViewingInfo(true)}
        onCollapse={() => setIsViewingInfo(false)}
        isExpanded={isViewingInfo}
      />
      <h1 className="mb-8 py-24 text-center text-4xl">{project.heading}</h1>
      <div className="flex flex-col gap-4">
        {/* Hero Section */}
        <Modal.Item id={layoutId} className="h-screen w-full">
          <MediaRenderer
            media={heroMedia}
            className="h-full w-full object-cover"
          />
        </Modal.Item>
        {/* Remaining Media */}
        {project.media?.slice(1).map((mediaGroup, groupIndex) => {
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
                if (isViewingInfo && groupIndex === currentMediaGroup) {
                  setIsViewingInfo(false);
                  return;
                }
                e.stopPropagation();
                e.preventDefault();
                setIsViewingInfo(true);
                navigateToMediaGroup(groupIndex);
              }}
              slug={data?.slug?.current}
            />
          );
        })}
        <div className="mx-auto mb-96 mt-44 grid w-full max-w-96 grid-cols-2 gap-y-6 text-sm">
          {project.credits?.map((team, index) => {
            return (
              <React.Fragment key={index}>
                <div className="flex flex-row">
                  {team.role}
                  <div className="mx-4 h-0 flex-grow translate-y-2 border-b border-gray-900 opacity-10" />
                </div>
                <div className="opacity-50">
                  {team.names?.map((name, index) => (
                    <div key={index}>{name}</div>
                  ))}
                </div>
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
}
