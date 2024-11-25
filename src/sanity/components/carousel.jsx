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

    if (item._type === "image") {
      const imageAsset = getImageAsset(item, {
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
    } else if (item._type === "video") {
      const videoAsset = getFileAsset(item, {
        projectId: "js0wg8n9",
        dataset: "production",
      });

      if (!videoAsset) {
        console.error("Failed to resolve video asset:", item);
        return null;
      }

      const videoUrl = videoAsset.url;

      return (
        <video
          onClick={() => video.play()}
          key={item._key}
          src={videoUrl}
          style={{
            width: "fit-content",
            height: "400px",
            objectFit: "cover",
          }}
          controls
          playsInline
        >
          <source src={videoUrl} type="video/mp4" />
        </video>
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
