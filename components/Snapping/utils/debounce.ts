export interface DebouncedFunction<T extends (...args: any[]) => any> {
  (...args: Parameters<T>): void;
  abort: () => void;
}

export function debounce<T extends (...args: any[]) => any>(
  cb: T,
  wait = 20
): DebouncedFunction<T> {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  const debouncedFunction = (...args: Parameters<T>): void => {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      cb(...args);
      timeoutId = null;
    }, wait);
  };

  const abort = (): void => {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
  };

  return Object.assign(debouncedFunction, { abort }) as DebouncedFunction<T>;
}
