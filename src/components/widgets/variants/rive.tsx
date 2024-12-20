import { BaseWidget } from "../grid/base-widget";
import { RiveWidgetTypes } from "../grid/types";
import Rive from "@rive-app/react-canvas";

interface RiveProps {
  data: RiveWidgetTypes;
}

export default function RiveWidget({ data }: RiveProps) {
  return (
    <BaseWidget position={data.position} size={data.size}>
      {/* <Rive
        src="https://rive.app/s/nZMsa04nO062NTe40ulCzQ"
        stateMachines="bumpy"
      /> */}
      {/* <div></div> */}
      <iframe
        // allowFullScreen
        allow="autoplay"
        src={data.src}
        className="aspect-square h-full w-full"
      />
    </BaseWidget>
  );
}
