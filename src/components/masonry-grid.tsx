import type { Home } from "@/sanity/types";
import Article from "@/components/article";
import { useViewport } from "@/lib/hooks/use-viewport";
import { BREAKPOINTS } from "@/lib/hooks/use-viewport";

type ArticleType = NonNullable<Home["newsfeed"]>[number];

interface MasonryGridProps {
  articles: ArticleType[];
}

const MasonryGrid: React.FC<MasonryGridProps> = ({ articles }) => {
  const { breakpoint } = useViewport();

  // Sort articles by date
  const sortedArticles = [...articles].sort((a, b) => {
    const dateA = new Date(a.date || "").getTime();
    const dateB = new Date(b.date || "").getTime();
    return dateB - dateA;
  });

  // Get column count based on viewport width
  const getColumnCount = () => {
    const width = BREAKPOINTS[breakpoint];
    if (width >= BREAKPOINTS["3xl"]) return 4; // ≥1920px
    if (width >= BREAKPOINTS.lg) return 3; // ≥1024px
    if (width >= BREAKPOINTS.md) return 2; // ≥768px
    return 1; // <768px
  };

  const columnCount = getColumnCount();
  const columns = Array.from({ length: columnCount }, (_, i) =>
    sortedArticles.filter((_, index) => index % columnCount === i),
  );

  return (
    <div className="flex w-full gap-4">
      {columns.map((column, columnIndex) => (
        <div key={columnIndex} className="flex flex-1 flex-col gap-4">
          {column.map((article) => (
            <div key={article._key}>
              <Article article={article} />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default MasonryGrid;
