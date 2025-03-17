import { motion, AnimatePresence } from "framer-motion";
import { EASINGS } from "@/components/animations/easings";
import { About } from "@/sanity/types";
import { useState } from "react";
import { X } from "lucide-react";
import JobSelector from "./selector";
import JobPreview from "./preview";

type JobPosting = NonNullable<NonNullable<About["jobs"]>[number]>;

interface CareersPillProps {
  jobs?: JobPosting[];
}

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
    <div className="fixed left-0 right-0 top-24 z-50 flex justify-center">
      <motion.div
        layout="size"
        layoutId="careers-container"
        className="relative overflow-hidden rounded-full bg-white/50 p-1 backdrop-blur-md"
        animate={{
          borderRadius: isOpen ? "1rem" : "9999px",
        }}
      >
        <motion.div
          layout
          className={`relative ${isOpen ? "w-[800px]" : "cursor-pointer"}`}
          onClick={() => !isOpen && setIsOpen(true)}
        >
          {!isOpen ? (
            <motion.div
              layout
              className="flex items-center space-x-2 px-4 py-2 text-sm text-neutral-500"
            >
              <span>Careers</span>
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-neutral-500/10">
                {jobs.length}
              </span>
            </motion.div>
          ) : (
            <motion.div
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: EASINGS.easeOutQuart }}
              className="relative"
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
              <motion.button
                className="absolute right-4 top-4 rounded-full p-2 text-neutral-500 hover:bg-neutral-500/10"
                onClick={handleClose}
              >
                <X className="h-4 w-4" />
              </motion.button>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}
