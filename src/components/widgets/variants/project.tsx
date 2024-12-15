import { BaseWidget } from "../grid/base-widget";
import { ProjectWidget } from "../grid/types";
import { MediaRenderer } from "../../media-renderer";
import Link from "next/link";
import { useWidgetData } from "@/components/widgets/context/WidgetDataContext";
import { Clients } from "@/sanity/types";
import { getProjectFirstMedia } from "@/sanity/lib/media";

interface ProjectProps {
  data: ProjectWidget;
}

export default function Project({ data }: ProjectProps) {
  const clients = useWidgetData<Clients[]>("clients");

  const foundClient = clients?.find(
    (client) => client._id === data.client?._ref,
  );

  console.log(foundClient);

  if (!foundClient || !foundClient.slug?.current) return null;

  const foundProject = foundClient.projects?.find(
    (project) =>
      project._type === data.type && project.category === data.category,
  );

  if (!foundProject || !foundProject.category) {
    return null;
  }

  const mediaAsset = getProjectFirstMedia(foundProject);

  const renderContent = () => {
    switch (data.size) {
      case "1x1":
        return (
          <Link
            href={`/work/${foundClient?.slug?.current}/${foundProject.category}`}
          >
            <MediaRenderer className="frame-inner" fill media={mediaAsset} />
          </Link>
        );
      case "2x2":
      case "3x3":
        return (
          <Link
            href={`/work/${foundClient?.slug?.current}/${foundProject.category}`}
          >
            <MediaRenderer className="frame-inner" fill media={mediaAsset} />
            <div className="absolute bottom-8 left-8 z-20">
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
          </Link>
        );
    }
  };

  return (
    <BaseWidget position={data.position} size={data.size}>
      {renderContent()}
    </BaseWidget>
  );
}
