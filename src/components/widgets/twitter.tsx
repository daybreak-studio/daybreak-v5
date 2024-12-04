import { useWidgetGridContext } from "@/components/grid/hooks";

interface TwitterProps {
  tweet?: string;
  author?: string;
  link?: string;
}

export default function Twitter({ tweet, author, link }: TwitterProps) {
  return (
    <div className="frame-inner flex h-full w-full flex-col bg-white/50 text-zinc-500 xl:p-6">
      <p className="mb-2 line-clamp-6 flex-grow text-sm">{tweet}</p>
      <div className="mt-auto">
        <p className="text-sm">{author}</p>
      </div>
    </div>
  );
}
