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
  const [shiftPressed, setShiftPressed] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Shift") {
        setShiftPressed(true);
      } else if (shiftPressed && event.key === "D") {
        event.preventDefault();
        setDebug((prev) => !prev);
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.key === "Shift") {
        setShiftPressed(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [shiftPressed]);

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
            Debug Mode (Shift + D)
          </motion.h4>
        )}
      </AnimatePresence>
      {children}
    </DebugContext.Provider>
  );
}

export const useDebug = () => useContext(DebugContext);
