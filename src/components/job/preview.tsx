import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { EASINGS } from "@/components/animations/easings";
import { About } from "@/sanity/types";
import { PortableText } from "@portabletext/react";

type JobPosting = NonNullable<NonNullable<About["jobs"]>[number]>;

interface JobPreviewProps {
  job?: JobPosting;
}

function InfoPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col space-y-1 rounded-2xl border border-neutral-200 bg-neutral-600/5 p-4">
      <span className="text-sm text-neutral-400">{label}</span>
      <span className="font-medium text-neutral-500">{value}</span>
    </div>
  );
}

export default function JobPreview({ job }: JobPreviewProps) {
  if (!job) return null;

  return (
    <motion.div className="flex flex-col overflow-hidden p-8 md:flex-row md:space-x-8">
      <motion.div className="order-2 w-full space-y-8 pt-4 md:order-1 md:w-2/3 md:pt-0">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASINGS.easeOutQuart }}
          className="space-y-6"
        >
          <div className="grid grid-cols-3 gap-4">
            <InfoPill label="Commitment" value={job.commitment} />
            <InfoPill label="Location" value={job.location} />
            <InfoPill label="Compensation" value={job.compensation} />
          </div>

          <div className="prose prose-neutral max-w-none">
            <PortableText value={job.body} />
          </div>
        </motion.div>
      </motion.div>

      <motion.div className="order-1 flex flex-col justify-between md:order-2 md:w-1/3">
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
          className="flex flex-col space-y-4"
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
            className="text-2xl font-medium text-neutral-500 md:text-xl lg:text-2xl"
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
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3, ease: EASINGS.easeOutQuart }}
              className="group relative flex items-center justify-between overflow-hidden rounded-2xl border-[1px] border-neutral-100 bg-neutral-600/5 p-4 transition-colors duration-500 hover:border-[1px] hover:border-neutral-600/10"
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
      </motion.div>
    </motion.div>
  );
}
