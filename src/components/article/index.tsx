import React, { memo } from "react";
import { MediaRenderer } from "@/components/media-renderer";
import Reveal from "@/components/animations/reveal";
import { formatDate } from "@/utils/formatDate";
import type { Home } from "@/sanity/types";
import { HoverCard } from "../hover-card";

type ArticleType = NonNullable<Home["newsfeed"]>[number];

const Article = memo(({ article }: { article: ArticleType }) => {
  return (
    <Reveal key={article._key}>
      <HoverCard className="mb-4 w-full break-inside-avoid">
        {/* Media Container that respects natural aspect ratio */}
        <div>
          {article.media?.[0] && (
            <MediaRenderer
              fill={false}
              media={article.media[0]}
              className="frame-inner max-h-64"
              priority={false}
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
      </HoverCard>
    </Reveal>
  );
});

export default Article;

Article.displayName = "Article";
