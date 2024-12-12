/* eslint-disable @next/next/no-img-element */
import { Flex, Stack } from "@sanity/ui";
import { getFileAsset, getImageAsset } from "@sanity/asset-utils";

export default function CarouselPreview(props) {
  const { media, schemaType, renderDefault } = props;
  const modifiedProps = {
    ...props,
    title: schemaType?.title,
    icon: schemaType?.icon,
  };

  const renderThumbnail = (item) => {
    if (!item.asset || !item.asset._ref) {
      console.error("Invalid asset data:", item);
      return null;
    }

    if (item._type === "imageItem") {
      const imageAsset = getImageAsset(item.asset, {
        projectId: "js0wg8n9",
        dataset: "production",
      });

      return (
        <img
          key={item._key}
          src={imageAsset ? imageAsset.url : ""}
          style={{
            width: "fit-content",
            height: "400px",
            objectFit: "contain",
          }}
          alt={item.alt}
        />
      );
    } else if (item._type === "videoItem") {
      const thumbnailUrl = `https://image.mux.com/${item.asset.playbackId}/thumbnail.jpg`;

      return (
        <img
          key={item._key}
          src={thumbnailUrl}
          style={{
            width: "fit-content",
            height: "400px",
            objectFit: "contain",
          }}
          alt={item.alt || "Video thumbnail"}
        />
      );
    }
    return null;
  };

  return (
    <Stack space={[1]}>
      {renderDefault(modifiedProps)}
      <Flex
        style={{
          gap: "8px",
          overflowX: "scroll",
        }}
      >
        {Array.isArray(media) && media.length > 0 ? (
          media.map((item) => renderThumbnail(item))
        ) : (
          <p
            style={{
              marginLeft: "1rem",
              paddingTop: "1rem",
              fontSize: "14px",
            }}
            className="ml-4 text-xs"
          >
            Double-click to add an image or video.
          </p>
        )}
      </Flex>
    </Stack>
  );
}
