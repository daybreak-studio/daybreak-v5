import { useRouter } from "next/router";
import { RecentsWidgetTypes } from "../grid/types";
import { Clients } from "@/sanity/types";
import { useWidgetData } from "../grid/context";
import { BaseWidget } from "../grid/base-widget";
import { getProjectFirstMedia } from "@/sanity/lib/media";
import { MediaRenderer } from "@/components/media-renderer";
import { format } from "date-fns";

interface RecentsProps {
  data: RecentsWidgetTypes;
}

export default function RecentsWidget({ data }: RecentsProps) {
  const router = useRouter();
  const clients = useWidgetData<Clients[]>("clients");

  const recentClients = data.clients
    ?.map((clientRef) =>
      clients?.find((client) => client._id === clientRef._ref),
    )
    .filter(Boolean);

  if (!recentClients?.length) return null;

  const handleClick = async (clientSlug: string) => {
    await router.push(`/work/${clientSlug}`);
  };

  const getLatestProjectDate = (client: Clients) => {
    const dates = client.projects
      ?.map((project) => project.date)
      .filter(Boolean)
      .map((date) => new Date(date!))
      .sort((a, b) => b.getTime() - a.getTime());

    return dates?.length ? dates[0] : null;
  };

  return (
    <BaseWidget
      className="flex flex-col gap-1"
      position={data.position}
      size={data.size}
    >
      {recentClients.map((client) => {
        if (!client?.slug?.current) return null;

        const firstProject = client.projects?.[0];
        const mediaAsset = firstProject
          ? getProjectFirstMedia(firstProject)
          : null;

        const latestDate = getLatestProjectDate(client);

        return (
          <div
            key={client._id}
            className="frame-inner flex h-full w-full cursor-pointer items-center gap-4 bg-white/30 p-2 shadow-sm transition-all duration-300 ease-in-out hover:bg-white/90 md:p-2"
            onClick={() => handleClick(client?.slug?.current!)}
          >
            {mediaAsset && (
              <div className="aspect-square h-fit w-5/12 overflow-hidden rounded-full shadow-md md:rounded-3xl">
                <MediaRenderer media={mediaAsset} fill priority={true} />
              </div>
            )}

            <div className="flex-grow-2 flex w-full flex-col">
              <h3 className="text-xs font-medium text-neutral-600 md:text-xs 2xl:text-base">
                {client.name}
              </h3>
              {latestDate && (
                <p className="text-xs text-neutral-500/80 md:text-xs 2xl:text-base">
                  {format(latestDate, "MMMM d, yyyy")}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </BaseWidget>
  );
}
