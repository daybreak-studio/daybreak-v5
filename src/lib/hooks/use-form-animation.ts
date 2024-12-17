// Extract animation logic
export const useFormAnimation = () => {
  const getScale = (index: number, currentIndex: number) => {
    if (index === currentIndex) return 1;
    if (index < currentIndex) return 0.85;
    return 1.2;
  };

  const getRotation = (index: number, currentIndex: number) => {
    if (index === currentIndex) return 0;
    if (index < currentIndex) return 2;
    return -2;
  };

  const getY = (index: number, currentIndex: number) => {
    if (index === currentIndex) return 0;
    if (index < currentIndex) return -100;
    return window.innerHeight * 0.65; // Shows ~15% of the next card
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
