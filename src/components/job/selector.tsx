import { motion } from "framer-motion";
import { ChevronRight, Briefcase } from "lucide-react";
import { EASINGS } from "@/components/animations/easings";
import { About } from "@/sanity/types";

type JobPosting = NonNullable<NonNullable<About["jobs"]>[number]>;

interface JobSelectorProps {
  jobs?: JobPosting[];
  onJobClick: (job: JobPosting) => void;
}

export default function JobSelector({ jobs, onJobClick }: JobSelectorProps) {
  return (
    <div className="hide-scrollbar h-fit max-h-[65vh] overflow-y-auto px-8 py-6">
      <motion.div
        transition={{
          duration: 1.2,
          ease: EASINGS.easeOutExpo,
        }}
        className="mb-8 flex w-full items-center justify-center p-4 text-center"
      >
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.15,
                delayChildren: 0.3,
              },
            },
          }}
          className="flex flex-col items-center justify-center space-y-2"
        >
          <motion.h2
            variants={{
              hidden: { opacity: 0, filter: "blur(10px)", y: 20 },
              visible: {
                opacity: 1,
                filter: "blur(0px)",
                y: 0,
                transition: {
                  duration: 0.6,
                  ease: EASINGS.easeOutQuart,
                },
              },
            }}
            className="text-center text-3xl font-medium text-neutral-600"
          >
            Open Positions
          </motion.h2>
          <motion.h2
            variants={{
              hidden: { opacity: 0, filter: "blur(10px)", y: 20 },
              visible: {
                opacity: 1,
                filter: "blur(0px)",
                y: 0,
                transition: {
                  duration: 0.6,
                  ease: EASINGS.easeOutQuart,
                },
              },
            }}
            className="text-center text-neutral-400"
          >
            Join our team
          </motion.h2>
        </motion.div>
      </motion.div>
      <div className="space-y-3">
        {jobs?.map((job, index) => (
          <motion.div
            key={job._key}
            initial={{ opacity: 0, filter: "blur(10px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            transition={{
              duration: 1,
              ease: EASINGS.easeOutQuart,
              delay: 0.4 + index * 0.15,
            }}
            onClick={() => onJobClick(job)}
            className="group cursor-pointer overflow-hidden rounded-[18px] border border-neutral-200 transition-all duration-200 hover:border-neutral-300 hover:bg-neutral-50"
          >
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full">
                  <Briefcase className="h-5 w-5 text-neutral-500" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-neutral-600">
                    {job.role}
                  </h3>
                  <p className="text-sm text-neutral-400">
                    {job.commitment} • {job.location}
                  </p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-neutral-400 transition-transform duration-200 group-hover:translate-x-1" />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
