import type { Home } from "@/sanity/types";
import Article from "@/components/article";

type ArticleType = NonNullable<Home["newsfeed"]>[number];

interface MasonryGridProps {
  articles: ArticleType[];
}

const MasonryGrid: React.FC<MasonryGridProps> = ({ articles }) => {
  // Sort articles by date if needed (assuming there's a date field)
  const sortedArticles = [...articles].sort((a, b) => {
    const dateA = new Date(a.date || "").getTime();
    const dateB = new Date(b.date || "").getTime();
    return dateB - dateA; // Sort in descending order (newest first)
  });

  return (
    <div className="3xl:columns-4 columns-1 gap-4 sm:columns-2 md:columns-2 lg:columns-3">
      {sortedArticles.map((article) => (
        <div
          key={article._key}
          className="inline-block w-full break-inside-avoid-column"
          style={
            {
              WebkitColumnBreakInside: "avoid",
              pageBreakInside: "avoid",
              breakInside: "avoid-column",
            } as React.CSSProperties
          }
        >
          <Article article={article} />
        </div>
      ))}
    </div>
  );
};

export default MasonryGrid;
