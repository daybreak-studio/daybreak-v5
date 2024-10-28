// import { useState, useEffect } from "react";
// import { useRouter } from "next/router";
// import { motion, AnimatePresence } from "framer-motion";
// import { GetStaticProps } from "next";
// import { Work } from "@/types/work";
// import ClientTile from "@/components/client-tile";
// import PreviewModal from "@/components/preview-modal";
// import CaseStudy from "@/components/case-study";
// import { getWorks, getWork } from "@/lib/sanity.client";

// interface WorksPageProps {
//   works: Work[];
// }

// export default function WorksPage({ works }: WorksPageProps) {
//   const router = useRouter();
//   const { clientName, projectType } = router.query;
//   const [selectedWork, setSelectedWork] = useState<Work | null>(null);
//   const [selectedProject, setSelectedProject] = useState<
//     Work["projects"][number] | null
//   >(null);

//   useEffect(() => {
//     if (clientName && !selectedWork) {
//       getWork(clientName as string).then(setSelectedWork);
//     }
//   }, [clientName]);

//   useEffect(() => {
//     if (selectedWork && projectType) {
//       const project = selectedWork.projects.find(
//         (p) => p.category === projectType,
//       );
//       setSelectedProject(project || null);
//     }
//   }, [selectedWork, projectType]);

//   const handleTileClick = (work: Work) => {
//     setSelectedWork(work);
//     if (work.projects.length === 1) {
//       const project = work.projects[0];
//       router.push(
//         `/works/${work.slug?.current}/${project.category}`,
//         undefined,
//         { shallow: true },
//       );
//     } else {
//       router.push(`/works/${work.slug?.current}`, undefined, { shallow: true });
//     }
//   };

//   const handleProjectSelect = (project: Work["projects"][number]) => {
//     setSelectedProject(project);
//     router.push(
//       `/works/${selectedWork?.slug?.current}/${project.category}`,
//       undefined,
//       { shallow: true },
//     );
//   };

//   const handleClose = () => {
//     setSelectedWork(null);
//     setSelectedProject(null);
//     router.push("/works", undefined, { shallow: true });
//   };

//   return (
//     <div className="relative">
//       <motion.div className="grid grid-cols-3 gap-4 p-4">
//         {works.map((work) => (
//           <ClientTile
//             key={work._id}
//             work={work}
//             onClick={() => handleTileClick(work)}
//           />
//         ))}
//       </motion.div>
//       <AnimatePresence>
//         {selectedWork && !selectedProject && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
//           >
//             <div className="rounded-lg bg-white p-4">
//               <h2 className="mb-4 text-2xl font-bold">{selectedWork.name}</h2>
//               {selectedWork.projects.map((project) => (
//                 <button
//                   key={project._key}
//                   onClick={() => handleProjectSelect(project)}
//                   className="block w-full p-2 text-left hover:bg-gray-100"
//                 >
//                   {project.heading}
//                 </button>
//               ))}
//               <button
//                 onClick={handleClose}
//                 className="mt-4 rounded bg-gray-200 px-4 py-2"
//               >
//                 Close
//               </button>
//             </div>
//           </motion.div>
//         )}
//         {selectedProject && selectedProject._type === "preview" && (
//           <PreviewModal preview={selectedProject} onClose={handleClose} />
//         )}
//         {selectedProject && selectedProject._type === "caseStudy" && (
//           <motion.div
//             initial={{ opacity: 0, y: 50 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: 50 }}
//             className="fixed inset-0 overflow-y-auto bg-white"
//           >
//             <CaseStudy project={selectedProject} onClose={handleClose} />
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// }

// export const getStaticProps: GetStaticProps<WorksPageProps> = async () => {
//   const works = await getWorks();
//   return { props: { works } };
// };
