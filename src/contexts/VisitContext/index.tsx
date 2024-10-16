import React, { createContext, useState, useContext, useEffect } from "react";
import Cookies from "js-cookie";

type VisitStatus = "unknown" | "new" | "returning";

interface VisitContextType {
  visitStatus: VisitStatus;
  isLoading: boolean;
  markVisitComplete: () => void;
}

const VisitContext = createContext<VisitContextType | undefined>(undefined);

export const VisitProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [visitStatus, setVisitStatus] = useState<VisitStatus>("unknown");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const hasVisitedBefore = Cookies.get("hasVisitedBefore");
    setVisitStatus(hasVisitedBefore === "true" ? "returning" : "new");
    setIsLoading(false);
  }, []);

  const markVisitComplete = () => {
    setVisitStatus("returning");
    Cookies.set("hasVisitedBefore", "true", { expires: 1 });
  };

  return (
    <VisitContext.Provider
      value={{ visitStatus, isLoading, markVisitComplete }}
    >
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
