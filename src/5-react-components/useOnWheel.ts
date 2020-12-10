import { useEffect } from 'react';

/** Registers an active listener for the `wheel` event
 *
 * onWheel is by default a passive event listener.
 * Most logic handling requires onWheel to be registered as an active event listener.
 */
export function useOnWheel(
  ref: React.RefObject<HTMLCanvasElement | null>,
  handler: (e: WheelEvent) => void,
): void {
  useEffect(() => {
    const el = ref.current;
    if (el) {
      el.addEventListener('wheel', handler, { passive: false });
    }

    return () => {
      if (el) {
        el.removeEventListener('wheel', handler);
      }
    };
  }, [ref, handler]);
}
