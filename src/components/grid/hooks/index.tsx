import { GridProps } from "../props";
import { createContext, useContext } from "react";
import { useState, useEffect } from "react";

export const WidgetGridContext = createContext<GridProps.Context | undefined>(
  undefined,
);

//TODO: Add types for breakpoints
export const useWidgetGridContext = () => {
  const context = useContext(WidgetGridContext);
  if (!context) {
    throw new Error("useWidgetGridContext must be used within a GridProvider");
  }
  return context;
};

export const useBreakpoint = () => {
  const [breakpoint, setBreakpoint] = useState("lg");

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      console.log(width);
      if (width > 1280) {
        setBreakpoint("xl");
      } else if (width > 1024) {
        setBreakpoint("lg");
      } else if (width > 768) {
        setBreakpoint("md");
      } else {
        setBreakpoint("sm");
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return breakpoint;
};
