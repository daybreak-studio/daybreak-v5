import React, { createContext, useContext, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface DebugContextType {
  debug: boolean;
  toggleDebug: () => void;
}

const DebugContext = createContext<DebugContextType>({
  debug: false,
  toggleDebug: () => {},
});

export function DebugProvider({ children }: { children: React.ReactNode }) {
  const [debug, setDebug] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Check for Ctrl/CMD + D
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "d") {
        event.preventDefault();
        setDebug((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <DebugContext.Provider
      value={{ debug, toggleDebug: () => setDebug((prev) => !prev) }}
    >
      <AnimatePresence>
        {debug && (
          <motion.h4
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            className="fixed right-4 top-4 z-50 text-xs text-neutral-500"
          >
            Debug Mode (Ctrl/CMD + D)
          </motion.h4>
        )}
      </AnimatePresence>
      {children}
    </DebugContext.Provider>
  );
}

export const useDebug = () => useContext(DebugContext);
