import { useState, useEffect } from "react";
import { useDebug } from "@/lib/contexts/debug";

export function useLowPowerMode() {
  const [isLowPowerMode, setIsLowPowerMode] = useState(false);
  const { debug } = useDebug();

  useEffect(() => {
    // Skip battery/media checks if debug mode is on
    if (debug) return;

    const checkBattery = async () => {
      try {
        if ("getBattery" in navigator) {
          // @ts-ignore
          const battery = await navigator.getBattery();

          const updatePowerMode = () => {
            setIsLowPowerMode(
              battery.charging === false && battery.level <= 0.2,
            );
          };

          updatePowerMode();
          battery.addEventListener("levelchange", updatePowerMode);
          battery.addEventListener("chargingchange", updatePowerMode);

          return () => {
            battery.removeEventListener("levelchange", updatePowerMode);
            battery.removeEventListener("chargingchange", updatePowerMode);
          };
        }
      } catch (error) {
        console.warn("Battery API not supported:", error);
      }
    };

    checkBattery();

    const mediaQuery = window.matchMedia(
      "(prefers-reduced-motion: reduce), (prefers-reduced-data: reduce)",
    );

    const handleChange = (e: MediaQueryListEvent) =>
      setIsLowPowerMode(e.matches);

    setIsLowPowerMode(mediaQuery.matches);
    mediaQuery.addEventListener("change", handleChange);

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [debug]); // Add debug to dependencies

  // Return true if debug mode is on, otherwise return the low power mode state
  return debug || isLowPowerMode;
}
