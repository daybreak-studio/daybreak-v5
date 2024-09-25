import { useWidgetGridContext } from "@/components/grid/hooks";

interface TwitterProps {
  tweet: string;
  author: string;
  link: string;
}

export default function Twitter({ tweet, author, link }: TwitterProps) {
  const { size } = useWidgetGridContext();
  return (
    <div className="">
      <h1>{tweet}</h1>
      <h1>{author}</h1>
      <h1>{link}</h1>
    </div>
  );
}
