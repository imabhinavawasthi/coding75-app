"use client";

import { useEffect, useRef } from "react";

/**
 * Hook to detect when a user intends to leave the page
 * (e.g. mouse cursor moves above the viewport top edge).
 */
export function useLeaveIntent(
  onLeaveIntent: () => void,
  options = { threshold: 20 }
) {
  const triggered = useRef(false);

  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY < options.threshold && !triggered.current) {
        triggered.current = true;
        onLeaveIntent();
      }
    };

    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [onLeaveIntent, options.threshold]);

  return {
    resetTrigger: () => {
      triggered.current = false;
    },
  };
}
