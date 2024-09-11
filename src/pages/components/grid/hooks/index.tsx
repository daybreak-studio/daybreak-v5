import { GridProps } from "../props";
import { createContext, useContext } from "react";

export const WidgetGridContext = createContext<GridProps.Context | undefined>(
  undefined,
);

export const useWidgetGridContext = () => {
  const context = useContext(WidgetGridContext);
  if (!context) {
    throw new Error("useWidgetGridContext must be used within a GridProvider");
  }
  return context;
};
