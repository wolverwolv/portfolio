import { useEffect, useRef } from 'react';
import LocomotiveScroll from 'locomotive-scroll';
import 'locomotive-scroll/dist/locomotive-scroll.css';

interface LocoScrollOptions {
  smooth?: boolean;
  lerp?: number;
  multiplier?: number;
  class?: string;
}

export const useLocoScroll = (start: boolean, options?: LocoScrollOptions) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const ls = useRef<LocomotiveScroll | null>(null);

  useEffect(() => {
    if (!start) return;

    // Detect mobile devices
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    // If it's mobile, we don't initialize Locomotive Scroll to allow native touch scrolling
    if (isMobile) {
      console.log("Mobile detected, using native scrolling.");
      return;
    }

    const scrollElement = scrollRef.current;

    if (scrollElement) {
      ls.current = new LocomotiveScroll({
        el: scrollElement,
        smooth: true,
        lerp: 0.08,
        multiplier: 1,
        class: 'is-reveal',
        ...options,
      });

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
