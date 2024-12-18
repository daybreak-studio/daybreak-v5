function getResult(
  index: number,
  currentIndex: number,
  previous: number,
  current: number,
  next: number,
) {
  if (index < currentIndex) return previous;
  if (index === currentIndex) return current;
  return next;
}

export const getScale = (index: number, currentIndex: number) =>
  getResult(index, currentIndex, 0.8, 1, 0.95);

export const getRotation = (index: number, currentIndex: number) =>
  getResult(index, currentIndex, -2, 0, 2);

export const getY = (index: number, currentIndex: number) =>
  getResult(index, currentIndex, -100, 0, window.innerHeight * 0.85);

export const getCardVisibility = (index: number, currentIndex: number) => {
  if (index === currentIndex) return { blur: 0, opacity: 1 };
  if (index === currentIndex - 1) return { blur: 4, opacity: 0.6 };
  if (index === currentIndex + 1) return { blur: 0, opacity: 1 };
  return { blur: 0, opacity: 0 };
};
