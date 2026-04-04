import { useEffect, useRef } from 'react';
import LocomotiveScroll from 'locomotive-scroll';
import 'locomotive-scroll/dist/locomotive-scroll.css'; // Import the CSS

interface LocoScrollOptions {
  smooth?: boolean;
  lerp?: number;
  multiplier?: number;
  class?: string;
  // Add other options as needed
}

export const useLocoScroll = (start: boolean, options?: LocoScrollOptions) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const ls = useRef<LocomotiveScroll | null>(null);

  useEffect(() => {
    if (!start) return;

    const scrollElement = scrollRef.current;

    if (scrollElement) {
      ls.current = new LocomotiveScroll({
        el: scrollElement,
        smooth: true,
        lerp: 0.08, // Adjust for desired smoothness
        multiplier: 1,
        class: 'is-reveal',
        ...options,
      });

      // Optional: Update scroll on image load or content change
      // ls.current.update();

      return () => {
        if (ls.current) {
          ls.current.destroy();
          ls.current = null;
        }
      };
    }
  }, [start, options]);

  return scrollRef;
};
