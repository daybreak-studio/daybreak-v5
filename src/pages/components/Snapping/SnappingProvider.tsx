// Provides context for managing snap points and their registration/unregistration.

import React, {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { SnapPoint } from "./SnapPoint";
//@ts-ignore ignore for lenis type exporting issue
import { useLenis } from "lenis/react";
import { performSnap } from "./SnapInstruction";
import { debounce } from "./utils/debounce";

type Props = {};

const SnapContext = createContext({
  registerSnapPoint: (snapPoint: SnapPoint) => {},
  unregisterSnapPoint: (snapPoint: SnapPoint) => {},
});

export const useSnapContext = () => useContext(SnapContext);

const SnappingProvider = ({ children }: PropsWithChildren<Props>) => {
  const [snapPoints, setSnapPoints] = useState([] as SnapPoint[]);
  const isUsingTouch = useRef(false);

  const lenis = useLenis();

  // Manage wheel interaction
  useEffect(() => {
    const wheelEndDebounced = debounce(() => {
      if (!lenis) return;

      const shouldSnap = !isUsingTouch.current && !lenis.isTouching;
      if (!shouldSnap) return;

      performSnap(lenis, snapPoints);
    }, 120);

    const handleWheel = () => {
      wheelEndDebounced();
      isUsingTouch.current = false;
    };
    window.addEventListener("wheel", handleWheel);
    return () => {
      window.removeEventListener("wheel", handleWheel);
    };
  }, [lenis, snapPoints]);

  // Manage touch interaction
  useEffect(() => {
    if (!lenis) return;
    const handleTouchEnd = () => {
      performSnap(lenis, snapPoints);
    };
    const handleTouchStart = () => {
      isUsingTouch.current = true;
      console.log("touch end snap");
    };
    window.addEventListener("touchend", handleTouchEnd);
    window.addEventListener("touchstart", handleTouchStart);

    return () => {
      window.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("touchstart", handleTouchStart);
    };
  }, [lenis, snapPoints]);

  // exposing adding and removing interface
  const registerSnapPoint = useCallback((snapPoint: SnapPoint) => {
    setSnapPoints((snapPoints) => {
      return [...snapPoints, snapPoint];
    });
  }, []);

  const unregisterSnapPoint = useCallback((snapPoint: SnapPoint) => {
    setSnapPoints((snapPoints) => {
      return snapPoints.filter((point) => point.id != snapPoint.id);
    });
  }, []);

  return (
    <SnapContext.Provider
      value={{
        registerSnapPoint,
        unregisterSnapPoint,
      }}
    >
      {children}
    </SnapContext.Provider>
  );
};

export default SnappingProvider;
