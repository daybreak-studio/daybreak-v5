import { createContext, useContext } from "react";
import { Widget } from "@/components/widgets/grid/types";
import { Clients } from "@/sanity/types";

interface WidgetDataContextValue {
  widgets: Widget[]; // Use our transformed Widget type
  clients?: Clients[];
  [key: string]: any;
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
