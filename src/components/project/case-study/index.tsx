import { motion } from "framer-motion";
import { CaseStudy } from "@/sanity/types";
import { useCallback, useEffect, useState, useMemo } from "react";
import CaseStudyNav from "./components/nav";
import MediaGroup from "./components/media-group";
import { AnimationConfig } from "@/components/animations/AnimationConfig";
import { Fragment } from "react";

interface ProjectCaseStudyProps {
  data: {
    projects: CaseStudy[];
  };
  imageLayoutId: string;
}

export default function ProjectCaseStudy({ data }: ProjectCaseStudyProps) {
  const project = data.projects?.[0] as CaseStudy;
  const [activeGroupIndex, setActiveGroupIndex] = useState<number>(0);
  const [isNavVisible, setIsNavVisible] = useState(false);
  const [isInfoVisible, setIsInfoVisible] = useState(false);

  useEffect(() => {
    const firstGroup = project.mediaGroups?.[0];
    if (firstGroup?.heading && firstGroup?.caption) {
      setIsNavVisible(true);
    }
  }, [project.mediaGroups]);

  const navigateToGroup = useCallback(
    (index: number) => {
      setActiveGroupIndex(index);

      // Check if the target group has a caption
      const targetGroup = project.mediaGroups?.[index];
      const hasCaption = !!(targetGroup?.heading && targetGroup?.caption);

      if (hasCaption) {
        // If there's a caption, show nav and expand it
        setIsNavVisible(true);
        setIsInfoVisible(true);
      } else {
        // If no caption, hide nav completely
        setIsNavVisible(false);
        setIsInfoVisible(false);
      }

      // Scroll the element into view
      const element = document.getElementById(`media-group-${index}`);
      if (element) {
        element.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    },
    [project.mediaGroups],
  );

  // Get indices of groups with captions
  const groupsWithCaptions = useMemo(() => {
    return (
      project.mediaGroups?.reduce<number[]>((acc, group, index) => {
        if (group.heading && group.caption) {
          acc.push(index);
        }
        return acc;
      }, []) ?? []
    );
  }, [project.mediaGroups]);

  // Find next captioned group after current index
  const findNextCaptionedGroup = useCallback(
    (currentIndex: number, direction: 1 | -1) => {
      if (direction === 1) {
        // Find the first caption group that comes after current index
        return groupsWithCaptions.find((index) => index > currentIndex) ?? null;
      } else {
        // Find the last caption group that comes before current index
        return (
          groupsWithCaptions.reverse().find((index) => index < currentIndex) ??
          null
        );
      }
    },
    [groupsWithCaptions],
  );

  // Handle scroll-based group tracking
  const handleGroupInView = useCallback((index: number) => {
    setActiveGroupIndex(index);
  }, []);

  // Update keyboard handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!document.querySelector('[role="dialog"]')) return;

      switch (e.code) {
        case "Escape":
          e.preventDefault();
          e.stopPropagation();
          setIsInfoVisible(false);
          break;
        case "Enter":
          e.preventDefault();
          e.stopPropagation();
          setIsInfoVisible(!isInfoVisible);
          break;
        case "ArrowDown":
        case "ArrowUp":
          e.preventDefault();
          e.stopPropagation();
          const nextIndex = findNextCaptionedGroup(
            activeGroupIndex,
            e.code === "ArrowDown" ? 1 : -1,
          );
          if (nextIndex !== null) {
            navigateToGroup(nextIndex);
          }
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown, true);
    return () => window.removeEventListener("keydown", handleKeyDown, true);
  }, [
    activeGroupIndex,
    isInfoVisible,
    findNextCaptionedGroup,
    navigateToGroup,
  ]);

  // Check if current group has caption
  const currentGroupHasCaption = useMemo(() => {
    const currentGroup = project.mediaGroups?.[activeGroupIndex];
    return !!(currentGroup?.heading && currentGroup?.caption);
  }, [project.mediaGroups, activeGroupIndex]);

  // Get current group info
  const currentGroup = project.mediaGroups?.[activeGroupIndex];

  return (
    <motion.div
      className="px-4 py-8 pt-48"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, ease: AnimationConfig.EASE_OUT }}
    >
      <motion.h1
        className="mb-8 py-24 text-center text-4xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: AnimationConfig.EASE_OUT }}
      >
        {project.heading}
      </motion.h1>

      <div className="flex flex-col gap-8">
        {project.mediaGroups?.map((group, index) => (
          <MediaGroup
            key={index}
            id={`media-group-${index}`}
            group={group}
            index={index}
            isActive={activeGroupIndex === index}
            isZoomed={isInfoVisible}
            isInfoVisible={currentGroupHasCaption}
            onScroll={handleGroupInView}
            onActivate={() => {
              navigateToGroup(index);
            }}
          />
        ))}

        {project.credits && (
          <motion.div
            className="mx-auto mb-96 mt-44 grid w-full max-w-96 grid-cols-2 gap-y-6 text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            {project.credits.map((credit, index) => (
              <Fragment key={index}>
                <div className="flex flex-row">
                  {credit.role}
                  <div className="mx-4 h-0 flex-grow translate-y-2 border-b border-gray-900 opacity-10" />
                </div>
                <div className="opacity-50">
                  {credit.names?.map((name, index) => (
                    <div key={index}>{name}</div>
                  ))}
                </div>
              </Fragment>
            ))}
          </motion.div>
        )}
      </div>

      {/* Show nav when there's a caption, with collapsed/expanded states */}
      {currentGroupHasCaption && isNavVisible && (
        <CaseStudyNav
          activeGroup={activeGroupIndex}
          groups={project.mediaGroups ?? []}
          isInfoVisible={isInfoVisible}
          onShowInfo={() => {
            setIsInfoVisible(true);
          }}
          onHideInfo={() => {
            setIsInfoVisible(false);
          }}
          onNext={() => {
            const nextIndex = findNextCaptionedGroup(activeGroupIndex, 1);
            if (nextIndex !== null) {
              navigateToGroup(nextIndex);
            }
          }}
          onPrev={() => {
            const prevIndex = findNextCaptionedGroup(activeGroupIndex, -1);
            if (prevIndex !== null) {
              navigateToGroup(prevIndex);
            }
          }}
          canGoNext={findNextCaptionedGroup(activeGroupIndex, 1) !== null}
          canGoPrev={findNextCaptionedGroup(activeGroupIndex, -1) !== null}
        />
      )}
    </motion.div>
  );
}
