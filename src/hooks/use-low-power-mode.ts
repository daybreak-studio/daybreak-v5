import { useState, useEffect } from "react";

export const useLowPowerMode = () => {
  const [isLowPowerMode, setIsLowPowerMode] = useState(false);

  useEffect(() => {
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
  }, []);

  return isLowPowerMode;
};
