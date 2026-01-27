import { useRef, useCallback } from "react";

interface SwipeHandlers {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
}

interface SwipeConfig {
  threshold?: number; // Minimum distance for swipe
  timeout?: number; // Max time for swipe gesture
}

export function useSwipeGesture(
  handlers: SwipeHandlers,
  config: SwipeConfig = {}
) {
  const { threshold = 50, timeout = 300 } = config;
  
  const touchStart = useRef<{ x: number; y: number; time: number } | null>(null);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStart.current = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now(),
    };
  }, []);

  const onTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (!touchStart.current) return;

      const touch = e.changedTouches[0];
      const deltaX = touch.clientX - touchStart.current.x;
      const deltaY = touch.clientY - touchStart.current.y;
      const deltaTime = Date.now() - touchStart.current.time;

      touchStart.current = null;

      if (deltaTime > timeout) return;

      const absX = Math.abs(deltaX);
      const absY = Math.abs(deltaY);

      // Determine if horizontal or vertical swipe
      if (absX > absY && absX > threshold) {
        if (deltaX > 0) {
          handlers.onSwipeRight?.();
        } else {
          handlers.onSwipeLeft?.();
        }
      } else if (absY > absX && absY > threshold) {
        if (deltaY > 0) {
          handlers.onSwipeDown?.();
        } else {
          handlers.onSwipeUp?.();
        }
      }
    },
    [handlers, threshold, timeout]
  );

  return {
    onTouchStart,
    onTouchEnd,
  };
}

// Hook for swipe-to-delete
export function useSwipeToDelete(onDelete: () => void, threshold = 100) {
  const startX = useRef<number>(0);
  const currentX = useRef<number>(0);
  const elementRef = useRef<HTMLDivElement>(null);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
    currentX.current = startX.current;
  }, []);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    currentX.current = e.touches[0].clientX;
    const delta = startX.current - currentX.current;
    
    if (elementRef.current && delta > 0) {
      const translateX = Math.min(delta, threshold);
      elementRef.current.style.transform = `translateX(-${translateX}px)`;
      elementRef.current.style.opacity = `${1 - translateX / (threshold * 2)}`;
    }
  }, [threshold]);

  const onTouchEnd = useCallback(() => {
    const delta = startX.current - currentX.current;
    
    if (elementRef.current) {
      if (delta > threshold) {
        elementRef.current.style.transform = `translateX(-100%)`;
        elementRef.current.style.opacity = "0";
        setTimeout(onDelete, 200);
      } else {
        elementRef.current.style.transform = "translateX(0)";
        elementRef.current.style.opacity = "1";
      }
    }
  }, [threshold, onDelete]);

  return {
    elementRef,
    handlers: {
      onTouchStart,
      onTouchMove,
      onTouchEnd,
    },
  };
}
