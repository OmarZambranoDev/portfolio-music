import { useRef, useCallback } from 'react';

export function useSwipeBack(onSwipeBack: () => void, threshold = 80, edgeWidth = 40) {
  const touchStartX = useRef<number>(0);
  const touchStartY = useRef<number>(0);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  }, []);

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      const endX = e.changedTouches[0].clientX;
      const endY = e.changedTouches[0].clientY;
      const deltaX = endX - touchStartX.current;
      const deltaY = endY - touchStartY.current;

      if (
        touchStartX.current < edgeWidth &&
        deltaX > threshold &&
        Math.abs(deltaX) > Math.abs(deltaY)
      ) {
        onSwipeBack();
      }
    },
    [onSwipeBack, threshold, edgeWidth]
  );

  return { handleTouchStart, handleTouchEnd };
}
