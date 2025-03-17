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
    <div className="space-y-4 p-4">
      <motion.div
        transition={{
          duration: 1.2,
          ease: EASINGS.easeOutExpo,
        }}
        className="flex w-full items-center justify-center p-4 text-center"
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
            className="text-center text-2xl text-neutral-600 md:text-3xl"
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
      <div className="grid grid-cols-1 gap-4 overflow-hidden md:grid-cols-2">
        {jobs?.map((job, index) => (
          <motion.div
            whileHover={{
              scale: 0.99,
            }}
            key={job._key}
            initial={{ opacity: 0, filter: "blur(10px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            transition={{
              duration: 1,
              ease: EASINGS.easeOutQuart,
              delay: 0.4 + index * 0.15,
            }}
            onClick={() => onJobClick(job)}
            className="cursor-pointer overflow-hidden"
          >
            <div className="frame-inner flex items-center overflow-hidden border border-neutral-400/10 bg-neutral-300/10 p-2 md:flex-col md:items-start md:p-1">
              <div className="frame-inner relative flex aspect-square w-20 items-center justify-center overflow-hidden bg-neutral-300/20 md:w-full">
                <Briefcase className="h-8 w-8 text-neutral-500" />
              </div>
              <div className="flex w-full p-2 pl-4 md:flex-col md:p-4">
                <div className="flex w-full items-center justify-between md:justify-start md:space-x-1 md:pb-2">
                  <h3 className="text-md capitalize text-neutral-500 md:text-xl md:font-medium">
                    {job.role}
                  </h3>
                  <ChevronRight className="h-4 w-4 text-neutral-500 md:h-5 md:w-5 md:pt-[3px]" />
                </div>
                <h4 className="hidden text-sm text-neutral-400 md:block">
                  {job.commitment} • {job.location}
                </h4>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
