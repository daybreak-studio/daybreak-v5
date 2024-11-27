import React, { createContext, useState, useContext, useEffect } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { useBaseRoute } from "../../hooks/useBaseRoute";

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
  const router = useRouter();

  useEffect(() => {
    const hasVisitedBefore = Cookies.get("hasVisitedBefore");

    // If they haven't visited before, set the cookie immediately
    if (!hasVisitedBefore) {
      const thirtyMinutes = new Date(new Date().getTime() + 30 * 60 * 1000);
      Cookies.set("hasVisitedBefore", "true", { expires: thirtyMinutes });
    }

    // Only set as "new" if they haven't visited before AND they're on a base route
    setVisitStatus(!hasVisitedBefore && isBaseRoute ? "new" : "returning");
    setIsLoading(false);
  }, [isBaseRoute]);

  const markVisitComplete = () => {
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
