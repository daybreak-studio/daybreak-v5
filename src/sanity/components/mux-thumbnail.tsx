import React from "react";

interface MuxThumbnailProps {
  value?: string;
}

export function MuxThumbnail(props: MuxThumbnailProps) {
  const playbackId = props.value;

  if (!playbackId) {
    return null;
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`https://image.mux.com/${playbackId}/thumbnail.jpg`}
      alt="Video thumbnail"
      style={{ objectFit: "cover", width: "100%", height: "100%" }}
    />
  );
}
