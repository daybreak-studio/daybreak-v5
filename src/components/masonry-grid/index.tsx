import React from "react";
import type { Home } from "@/sanity/types";
import Article from "@/components/article";

type ArticleType = NonNullable<Home["newsfeed"]>[number];

interface MasonryGridProps {
  articles: ArticleType[];
}

const MasonryGrid: React.FC<MasonryGridProps> = ({ articles }) => {
  return (
    <div
      className="columns-1 gap-6 space-y-6 md:columns-2 lg:columns-3 xl:columns-4"
      style={{
        columnFill: "balance",
      }}
    >
      {articles?.map((article) => (
        <div key={article._key} className="break-inside-avoid">
          <Article article={article} />
        </div>
      ))}
    </div>
  );
};

export default MasonryGrid;
