import { createContext, useContext } from "react";
import { Widget } from "@/components/widgets/grid/types";

interface WidgetDataContextValue {
  widgets: Widget[]; // Only widgets is required
  [key: string]: any; // Allow any additional data
}

const WidgetDataContext = createContext<WidgetDataContextValue | null>(null);

export function WidgetDataProvider({
  children,
  data,
}: {
  children: React.ReactNode;
  data: WidgetDataContextValue;
}) {
  return (
    <WidgetDataContext.Provider value={data}>
      {children}
    </WidgetDataContext.Provider>
  );
}

export function useWidgetData<T>(key: keyof WidgetDataContextValue): T {
  const context = useContext(WidgetDataContext);
  if (!context) {
    throw new Error("useWidgetData must be used within WidgetDataProvider");
  }
  return context[key] as T;
}
