import minecraftBg from "@/assets/minecraft-bg.jpg";
import ParticleBackground from "./ParticleBackground";
import { useState, useEffect } from "react";

const Hero = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Parallax */}
      <div 
        className="absolute inset-0 z-0 transition-transform duration-300 ease-out"
        style={{
          transform: `translate(${mousePosition.x}px, ${mousePosition.y}px) scale(1.1)`,
        }}
      >
        <img
          src={minecraftBg}
          alt="Minecraft server world"
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/20 to-background" />
      </div>

      {/* Particle Layer */}
      <ParticleBackground />

      {/* Content */}
      <div className="relative z-10 text-center px-6 pt-20">
        <h1 className="text-[12vw] md:text-[10vw] font-bold tracking-tighter leading-none mb-8">
          SERVER<br/>CONFIG
        </h1>
        <p className="max-w-3xl mx-auto text-lg md:text-xl text-muted-foreground leading-relaxed">
          Expert Minecraft server configuration that will make other servers look amateur. I deliver high-performance, custom-configured servers that push technical boundaries and exceed player expectations. From vanilla to modded, from small communities to massive networks.
        </p>
      </div>
    </section>
  );
};

export default Hero;
