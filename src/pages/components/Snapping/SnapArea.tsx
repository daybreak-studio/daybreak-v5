// Defines a component that automatically registers and unregisters snap points for its children.

import React, { HTMLProps, useEffect, useRef } from "react";
import { createSnapPoint, updateSnapPoint } from "./SnapPoint";
import { useSnapContext } from "./SnappingProvider";

const SnapArea: React.FC<HTMLProps<HTMLDivElement>> = ({
  children,
  ...props
}) => {
  const elmRef = useRef<HTMLDivElement>(null);
  const {
    registerSnapPoint: addSnapPoint,
    unregisterSnapPoint: removeSnapPoint,
  } = useSnapContext();

  useEffect(() => {
    const elm = elmRef.current;
    if (!elm) return;

    const snapPoint = createSnapPoint(elm);
    addSnapPoint(snapPoint);

    const handleResize = () => {
      updateSnapPoint(snapPoint);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      removeSnapPoint(snapPoint);
    };
  }, [addSnapPoint, removeSnapPoint]);

  return (
    <div ref={elmRef} {...props}>
      {children}
    </div>
  );
};

export default SnapArea;
