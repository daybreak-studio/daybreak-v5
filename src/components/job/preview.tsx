import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { EASINGS } from "@/components/animations/easings";
import { About } from "@/sanity/types";
import { PortableText } from "@portabletext/react";
import { memo } from "react";

type JobPosting = NonNullable<NonNullable<About["jobs"]>[number]>;

interface JobPreviewProps {
  job?: JobPosting;
}

function InfoPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col space-y-1 rounded-full border border-neutral-200 bg-neutral-50 p-4">
      <span className="text-sm text-neutral-400">{label}</span>
      <span className="font-medium text-neutral-600">{value}</span>
    </div>
  );
}

export default function JobPreview({ job }: JobPreviewProps) {
  if (!job) return null;

  return (
    <motion.div className="hide-scrollbar h-[65vh] w-full overflow-y-auto p-8">
      <div className="mx-auto max-w-3xl space-y-8">
        {/* Header */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.2,
                delayChildren: 0.1,
              },
            },
          }}
          className="mb-6 space-y-4"
        >
          <motion.h2
            variants={{
              hidden: { opacity: 0, y: 20, filter: "blur(8px)" },
              visible: {
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
                transition: {
                  duration: 1,
                  ease: EASINGS.easeOutQuart,
                },
              },
            }}
            className="text-3xl font-medium text-neutral-600"
          >
            {job.role}
          </motion.h2>

          {job.link && (
            <motion.a
              href={job.link}
              target="_blank"
              rel="noopener noreferrer"
              variants={{
                hidden: { opacity: 0, filter: "blur(8px)", y: 20 },
                visible: {
                  opacity: 1,
                  filter: "blur(0px)",
                  y: 0,
                  transition: {
                    duration: 1,
                    ease: EASINGS.easeOutQuart,
                  },
                },
              }}
              whileHover={{ scale: 1.005 }}
              transition={{ duration: 0.3, ease: EASINGS.easeOutQuart }}
              className="group flex items-center justify-between overflow-hidden rounded-[18px] border border-neutral-200 bg-neutral-50 p-4 transition-colors duration-500 hover:border-neutral-300 hover:bg-white"
            >
              <div className="relative h-[16px] overflow-hidden">
                <div className="flex flex-col transition-transform duration-300 ease-out group-hover:-translate-y-[16px]">
                  <span className="text-xs leading-4">Apply now</span>
                  <span className="text-xs leading-4">Submit application</span>
                </div>
              </div>
              <ArrowUpRight className="h-4 w-4 text-neutral-400 transition-all duration-200 group-hover:rotate-45" />
            </motion.a>
          )}
        </motion.div>

        {/* Info Pills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASINGS.easeOutQuart }}
        >
          <div className="grid grid-cols-3 gap-4">
            <InfoPill label="Commitment" value={job.commitment ?? ""} />
            <InfoPill label="Location" value={job.location ?? ""} />
            <InfoPill label="Compensation" value={job.compensation ?? ""} />
          </div>
        </motion.div>

        {/* Job Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASINGS.easeOutQuart, delay: 0.2 }}
          className="prose prose-neutral max-w-none pb-12"
        >
          <PortableText value={job.body || []} />
        </motion.div>
      </div>
    </motion.div>
  );
}
