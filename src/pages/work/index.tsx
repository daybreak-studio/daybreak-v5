import { GetStaticProps } from "next";
import { client } from "@/sanity/lib/client";
import { Work } from "@/sanity/types";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/builder";
import { fileBuilder } from "@/sanity/lib/file";

export default function Works({ data }: { data: Work[] }) {
  const getFirstMediaAsset = (work: Work) => {
    // console.log(work);
    if (work.projects) {
      const firstProject = work.projects[0];
      // console.log(firstProject);
      const firstMedia = firstProject.media?.[0];

      if (!firstMedia) return null;

      // console.log(firstMedia);

      if (firstMedia._type === "mediaGroup") {
        console.log(firstMedia.items?.[0]?.asset);
        return firstMedia.items?.[0]?.asset;
      }

      if (firstMedia._type === "video" || firstMedia._type === "image") {
        console.log(firstMedia.asset);
        return firstMedia.asset;
      }
    }
    // if (work.projects && work.projects.length > 0) {
    //   const firstProject = work.projects[0];
    // if (firstProject.media && firstProject.media.length > 0) {
    //   const firstMedia = firstProject.media[0];
    //   if (
    //     firstMedia._type === "mediaGroup" &&
    //     firstMedia.items &&
    //     firstMedia.items.length > 0
    //   ) {
    //     return firstMedia.items[0].asset;
    //   }
    // }
    // }
    // return null;
  };

  // const getMediaUrl = (asset: any) => {
  //   if (!asset) return null;
  //   if (asset._id.startsWith("image-")) {
  //     return urlFor(asset).url();
  //   } else if (asset._id.startsWith("file-")) {
  //     // return fileBuilder.file(asset).url();
  //     return fileBuilder.file(asset.asset).url();
  //   }
  //   return null;
  // };

  return (
    <div>
      {data.map((work) => {
        const mediaAsset = getFirstMediaAsset(work);

        // console.log(mediaAsset);

        // const mediaUrl = getMediaUrl(mediaAsset);

        return (
          <div key={work._id}>
            <h2>{work.name}</h2>
            {/* {mediaUrl && mediaAsset && mediaAsset.startsWith("image-") && (
              <Image
                src={mediaUrl}
                alt={work.name ?? ""}
                width={1000}
                height={1000}
              />
            )} */}
            {/* {mediaUrl && mediaAsset && mediaAsset.startsWith("file-") && (
              <video controls width="1000">
                <source src={mediaUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            )} */}
          </div>
        );
      })}
    </div>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const query = `*[_type == "work"][!(_id in path('drafts.**'))]`;

  const data = await client.fetch<Work[]>(query);

  return {
    props: {
      data,
    },
    revalidate: 60,
  };
};
