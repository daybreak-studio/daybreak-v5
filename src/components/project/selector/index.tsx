import { MediaRenderer } from "@/components/media-renderer";
import * as Modal from "@/components/modal";
import { getProjectFirstMedia } from "@/sanity/lib/media";
import { Work } from "@/sanity/types";
import { useRouter } from "next/router";

export default function ProjectSelector({ data }: { data: Work }) {
  const router = useRouter();

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      {data.projects?.map((project) => {
        const mediaAsset = getProjectFirstMedia(project);
        if (!project.category) return null;

        const layoutId = `image-${data.slug?.current}-${project.category}`;

        return (
          <div
            key={project._key}
            onClick={() => {
              router.push(
                `/work/${data.slug?.current}/${project.category}`,
                undefined,
                { shallow: true },
              );
            }}
            className="group cursor-pointer"
          >
            <Modal.Item id={layoutId} className="overflow-hidden rounded-2xl">
              <MediaRenderer
                media={mediaAsset}
                className="h-full w-full transition-transform duration-300 group-hover:scale-105"
              />
            </Modal.Item>
            <div className="mt-4">
              <h3 className="text-lg font-medium">{project.heading}</h3>
              <p className="text-sm text-gray-500">{project.category}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
