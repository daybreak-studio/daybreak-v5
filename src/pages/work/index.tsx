import { GetStaticProps, GetStaticPaths } from "next";
import { client } from "@/sanity/lib/client";
import { Work } from "@/sanity/types";
import Image from "next/image";
import { urlFor, fileBuilder } from "@/sanity/lib/builder";
import Link from "next/link";

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
        // console.log(firstMedia.items?.[0]?.asset);
        return firstMedia.items?.[0]?.asset;
      }

      if (firstMedia._type === "video" || firstMedia._type === "image") {
        // console.log(firstMedia.asset);
        return firstMedia.asset;
      }
    }
  };

  // Unified function to get media URL
  const getMediaUrl = (mediaAsset: any) => {
    // Check if the asset is an image
    if (mediaAsset._ref.startsWith("image-")) {
      return urlFor(mediaAsset).url(); // Generate URL for image
    }
    // Check if the asset is a file (video or other)
    else if (mediaAsset._ref.startsWith("file-")) {
      return fileBuilder.file(mediaAsset).url(); // Generate URL for file
    }
    return null; // Return null if the asset type is not recognized
  };

  return (
    <div>
      {data.map((work) => {
        const mediaAsset = getFirstMediaAsset(work);
        const mediaUrl = getMediaUrl(mediaAsset);
        if (!mediaAsset || !mediaUrl) return null;
        console.log(mediaUrl);

        return (
          <Link key={work._id} href={`/work/${work?.slug?.current}`}>
            <div>
              <h2>{work.name}</h2>
              {mediaAsset._ref.startsWith("image-") && (
                <Image
                  src={mediaUrl}
                  alt={work.name ?? ""}
                  width={1000}
                  height={1000}
                />
              )}
              {mediaAsset._ref.startsWith("file-") && (
                <video width="1000" autoPlay muted>
                  <source src={mediaUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              )}
            </div>
          </Link>
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
