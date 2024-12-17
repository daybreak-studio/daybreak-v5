import type { Home } from "@/sanity/types";
import Article from "@/components/article";

type ArticleType = NonNullable<Home["newsfeed"]>[number];

interface MasonryGridProps {
  articles: ArticleType[];
}

const MasonryGrid: React.FC<MasonryGridProps> = ({ articles }) => {
  return (
    <div
      className="columns-1 gap-4 space-y-4 sm:columns-2 sm:gap-4 sm:space-y-4 lg:columns-3 xl:columns-4"
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
