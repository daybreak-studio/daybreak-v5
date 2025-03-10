import { BaseWidget } from "../grid/base-widget";
import { ProjectWidgetTypes } from "../grid/types";
import { MediaRenderer } from "../../media-renderer";
import { useRouter } from "next/router";
import { useWidgetData } from "@/components/widgets/grid/context";
import { Clients } from "@/sanity/types";
import { getProjectFirstMedia } from "@/sanity/lib/media";
import { motion } from "framer-motion";
interface ProjectProps {
  data: ProjectWidgetTypes;
}

export default function ProjectWidget({ data }: ProjectProps) {
  const router = useRouter();
  const clients = useWidgetData<Clients[]>("clients");

  const foundClient = clients?.find(
    (client) => client._id === data.client?._ref,
  );

  if (!foundClient || !foundClient.slug?.current) return null;

  const foundProject = foundClient.projects?.find(
    (project) =>
      project._type === data.type && project.category === data.category,
  );

  if (!foundProject || !foundProject.category) {
    return null;
  }

  const mediaAsset = getProjectFirstMedia(foundProject);

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    // First navigate to the work page
    await router.push("/work");
    // Then navigate to the specific project
    router.push(
      `/work/${foundClient?.slug?.current}/${foundProject.category}`,
      undefined,
      {
        shallow: true,
      },
    );
  };

  const renderContent = () => {
    switch (data.size) {
      case "1x1":
        return (
          <div onClick={handleClick} className="cursor-pointer">
            <MediaRenderer media={mediaAsset} priority={true} />
          </div>
        );
      case "2x2":
      case "3x3":
        return (
          <div onClick={handleClick} className="group cursor-pointer">
            <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/30 to-black/0 transition-opacity duration-300 group-hover:opacity-0" />
            <MediaRenderer
              autoPlay={true}
              className="aspect-square"
              media={mediaAsset}
              priority={true}
            />
            <div className="absolute bottom-8 left-8 z-20 transition-opacity duration-300 group-hover:opacity-0">
              <h2
                className={`text-white ${data.size === "2x2" ? "text-sm" : "text-base"}`}
              >
                {foundClient.name}
              </h2>
              <h2
                className={`text-white/70 ${data.size === "2x2" ? "text-sm" : "text-base"}`}
              >
                {foundProject._type === "caseStudy" ? "Case Study" : "Preview"}
              </h2>
            </div>
          </div>
        );
    }
  };

  return (
    <BaseWidget position={data.position} size={data.size}>
      {renderContent()}
    </BaseWidget>
  );
}
