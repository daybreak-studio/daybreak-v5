import React from "react";

interface GridSystemProps {
  children: React.ReactNode;
}

export const GridSystem: React.FC<GridSystemProps> = ({ children }) => {
  return (
    <div className="grid grid-cols-3 gap-4 sm:grid-cols-5">{children}</div>
  );
};
