import { useEffect, useRef, useState } from 'react';

export function useElementSize<T extends HTMLElement>(delay = 500) {
  const ref = useRef<T>(null);
  const [size, setSize] = useState<{ width: number; height: number } | null>(
    null
  );

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let timeout: number | null = null;

    const updateSize = () => {
      if (el) {
        setSize({
          width: el.offsetWidth,
          height: el.offsetHeight,
        });
      }
    };

    // initial measure
    updateSize();

    const observer = new ResizeObserver(() => {
      if (timeout !== null) {
        clearTimeout(timeout);
      }

      timeout = window.setTimeout(() => {
        updateSize();
        timeout = null;
      }, delay);
    });

    observer.observe(el);

    return () => {
      observer.disconnect();
      if (timeout !== null) {
        clearTimeout(timeout);
      }
    };
  }, [delay]);

  return [ref, size] as const;
}

export default useElementSize;
