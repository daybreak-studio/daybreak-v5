import * as Dialog from "@radix-ui/react-dialog";
import { motion, AnimatePresence } from "framer-motion";
import { EASINGS } from "@/components/animations/easings";
import { About } from "@/sanity/types";
import { useState } from "react";
import { X } from "lucide-react";
import JobSelector from "./selector";
import JobPreview from "./preview";
import { cn } from "@/lib/utils";

type JobPosting = NonNullable<NonNullable<About["jobs"]>[number]>;

interface CareersPillProps {
  jobs?: JobPosting[];
}

// Animation variants
const CONTAINER_ANIMATION = {
  hidden: { opacity: 0, backdropFilter: "blur(0px)" },
  visible: {
    opacity: 1,
    backdropFilter: "blur(16px)",
    transition: {
      duration: 0.4,
      ease: EASINGS.easeOutQuart,
    },
  },
  exit: {
    opacity: 0,
    backdropFilter: "blur(0px)",
    transition: {
      duration: 0.4,
      ease: EASINGS.easeOutQuart,
    },
  },
};

const CONTENT_ANIMATION = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: EASINGS.easeOutQuart,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.4,
      ease: EASINGS.easeOutQuart,
    },
  },
};
// Define modal variant similar to projects
const MODAL_VARIANT = {
  selector: "w-[90vw] max-w-[550px] overflow-hidden",
  preview: "w-[90vw] max-w-[700px] overflow-hidden",
};

export default function CareersPill({ jobs }: CareersPillProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<JobPosting | undefined>();

  const handleJobClick = (job: JobPosting) => {
    setSelectedJob(job);
  };

  const handleClose = () => {
    if (selectedJob) {
      setSelectedJob(undefined);
    } else {
      setIsOpen(false);
    }
  };

  if (!jobs?.length) return null;

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <div className="flex w-full items-center justify-center">
        <Dialog.Trigger asChild>
          <motion.button
            layoutId="container"
            className="fixed top-20 z-50 cursor-pointer overflow-hidden"
            initial="hidden"
            animate="visible"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            variants={CONTAINER_ANIMATION}
            style={{ pointerEvents: "auto" }}
          >
            <motion.div
              layoutId="content"
              className="frame-inner relative flex h-full w-full origin-top items-center space-x-2 bg-white/60 px-5 py-3 text-sm text-neutral-500"
              initial="hidden"
              animate="visible"
              variants={CONTENT_ANIMATION}
              style={{ pointerEvents: "none" }}
            >
              <span>Careers</span>
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-neutral-500/5 text-xs">
                {jobs.length}
              </span>
            </motion.div>
          </motion.button>
        </Dialog.Trigger>
      </div>

      <AnimatePresence mode="popLayout">
        {isOpen && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild forceMount>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: 0.5,
                  ease: EASINGS.easeOutQuart,
                }}
                className="fixed inset-0 z-40 backdrop-blur-3xl"
              />
            </Dialog.Overlay>

            <Dialog.Content asChild forceMount>
              <motion.div
                animate="visible"
                exit="exit"
                variants={CONTAINER_ANIMATION}
                layoutId="container"
                className={cn(
                  "fixed inset-0 z-50 m-auto flex items-center justify-center",
                  "frame-outer h-fit w-fit overflow-hidden border-[1px] border-neutral-200/50",
                  selectedJob ? MODAL_VARIANT.preview : MODAL_VARIANT.selector,
                )}
                style={{ transformOrigin: "top center" }}
              >
                <motion.div
                  animate="visible"
                  exit="exit"
                  variants={CONTENT_ANIMATION}
                  layoutId="content"
                  className="frame-inner relative h-fit w-full origin-top bg-white/60"
                >
                  {selectedJob ? (
                    <JobPreview key="preview" job={selectedJob} />
                  ) : (
                    <JobSelector
                      key="selector"
                      jobs={jobs}
                      onJobClick={handleJobClick}
                    />
                  )}

                  <Dialog.Close asChild>
                    <motion.button
                      onClick={handleClose}
                      initial={{ scale: 1 }}
                      whileHover={{ scale: 0.95 }}
                      whileTap={{ scale: 0.9 }}
                      transition={{
                        duration: 0.2,
                        ease: EASINGS.easeOutQuart,
                      }}
                      className="frame-inner absolute right-6 top-6 flex size-10 cursor-pointer appearance-none items-center justify-center rounded-full border-2 border-neutral-600/5 bg-white/50 text-neutral-500 backdrop-blur-lg transition-colors duration-300 focus:outline-none"
                    >
                      <X className="h-4 w-4" />
                    </motion.button>
                  </Dialog.Close>
                </motion.div>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}
