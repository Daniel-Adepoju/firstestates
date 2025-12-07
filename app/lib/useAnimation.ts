import { useEffect, useRef, useState } from "react";

export function useAnimation({
  threshold = 0.13,
  rootMargin = "0px 0px -100px 0px",
} = {}) {
  const ref = useRef<HTMLElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target); // fire once
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  return {
    ref,
    className: isVisible
      ? "animate-in fade-in slide-in-from-top-8 duration-400 ease-out"
      : "opacity-0",
    style: isVisible
      ? { "--stagger-delay": "90ms" } as React.CSSProperties
      : undefined,
  };
}