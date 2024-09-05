import React from "react";
import clsx from "clsx";

interface WidgetProps {
  size?: "small" | "medium" | "large";
  children?: React.ReactNode;
}

export const Widget: React.FC<WidgetProps> = ({ size, children }) => {
  const sizeClasses = clsx({
    "col-span-1 row-span-1": size === "small",
    "col-span-2 row-span-2": size === "medium",
    "col-span-3 row-span-3": size === "large",
  });

  return (
    <div className={clsx("aspect-square rounded-lg bg-[#D9D9D9]", sizeClasses)}>
      {children}
    </div>
  );
};
