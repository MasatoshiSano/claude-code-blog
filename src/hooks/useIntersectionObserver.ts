import { useEffect, useRef, useState } from "react";

interface UseIntersectionObserverOptions extends IntersectionObserverInit {
  freezeOnceVisible?: boolean;
}

export const useIntersectionObserver = (
  options: UseIntersectionObserverOptions = {}
) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasIntersected, setHasIntersected] = useState(false);
  const elementRef = useRef<HTMLElement>(null);
  const frozen = options.freezeOnceVisible && hasIntersected;

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isElementIntersecting = entry.isIntersecting;
        
        setIsIntersecting(isElementIntersecting);
        
        if (isElementIntersecting && !hasIntersected) {
          setHasIntersected(true);
        }
      },
      {
        threshold: 0,
        root: null,
        rootMargin: "0px",
        ...options,
      }
    );

    if (!frozen) {
      observer.observe(element);
    }

    return () => {
      observer.disconnect();
    };
  }, [frozen, options, hasIntersected]);

  return {
    ref: elementRef,
    isIntersecting: frozen ? true : isIntersecting,
    hasIntersected,
  };
};