"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useMotionValue, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";

function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(2) + 'M';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(2) + 'K';
  } else {
    return num.toString();
  }
}

export function NumberTicker({
  value,
  direction = "up",
  delay = 0,
  className,
}: {
  value: number;
  direction?: "up" | "down";
  className?: string;
  delay?: number; // delay in s
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [currentValue, setCurrentValue] = useState(1);
  const motionValue = useMotionValue(direction === "down" ? currentValue : 0);
  const springValue = useSpring(motionValue, {
    damping: 60,
    stiffness: 100,
  });
  const isInView = useInView(ref, { once: true, margin: "0px" });

  useEffect(() => {
    if (isInView) {
      if (isNaN(value)) {
        // Start incrementing if value is NaN
        const interval = setInterval(() => {
          setCurrentValue((prev) => prev + 1);
        }, 100);
        return () => clearInterval(interval);
      } else {
        // Set to the actual value if it's a number
        setCurrentValue(value);
      }
    }
  }, [isInView, value]);

  useEffect(() => {
    setTimeout(() => {
      motionValue.set(direction === "down" ? 0 : currentValue);
    }, delay * 1000);
  }, [motionValue, delay, currentValue, direction]);

  useEffect(
    () =>
      springValue.on("change", (latest) => {
        if (ref.current) {
          ref.current.textContent = formatNumber(Math.round(latest));
        }
      }),
    [springValue],
  );

  return (
    <span
      className={cn(
        "inline-block tabular-nums text-black dark:text-white tracking-wider",
        className,
      )}
      ref={ref}
    />
  );
}

export default NumberTicker;