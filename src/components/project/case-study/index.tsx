import { motion, animate } from "framer-motion";
import { CaseStudy } from "@/sanity/types";
import {
  useCallback,
  useEffect,
  useState,
  useMemo,
  useRef,
  Fragment,
} from "react";
import CaseStudyNav from "./components/nav";
import MediaGroup from "./components/media-group";
import { AnimationConfig } from "@/components/animations/AnimationConfig";

interface ProjectCaseStudyProps {
  data: {
    projects: CaseStudy[];
  };
  imageLayoutId: string;
}

export default function ProjectCaseStudy({ data }: ProjectCaseStudyProps) {
  const project = data.projects?.[0] as CaseStudy;
  const [activeGroupIndex, setActiveGroupIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  const scrollToGroup = useCallback((index: number) => {
    const element = document.getElementById(`media-group-${index}`);
    if (!element || !containerRef.current) return;

    const container = containerRef.current;
    const elementTop = element.offsetTop;
    const containerHeight = container.clientHeight;
    const elementHeight = element.clientHeight;
    const targetScroll = elementTop - (containerHeight - elementHeight) / 2;

    animate(container.scrollTop, targetScroll, {
      type: "spring",
      stiffness: 100,
      damping: 20,
      onUpdate: (value) => container.scrollTo(0, value),
    });
  }, []);

  const handleGroupActivate = useCallback(
    (index: number) => {
      setActiveGroupIndex(index);
      setIsZoomed(true);
      scrollToGroup(index);
    },
    [scrollToGroup],
  );

  const findNextGroupWithCaption = useCallback(
    (currentIndex: number, direction: 1 | -1) => {
      if (!project.mediaGroups) return null;
      let index = currentIndex + direction;

      while (index >= 0 && index < project.mediaGroups.length) {
        const group = project.mediaGroups[index];
        if (group.heading && group.caption) return index;
        index += direction;
      }

      return null;
    },
    [project.mediaGroups],
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!document.querySelector('[role="dialog"]')) return;

      if (e.code === "Escape") {
        e.preventDefault();
        e.stopPropagation();
        setIsZoomed(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown, true);
    return () => window.removeEventListener("keydown", handleKeyDown, true);
  }, []);

  return (
    <motion.div
      ref={containerRef}
      className="h-screen overflow-y-auto px-4 py-8 pt-48"
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
            isZoomed={isZoomed}
            onScroll={setActiveGroupIndex}
            onActivate={() => handleGroupActivate(index)}
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

      {isZoomed && project.mediaGroups?.[activeGroupIndex]?.heading && (
        <CaseStudyNav
          activeGroup={activeGroupIndex}
          groups={project.mediaGroups ?? []}
          isExpanded={isZoomed}
          onToggleExpand={() => setIsZoomed(false)}
          onNext={() => {
            const nextIndex = findNextGroupWithCaption(activeGroupIndex, 1);
            if (nextIndex !== null) scrollToGroup(nextIndex);
          }}
          onPrev={() => {
            const nextIndex = findNextGroupWithCaption(activeGroupIndex, -1);
            if (nextIndex !== null) scrollToGroup(nextIndex);
          }}
          canGoNext={findNextGroupWithCaption(activeGroupIndex, 1) !== null}
          canGoPrev={findNextGroupWithCaption(activeGroupIndex, -1) !== null}
        />
      )}
    </motion.div>
  );
}
