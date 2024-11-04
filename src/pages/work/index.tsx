import { GetStaticProps, GetStaticPaths } from "next";
import { worksApi } from "@/sanity/lib/work";
import Image from "next/image";
import Link from "next/link";
import { Work } from "@/sanity/types";
import { assetUrlFor } from "@/sanity/lib/builder";
import { getWorkFirstMedia } from "@/sanity/lib/media";
import { MediaRenderer } from "@/components/media-renderer";

export default function Works({ data }: { data: Work[] }) {
  // const getFirstMediaAsset = (work: Work) => {
  //   // console.log(work);
  //   if (work.projects) {
  //     const firstProject = work.projects[0];
  //     // console.log(firstProject);
  //     const firstMedia = firstProject.media?.[0];
  //     if (!firstMedia) return null;

  //     if (firstMedia._type === "mediaGroup") {
  //       // console.log(firstMedia.items?.[0]);
  //       return firstMedia.items?.[0];
  //     }

  //     if (firstMedia._type === "video" || firstMedia._type === "image") {
  //       return firstMedia;
  //     }
  //   }
  // };

  return (
    <div>
      {data.map((work) => {
        const mediaAsset = getWorkFirstMedia(work);
        // const mediaUrl = assetUrlFor(mediaAsset);

        // console.log(mediaUrl);
        // if (!mediaAsset || !mediaUrl) return null;
        // console.log(mediaUrl);

        return (
          <Link key={work._id} href={`/work/${work?.slug?.current}`}>
            <div>
              <h2>{work.name}</h2>
              <MediaRenderer media={mediaAsset} />
            </div>
          </Link>
        );
      })}
    </div>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const data = await worksApi.getAllWorks();

  return {
    props: { data },
    revalidate: 60,
  };
};
