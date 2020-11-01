import { useState, useCallback, useEffect } from 'react';

// Executes function over "interval" milliseconds
// If the function or interval changes, the new function will be executed immediately
export default function useTimeoutLoop(func: () => void, interval: number): void {
  const [timeoutHandle, setTimeoutHandle] = useState(null as NodeJS.Timeout | null);

  const startLoop = useCallback(() => {
    const handle = setTimeout(() => {
      func();
      startLoop();
    }, interval);
    setTimeoutHandle(handle);
  }, [func, interval]);

  useEffect(() => {
    startLoop();
  }, [startLoop]);

  // If the timeoutHandle changes, clear the old timeout
  useEffect(
    () => () => {
      if (timeoutHandle) clearTimeout(timeoutHandle);
      // No need to set timeoutHandle to null because it already has a new value queued up
    },
    [timeoutHandle],
  );
}
