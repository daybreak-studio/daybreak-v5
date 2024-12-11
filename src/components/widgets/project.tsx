import { motion } from "framer-motion";
import { MediaRenderer } from "@/components/media-renderer";
import Link from "next/link";
import { Clients, Home } from "@/sanity/types";
import { getProjectFirstMedia } from "@/sanity/lib/media";
import { useWidgetGridContext } from "@/components/grid/hooks";

interface ProjectProps {
  clientsData: Clients[];
  selectedClient?: {
    _ref: string;
    _type: string;
  };
  projectType?: "caseStudy" | "preview" | undefined;
  projectCategory?: string | undefined;
}

export default function Project({
  clientsData,
  selectedClient,
  projectType,
  projectCategory,
}: ProjectProps) {
  const { dimensions, size } = useWidgetGridContext();

  const foundClient =
    selectedClient?._ref &&
    clientsData.find((client) => client._id === selectedClient._ref);

  if (!foundClient) return <ErrorWidget message="Client not found" />;

  const foundProject = foundClient?.projects?.find(
    (project) =>
      project._type === projectType && project.category === projectCategory,
  );

  if (!foundProject || !foundProject.category || !foundClient.slug?.current) {
    return <ErrorWidget message="Invalid project data" />;
  }

  const mediaAsset = getProjectFirstMedia(foundProject);

  // Determine the widget class based on size

  // Render based on widget size
  switch (size) {
    case "1x1":
      return (
        <div className="h-full w-full">
          <Link
            href={`/work/${foundClient.slug.current}/${foundProject.category}`}
          >
            <MediaRenderer
              className="frame-inner absolute inset-0"
              fill
              media={mediaAsset}
            />
          </Link>
        </div>
      );
    case "2x2":
    case "3x3":
      return (
        <div className="h-full w-full">
          <Link
            href={`/work/${foundClient.slug.current}/${foundProject.category}`}
          >
            <MediaRenderer className="frame-inner" fill media={mediaAsset} />
            <div className="absolute bottom-8 left-8 z-20">
              <h2 className="text-sm text-white">{foundClient.name}</h2>
              <h2 className="text-sm text-white/70">
                {foundProject._type === "caseStudy" ? "Case Study" : "Preview"}
              </h2>
            </div>
          </Link>
        </div>
      );
    default:
      return <ErrorWidget message="Unsupported widget size" />;
  }
}

function ErrorWidget({ message }: { message: string }) {
  return (
    <div className="flex h-full w-full items-center justify-center bg-gray-100">
      <p className="text-sm text-gray-500">{message}</p>
    </div>
  );
}
