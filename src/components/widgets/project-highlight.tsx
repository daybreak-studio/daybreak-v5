import { motion } from "framer-motion";
import { MediaRenderer } from "@/components/media-renderer";
import Link from "next/link";
import { Work } from "@/sanity/types";

interface ProjectHighlightProps {
  work: Work;
  projectType: "caseStudy" | "preview";
  category: string;
}

export default function ProjectHighlight({
  work,
  projectType,
  category,
}: ProjectHighlightProps) {
  // Find the project that matches both type and category
  const project = work?.projects?.find(
    (p) => p._type === projectType && p.category === category,
  );

  if (!project || !work?.slug?.current) return null;

  // Get first media item either from mediaGroups or media array
  // const firstImage =
  //   "mediaGroups" in project
  //     ? project.mediaGroups?.[0]?.media[0]
  //     : project.media?.[0];

  return <div>Hello</div>;

  // return (
  //   <Link
  //     href={`/work/${work.slug.current}`}
  //     className="group relative h-full w-full"
  //   >
  //     {firstImage && (
  //       <div className="relative h-full w-full overflow-hidden">
  //         <MediaRenderer
  //           media={firstImage}
  //           priority
  //           fill
  //           className="transition-transform duration-700 group-hover:scale-105"
  //         />
  //         {/* Overlay with project info */}
  //         <motion.div
  //           className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/50 to-transparent p-6"
  //           initial={{ opacity: 0 }}
  //           animate={{ opacity: 1 }}
  //           transition={{ duration: 0.3 }}
  //         >
  //           <div className="text-white">
  //             <p className="text-sm uppercase tracking-wider opacity-75">
  //               {project.category}
  //             </p>
  //             <h3 className="mt-1 text-xl font-medium">
  //               {work.name} - {project.heading}
  //             </h3>
  //           </div>
  //         </motion.div>
  //       </div>
  //     )}
  //   </Link>
  // );
}
