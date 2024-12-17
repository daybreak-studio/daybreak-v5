// Extract animation logic
export const useFormAnimation = () => {
  const getScale = (index: number, currentIndex: number) => {
    if (index === currentIndex) return 1;
    if (index < currentIndex) return 0.85;
    return 1.15;
  };

  const getRotation = (index: number, currentIndex: number) => {
    if (index === currentIndex) return 0;
    if (index < currentIndex) return 2;
    return -2;
  };

  const getY = (index: number, currentIndex: number) => {
    if (index === currentIndex) return 0;
    if (index < currentIndex) return -100;
    return window.innerHeight * 0.75;
  };

  const getCardVisibility = (index: number, currentIndex: number) => {
    if (index === currentIndex) return { blur: 0, opacity: 1 };
    if (index === currentIndex - 1) return { blur: 4, opacity: 0.6 };
    if (index === currentIndex + 1) return { blur: 0, opacity: 1 };
    return { blur: 0, opacity: 0 };
  };

  return {
    getScale,
    getRotation,
    getY,
    getCardVisibility,
  };
};
