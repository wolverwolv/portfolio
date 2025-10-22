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

  const layers = [
    { src: bgLayerFar, depth: 4, scale: 1.02, opacity: 0.25 },
    { src: bgLayerMidFar, depth: 8, scale: 1.05, opacity: 1 },
    { src: bgLayerMid, depth: 12, scale: 1.08, opacity: 0.45 },
    { src: bgLayerMidNear, depth: 18, scale: 1.12, opacity: 0.55 },
    { src: bgLayerNear, depth: 25, scale: 1.18, opacity: 0.65 },
    { src: bgLayerFront, depth: 35, scale: 1.25, opacity: 0.75 },
  ];

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", handleMouseMove);

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const animate = () => {
      smooth.current.x = lerp(smooth.current.x, mouse.current.x, 0.05);
      smooth.current.y = lerp(smooth.current.y, mouse.current.y, 0.05);

      const container = containerRef.current;
      if (container) {
        const layerEls = container.querySelectorAll<HTMLDivElement>(".layer");
        layerEls.forEach((el, i) => {
          const { depth, scale } = layers[i];
          el.style.transform = `translate3d(${smooth.current.x * depth}px, ${
            smooth.current.y * depth
          }px, 0) scale(${scale})`;
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
