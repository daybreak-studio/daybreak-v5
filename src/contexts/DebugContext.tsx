import React, { createContext, useContext, useEffect, useState } from "react";

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
      {children}
    </DebugContext.Provider>
  );
}

export const useDebug = () => useContext(DebugContext);
