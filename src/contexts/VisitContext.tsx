import React, { createContext, useState, useContext, useEffect } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { useBaseRoute } from "@/hooks/useBaseRoute";
import { useDebug } from "./DebugContext";

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
  const { isBaseRoute } = useBaseRoute();
  const { debug } = useDebug();

  useEffect(() => {
    // In debug mode, always treat as new visit
    if (debug) {
      Cookies.remove("hasVisitedBefore");
      setVisitStatus(isBaseRoute ? "new" : "returning");
      setIsLoading(false);
      return;
    }

    const hasVisitedBefore = Cookies.get("hasVisitedBefore");

    // Only set as "new" if they haven't visited before AND they're on a base route
    const newStatus = !hasVisitedBefore && isBaseRoute ? "new" : "returning";
    setVisitStatus(newStatus);
    setIsLoading(false);
  }, [isBaseRoute, debug]);

  const markVisitComplete = () => {
    // Only set cookie if not in debug mode
    if (!debug) {
      const thirtyMinutes = new Date(new Date().getTime() + 30 * 60 * 1000);
      Cookies.set("hasVisitedBefore", "true", { expires: thirtyMinutes });
    }
    setVisitStatus("returning");
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
