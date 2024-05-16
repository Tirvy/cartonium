export const useDebounce = (func: Function, timeout: number) => {
  let timeoutId: any;

  return (...args: any[]) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func(...args);
    }, timeout);
  };
}
