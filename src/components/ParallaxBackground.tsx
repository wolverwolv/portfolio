import { useState, useEffect } from "react";
import bgLayerFar from "@/assets/bg-layer-far.jpg";
import bgLayerMid from "@/assets/bg-layer-mid.jpg";
import bgLayerNear from "@/assets/bg-layer-near.jpg";

interface MousePosition {
  x: number;
  y: number;
}

const ParallaxBackground = () => {
  const [mousePosition, setMousePosition] = useState<MousePosition>({ x: 0, y: 0 });
  const [smoothPosition, setSmoothPosition] = useState<MousePosition>({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      setMousePosition({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Smooth interpolation for professional feel
  useEffect(() => {
    const lerp = (start: number, end: number, factor: number) => {
      return start + (end - start) * factor;
    };

    const animate = () => {
      setSmoothPosition((prev) => ({
        x: lerp(prev.x, mousePosition.x, 0.05),
        y: lerp(prev.y, mousePosition.y, 0.05),
      }));
      requestAnimationFrame(animate);
    };

    const animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, [mousePosition]);

  return (
    <>
      {/* Far Background Layer - slowest movement */}
      <div
        className="absolute inset-0 z-0"
        style={{
          transform: `translate(${smoothPosition.x * 5}px, ${smoothPosition.y * 5}px) scale(1.1)`,
          transition: "transform 0.1s ease-out",
        }}
      >
        <img
          src={bgLayerFar}
          alt="Background layer"
          className="w-full h-full object-cover opacity-30"
        />
      </div>

      {/* Middle Layer - medium movement */}
      <div
        className="absolute inset-0 z-[1]"
        style={{
          transform: `translate(${smoothPosition.x * 15}px, ${smoothPosition.y * 15}px) scale(1.15)`,
          transition: "transform 0.1s ease-out",
        }}
      >
        <img
          src={bgLayerMid}
          alt="Middle layer"
          className="w-full h-full object-cover opacity-40"
        />
      </div>

      {/* Near Layer - fastest movement */}
      <div
        className="absolute inset-0 z-[2]"
        style={{
          transform: `translate(${smoothPosition.x * 30}px, ${smoothPosition.y * 30}px) scale(1.2)`,
          transition: "transform 0.1s ease-out",
        }}
      >
        <img
          src={bgLayerNear}
          alt="Foreground layer"
          className="w-full h-full object-cover opacity-20"
        />
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 z-[3] bg-gradient-to-b from-transparent via-background/30 to-background pointer-events-none" />
    </>
  );
};

export default ParallaxBackground;
