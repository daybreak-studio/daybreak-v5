import React, { ReactElement } from "react";
import { WidgetProps } from "./Widget";

type Props = {
  children: ReactElement<WidgetProps> | Array<ReactElement<WidgetProps>>;
};

function WidgetGrid({ children }: Props) {
  return (
    <div className="grid grid-flow-col-dense grid-cols-3 narrow:grid-cols-7 wide:grid-cols-9 w-full gap-4 min-h-screen content-center">
      {children}
    </div>
  );
}

export default WidgetGrid;
