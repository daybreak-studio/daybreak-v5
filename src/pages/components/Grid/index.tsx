import React, { createContext, useContext, ReactNode } from "react";
import clsx from "clsx";

interface WidgetContextProps {
  size: "small" | "medium" | "large";
  rowStart?: number;
  colStart?: number;
}

const WidgetContext = createContext<WidgetContextProps | undefined>(undefined);

export const useWidgetContext = (): WidgetContextProps => {
  const context = useContext(WidgetContext);
  if (!context) {
    throw new Error("useWidgetContext must be used within a WidgetProvider");
  }
  return context;
};

interface WidgetProviderProps {
  value: WidgetContextProps;
  children: ReactNode;
}

export const WidgetProvider: React.FC<WidgetProviderProps> = ({
  value,
  children,
}) => {
  return (
    <WidgetContext.Provider value={value}>{children}</WidgetContext.Provider>
  );
};

interface LayoutProps {
  children: ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [scale, setScale] = React.useState(1);

  React.useEffect(() => {
    const handleResize = () => {
      setScale(window.innerWidth / 1920);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="grid h-[597px] w-[1016px] grid-cols-3 gap-[31px] sm:grid-cols-5">
      {children}
    </div>
  );
};

interface WidgetProps {
  size: "small" | "medium" | "large";
  children?: React.ReactNode;
  rowStart?: number;
  colStart?: number;
}

export const Widget: React.FC<WidgetProps> = ({
  size,
  children,
  rowStart,
  colStart,
}) => {
  const sizeClasses = clsx({
    "col-span-1 row-span-1": size === "small",
    "col-span-2 row-span-2": size === "medium",
    "col-span-3 row-span-3": size === "large",
  });

  const positionClasses = clsx({
    [`row-start-${rowStart}`]: rowStart,
    [`col-start-${colStart}`]: colStart,
  });

  return (
    <WidgetProvider value={{ size, rowStart, colStart }}>
      <div
        className={clsx(
          "aspect-square rounded-3xl bg-[#D9D9D9] p-4",
          sizeClasses,
          positionClasses,
        )}
      >
        {children}
      </div>
    </WidgetProvider>
  );
};

const Grid = {
  Layout,
  Widget,
  useWidgetContext,
};

export default Grid;
