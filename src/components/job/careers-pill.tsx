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

// Define container animation similar to projects
const CONTAINER_ANIMATION = {
  initial: false,
  layout: true,
  transition: {
    layout: {
      duration: 0.8,
      ease: EASINGS.easeOutQuart,
    },
  },
};

// Define modal variant similar to projects
const MODAL_VARIANT = {
  className:
    "w-[90vw] max-w-[800px] md:max-h-[80vh] overflow-hidden rounded-[18px]",
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
          <motion.div
            layoutId="careers-container"
            className="frame-outer pointer-events-auto fixed top-20 z-50 overflow-hidden border border-neutral-200/50 bg-white/25 p-1 backdrop-blur-md"
            initial={{
              opacity: 0,
              backdropFilter: "blur(0px)",
              borderRadius: "18px",
            }}
            animate={{
              opacity: 1,
              backdropFilter: "blur(16px)",
              borderRadius: "18px",
            }}
            transition={{
              opacity: { duration: 0.8, ease: EASINGS.easeOutQuart },
              backdropFilter: { duration: 0.8, ease: EASINGS.easeOutQuart },
            }}
            // style={{ transformOrigin: "top center" }}
          >
            <motion.div
              className="frame-inner relative origin-top cursor-pointer rounded-[16px] bg-white/60"
              // style={{ transformOrigin: "top center" }}
            >
              <motion.div
                layoutId="careers-pill-content"
                className="flex items-center space-x-2 px-4 py-2 text-sm text-neutral-500"
              >
                <span>Careers</span>
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-neutral-500/10">
                  {jobs.length}
                </span>
              </motion.div>
            </motion.div>
          </motion.div>
        </Dialog.Trigger>
      </div>

      <AnimatePresence
        mode="popLayout"
        onExitComplete={() => {
          document.body.style.overflow = "";
          document.body.style.pointerEvents = "";
        }}
      >
        {isOpen && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild forceMount>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: 0.4,
                  ease: EASINGS.easeOutQuart,
                }}
                className="fixed z-40 bg-white/70 backdrop-blur-3xl"
              />
            </Dialog.Overlay>

            <Dialog.Content asChild forceMount>
              <motion.div
                {...CONTAINER_ANIMATION}
                layoutId="careers-container"
                className={cn(
                  "fixed inset-0 z-50 m-auto h-fit w-fit",
                  "frame-outer origin-center overflow-hidden border-[1px] border-neutral-200/50 bg-white p-1",
                  MODAL_VARIANT.className,
                )}
              >
                <motion.div
                  className="frame-inner relative h-full w-full origin-top rounded-[14px] bg-white"
                  style={{
                    transformOrigin: "top center",
                  }}
                  transition={{
                    duration: 0.7,
                    ease: EASINGS.easeOutQuart,
                  }}
                >
                  <AnimatePresence mode="wait">
                    {selectedJob ? (
                      <JobPreview key="preview" job={selectedJob} />
                    ) : (
                      <JobSelector
                        key="selector"
                        jobs={jobs}
                        onJobClick={handleJobClick}
                      />
                    )}
                  </AnimatePresence>

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
                      className="frame-inner absolute right-6 top-6 size-10 cursor-pointer appearance-none items-center justify-center rounded-full border-2 border-neutral-600/5 bg-white/50 text-neutral-500 backdrop-blur-lg transition-colors duration-300 focus:outline-none"
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
