import { useEffect, useRef } from "react";
import bgLayerFar from "@/assets/bg-layer-far.jpg";
import bgLayerMidFar from "@/assets/bg-layer-mid-far.jpg";
import bgLayerMid from "@/assets/bg-layer-mid.jpg";
import bgLayerMidNear from "@/assets/bg-layer-mid-near.jpg";
import bgLayerNear from "@/assets/bg-layer-near.jpg";
import bgLayerFront from "@/assets/bg-layer-front.jpg";

const ParallaxBackground = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const smooth = useRef({ x: 0, y: 0 });
  const velocity = useRef({ x: 0, y: 0 });

  const layers = [
    { src: bgLayerFar, depth: 6, scale: 1.03, opacity: 0.3, blur: 2 },
    { src: bgLayerMidFar, depth: 12, scale: 1.06, opacity: 1, blur: 1 },
    { src: bgLayerMid, depth: 18, scale: 1.09, opacity: 0.5, blur: 0.5 },
    { src: bgLayerMidNear, depth: 26, scale: 1.14, opacity: 0.6, blur: 0 },
    { src: bgLayerNear, depth: 36, scale: 1.2, opacity: 0.7, blur: 0 },
    { src: bgLayerFront, depth: 48, scale: 1.28, opacity: 0.8, blur: 0 },
  ];

  useEffect(() => {
    let lastTime = performance.now();
    
    const handleMouseMove = (e: MouseEvent) => {
      const newX = (e.clientX / window.innerWidth - 0.5) * 2;
      const newY = (e.clientY / window.innerHeight - 0.5) * 2;
      
      // Calculate velocity for momentum
      velocity.current.x = newX - mouse.current.x;
      velocity.current.y = newY - mouse.current.y;
      
      mouse.current.x = newX;
      mouse.current.y = newY;
    };
    
    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    // Exponential smoothing with variable speed
    const smoothStep = (current: number, target: number, velocity: number, deltaTime: number) => {
      const speed = 0.03 + Math.abs(velocity) * 0.5;
      const factor = 1 - Math.pow(1 - speed, deltaTime / 16);
      return current + (target - current) * factor;
    };

    const animate = (time: number) => {
      const deltaTime = Math.min(time - lastTime, 50);
      lastTime = time;

      smooth.current.x = smoothStep(smooth.current.x, mouse.current.x, velocity.current.x, deltaTime);
      smooth.current.y = smoothStep(smooth.current.y, mouse.current.y, velocity.current.y, deltaTime);

      // Decay velocity
      velocity.current.x *= 0.95;
      velocity.current.y *= 0.95;

      const container = containerRef.current;
      if (container) {
        const layerEls = container.querySelectorAll<HTMLDivElement>(".layer");
        layerEls.forEach((el, i) => {
          const { depth, scale } = layers[i];
          const x = smooth.current.x * depth;
          const y = smooth.current.y * depth;
          // Subtle rotation based on movement
          const rotate = smooth.current.x * (i * 0.15);
          
          el.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scale}) rotate(${rotate}deg)`;
        });
      }

      requestAnimationFrame(animate);
    };

    const id = requestAnimationFrame(animate);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(id);
    };
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden">
      {/* 6 Parallax Layers */}
      {layers.map((layer, i) => (
        <div
          key={i}
          className="layer absolute inset-0 will-change-transform"
          style={{
            zIndex: i,
            transform: `scale(${layer.scale})`,
          }}
        >
          <img
            src={layer.src}
            alt={`Layer ${i}`}
            className="w-full h-full object-cover select-none"
            style={{ opacity: layer.opacity }}
            draggable={false}
          />
        </div>
      ))}

      {/* 🌑 Cinematic dark vignette */}
      <div className="absolute inset-0 z-[10] pointer-events-none">
        <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-black/100 via-black/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/100 via-black/60 to-transparent" />
        <div className="absolute inset-0 bg-black/25" />
      </div>
    </div>
  );
};

export default ParallaxBackground;
