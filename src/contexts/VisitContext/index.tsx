import React, { createContext, useState, useContext, useEffect } from "react";

interface VisitContextType {
  hasVisitedBefore: boolean | null;
  setHasVisitedBefore: React.Dispatch<React.SetStateAction<boolean | null>>;
}

const VisitContext = createContext<VisitContextType | undefined>(undefined);

export const VisitProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [hasVisitedBefore, setHasVisitedBefore] = useState<boolean | null>(
    null,
  );

  useEffect(() => {
    if (typeof window !== "undefined") {
      const hasVisited = localStorage.getItem("hasVisited");
      setHasVisitedBefore(!!hasVisited);
    }
  }, []);

  return (
    <VisitContext.Provider value={{ hasVisitedBefore, setHasVisitedBefore }}>
      {children}
    </VisitContext.Provider>
  );
};

export const useVisit = () => {
  const context = useContext(VisitContext);
  if (context === undefined) {
    throw new Error("useVisit must be used within a VisitProvider");
  }
  return context;
};
