import React, { memo } from "react";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import Reveal from "@/components/animations/reveal";
import { formatDate } from "@/utils/formatDate";
import type { Home } from "@/sanity/types";

// Define the type for an article based on the Sanity schema
type ArticleType = NonNullable<Home["newsfeed"]>[number];

const Article = memo(({ article }: { article: ArticleType }) => (
  <Reveal key={article._key} className="mb-4 w-full rounded-3xl bg-zinc-50 p-2">
    {article.image && (
      <Image
        src={urlFor(article.image)}
        className="aspect-square w-screen rounded-3xl object-cover xl:h-96"
        alt={article.title || ""}
        width={600}
        height={400}
      />
    )}
    <div className="p-4">
      <h2 className="pb-4 text-sm text-zinc-400">
        {formatDate(article.date || "")}
      </h2>
      <h1 className="pb-2">{article.title}</h1>
      <h2 className="text-zinc-500">{article.description}</h2>
    </div>
  </Reveal>
));

export default Article;

Article.displayName = "Article";
