import type { Home } from "@/sanity/types";
import Article from "@/components/article";
import { useEffect, useState } from "react";

type ArticleType = NonNullable<Home["newsfeed"]>[number];

interface MasonryGridProps {
  articles: ArticleType[];
}

const MasonryGrid: React.FC<MasonryGridProps> = ({ articles }) => {
  const [columns, setColumns] = useState(3);

  // Update columns based on viewport width
  useEffect(() => {
    const updateColumns = () => {
      if (window.innerWidth >= 1920)
        setColumns(4); // 3xl
      else if (window.innerWidth >= 1024)
        setColumns(3); // lg
      else if (window.innerWidth >= 768)
        setColumns(2); // md
      else if (window.innerWidth >= 640)
        setColumns(2); // sm
      else setColumns(1); // mobile
    };

    updateColumns();
    window.addEventListener("resize", updateColumns);
    return () => window.removeEventListener("resize", updateColumns);
  }, []);

  // Sort articles by date
  const sortedArticles = [...articles].sort((a, b) => {
    const dateA = new Date(a.date || "").getTime();
    const dateB = new Date(b.date || "").getTime();
    return dateB - dateA;
  });

  // Distribute articles across columns horizontally
  const distributeArticles = () => {
    const distributedColumns: ArticleType[][] = Array.from(
      { length: columns },
      () => [],
    );

    sortedArticles.forEach((article, index) => {
      const columnIndex = index % columns;
      distributedColumns[columnIndex].push(article);
    });

    return distributedColumns;
  };

  return (
    <div className="flex w-full gap-4">
      {distributeArticles().map((column, columnIndex) => (
        <div key={columnIndex} className="flex flex-1 flex-col gap-4">
          {column.map((article) => (
            <div key={article._key} className="w-full">
              <Article article={article} />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default MasonryGrid;
