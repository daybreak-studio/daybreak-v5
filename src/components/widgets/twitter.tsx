import { useWidgetGridContext } from "@/components/grid/hooks";

interface TwitterProps {
  tweet: string;
  author: string;
  link: string;
}

export default function Twitter({ tweet, author, link }: TwitterProps) {
  const { size } = useWidgetGridContext();

  return (
    <div className="flex h-full w-full flex-col overflow-hidden p-4 text-zinc-500 xl:p-6">
      <p className="mb-2 line-clamp-6 flex-grow text-sm">{tweet}</p>
      <div className="mt-auto">
        <p className="text-sm">{author}</p>
        {/* <a
          href={link}
          className="text-xs text-blue-500 hover:underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          View on Twitter
        </a> */}
      </div>
    </div>
  );
}
