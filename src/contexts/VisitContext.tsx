import React, { createContext, useState, useContext, useEffect } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
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
  const router = useRouter();
  const isHomePage = router.pathname === "/";
  const { debug } = useDebug();

  useEffect(() => {
    // Clear any existing cookie in debug mode
    if (debug) {
      Cookies.remove("hasVisitedBefore");
    }

    // Always treat as new visit in debug mode on homepage
    if (debug && isHomePage) {
      setVisitStatus("new");
      setIsLoading(false);
      return;
    }

    const hasVisitedBefore = Cookies.get("hasVisitedBefore");
    const newStatus = !hasVisitedBefore && isHomePage ? "new" : "returning";

    setVisitStatus(newStatus);
    setIsLoading(false);
  }, [isHomePage, debug]);

  const markVisitComplete = () => {
    // Don't mark complete in debug mode
    if (!debug) {
      const thirtyMinutes = new Date(new Date().getTime() + 30 * 60 * 1000);
      Cookies.set("hasVisitedBefore", "true", { expires: thirtyMinutes });
      setVisitStatus("returning");
    }
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
