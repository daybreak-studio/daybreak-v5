import React from "react";
import type { Home } from "@/sanity/types";
import Article from "@/components/article";
import Reveal from "@/components/animations/reveal";
import { HoverCard } from "@/components/hover-card";

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
        <Article key={article._key} article={article} />
      ))}
    </div>
  );
};

export default MasonryGrid;
