import React, { memo } from "react";
import { MediaRenderer } from "@/components/media-renderer";
import Reveal from "@/components/animations/reveal";
import { formatDate } from "@/utils/formatDate";
import type { Home } from "@/sanity/types";

type ArticleType = NonNullable<Home["newsfeed"]>[number];

const Article = memo(({ article }: { article: ArticleType }) => {
  return (
    <Reveal
      key={article._key}
      className="mb-4 w-full break-inside-avoid rounded-3xl bg-white/50 p-2 shadow"
    >
      {/* Media Container that respects natural aspect ratio */}
      <div className="relative w-full">
        {article.media?.[0] && (
          <MediaRenderer
            media={article.media[0]}
            className="rounded-2xl"
            priority={false}
            fill={false}
          />
        )}
      </div>

      <div className="p-4">
        <h2 className="pb-4 text-sm text-zinc-400">
          {formatDate(article.date || "")}
        </h2>
        <h1 className="pb-2">{article.title}</h1>
        <h2 className="text-zinc-500">{article.description}</h2>
      </div>
    </Reveal>
  );
});

export default Article;

Article.displayName = "Article";
