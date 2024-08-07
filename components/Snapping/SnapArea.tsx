import React, { HTMLProps, MutableRefObject, useEffect, useRef } from "react";
import { createSnapPoint, updateSnapPoint } from "./SnapPoint";
import { useSnapContext } from "./SnappingProvider";

type Props = HTMLProps<HTMLDivElement> & {};

const SnapArea = ({ children, ...props }: React.PropsWithChildren<Props>) => {
  const elmRef = useRef() as MutableRefObject<HTMLDivElement>;
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
  }, [addSnapPoint, elmRef, removeSnapPoint]);
  return <div ref={elmRef} {...props}>{children}</div>;
};

export default SnapArea;
