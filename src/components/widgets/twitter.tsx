interface TwitterProps {
  tweet?: string;
  author?: string;
  link?: string;
}
import { XIcon } from "lucide-react";

export default function Twitter({ tweet, author, link }: TwitterProps) {
  return (
    <div className="frame-inner flex h-full w-full flex-col bg-white/50 p-6 text-sm text-zinc-500">
      <p className="mb-2 line-clamp-6 flex-grow">{tweet}</p>
      <div className="mt-auto">
        <p className="text-sm">{author}</p>
      </div>
    </div>
  );
}
