import * as Dialog from "@radix-ui/react-dialog";
import { motion } from "framer-motion";
import { Clients } from "@/sanity/types";
import { useRouter } from "next/router";
import { MediaRenderer } from "@/components/media-renderer";
import { getProjectFirstMedia } from "@/sanity/lib/media";
import ProjectPreview from "@/components/project/preview";
import { Cross2Icon } from "@radix-ui/react-icons";
import { ChevronRight } from "lucide-react";
import { AnimationConfig } from "@/components/animations/AnimationConfig";

interface ProjectSelectorProps {
  data: Clients;
  imageLayoutId: string;
}

export default function ProjectSelector({
  data,
  imageLayoutId,
}: ProjectSelectorProps) {
  const router = useRouter();
  console.log(data);

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      <div className="flex w-full items-center justify-center p-4 text-center">
        <h2 className="text-center text-3xl text-zinc-600">{data.name}</h2>
      </div>
      {data.projects?.map((project) => {
        const mediaAsset = getProjectFirstMedia(project);
        if (!project.category) return null;

        const isFirstProject = project === data.projects?.[0];
        const projectLayoutId = isFirstProject ? imageLayoutId : undefined;

        return (
          <motion.div
            key={project._key}
            onClick={() => {
              router.push(
                `/work/${data.slug?.current}/${project.category}`,
                undefined,
                { shallow: true },
              );
            }}
            className="cursor-pointer"
          >
            <motion.div
              layout
              className="flex items-center justify-center space-x-4 rounded-2xl bg-zinc-100 p-3"
            >
              <motion.div layout className="relative aspect-square w-20">
                <MediaRenderer
                  fill
                  layout
                  layoutId={projectLayoutId}
                  media={mediaAsset}
                  className="rounded-xl duration-300 group-hover:scale-105"
                />
              </motion.div>
              <div className="flex w-full items-center justify-between">
                <h3 className="text-md capitalize text-zinc-700">
                  {project.category}
                </h3>
                <ChevronRight className="h-4 w-4" />
              </div>
            </motion.div>
          </motion.div>
        );
      })}
    </div>
  );
}
