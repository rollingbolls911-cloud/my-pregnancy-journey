import { useEffect, useState, useRef } from "react";
import { cn } from "@/lib/utils";

interface AnimatedProgressRingProps {
  progress: number; // 0-100
  size?: number;
  strokeWidth?: number;
  className?: string;
  children?: React.ReactNode;
  animationDuration?: number;
}

export function AnimatedProgressRing({
  progress,
  size = 160,
  strokeWidth = 10,
  className,
  children,
  animationDuration = 1000,
}: AnimatedProgressRingProps) {
  const [displayProgress, setDisplayProgress] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const prevProgress = useRef(progress);
  
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (displayProgress / 100) * circumference;

  useEffect(() => {
    // Animate from previous to new progress
    if (prevProgress.current !== progress) {
      setIsAnimating(true);
      const startValue = prevProgress.current;
      const endValue = progress;
      const startTime = performance.now();

      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progressRatio = Math.min(elapsed / animationDuration, 1);
        
        // Easing function (ease-out cubic)
        const eased = 1 - Math.pow(1 - progressRatio, 3);
        const currentValue = startValue + (endValue - startValue) * eased;
        
        setDisplayProgress(currentValue);

        if (progressRatio < 1) {
          requestAnimationFrame(animate);
        } else {
          setIsAnimating(false);
          prevProgress.current = progress;
        }
      };

      requestAnimationFrame(animate);
    } else {
      // Initial mount
      const startTime = performance.now();
      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progressRatio = Math.min(elapsed / animationDuration, 1);
        const eased = 1 - Math.pow(1 - progressRatio, 3);
        
        setDisplayProgress(progress * eased);

        if (progressRatio < 1) {
          requestAnimationFrame(animate);
        }
      };
      requestAnimationFrame(animate);
      prevProgress.current = progress;
    }
  }, [progress, animationDuration]);

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="hsl(var(--muted))"
          strokeWidth={strokeWidth}
        />
        {/* Progress circle with glow effect when animating */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className={cn(
            "transition-[filter] duration-300",
            isAnimating && "drop-shadow-[0_0_8px_hsl(var(--primary))]"
          )}
          style={{
            filter: isAnimating ? "drop-shadow(0 0 6px hsl(var(--primary) / 0.5))" : undefined,
          }}
        />
        {/* Animated dots at progress tip */}
        {isAnimating && (
          <circle
            cx={size / 2 + radius * Math.cos((displayProgress / 100) * 2 * Math.PI - Math.PI / 2)}
            cy={size / 2 + radius * Math.sin((displayProgress / 100) * 2 * Math.PI - Math.PI / 2)}
            r={strokeWidth / 2 + 2}
            fill="hsl(var(--primary))"
            className="animate-pulse"
          />
        )}
      </svg>
      {/* Center content with scale animation */}
      <div 
        className={cn(
          "absolute inset-0 flex flex-col items-center justify-center transition-transform duration-300",
          isAnimating && "scale-105"
        )}
      >
        {children}
      </div>
    </div>
  );
}
