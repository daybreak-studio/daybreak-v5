import { MediaRenderer } from "@/components/media-renderer";
import * as Modal from "@/components/modal";
import { getWorkFirstMedia } from "@/sanity/lib/media";
import { Work } from "@/sanity/types";
import { motion } from "framer-motion";

export default function ProjectMasonry({ data }: { data: Work[] }) {
  return (
    <div className="grid grid-cols-1 gap-8 p-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {data.map((client) => {
        const mediaAsset = getWorkFirstMedia(client);
        if (!client.slug) return null;
        return (
          <Modal.Root
            key={client._id}
            id={client.slug.current ?? ""}
            path="/work"
          >
            <Modal.Trigger className="group relative aspect-square w-full overflow-hidden rounded-2xl bg-white">
              <Modal.Item
                id={`image-${client.slug.current ?? ""}`}
                className="h-full w-full"
              >
                <MediaRenderer
                  media={mediaAsset}
                  className="h-full w-full transition-transform duration-300 group-hover:scale-105"
                />
              </Modal.Item>
            </Modal.Trigger>

            <Modal.Portal>
              <Modal.Background />
              {client.projects && client.projects.length > 1 ? (
                // Multi-project selector modal
                <Modal.Content className="relative mx-auto w-[90vw] max-w-[1200px] rounded-3xl bg-white p-8">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {/* We'll implement the selector content next */}
                  </div>
                </Modal.Content>
              ) : (
                // Single project preview/case study modal
                <Modal.Content className="relative mx-auto w-[90vw] max-w-[800px] rounded-3xl bg-white p-8">
                  <Modal.Item
                    id={`image-${client.slug.current}`}
                    className="h-full w-full"
                  >
                    <MediaRenderer
                      media={mediaAsset}
                      className="h-full w-full rounded-2xl"
                    />
                  </Modal.Item>
                </Modal.Content>
              )}
            </Modal.Portal>
          </Modal.Root>
        );
      })}
    </div>
  );
}
