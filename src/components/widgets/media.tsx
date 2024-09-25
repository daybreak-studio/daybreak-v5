import { useWidgetGridContext } from "@/components/grid/hooks";
import Image from "next/image";

export default function MediaWidget({ media }: { media: any }) {
  const { size } = useWidgetGridContext();
  return (
    <>
      <div className="h-full w-full">
        <Image
          src={media.asset.url}
          alt={media.asset.alt}
          width={media.asset.width}
          height={media.asset.height}
        />
      </div>
    </>
  );
}
