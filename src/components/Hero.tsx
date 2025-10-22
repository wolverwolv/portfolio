import ParallaxBackground from "./ParallaxBackground";
import ParticleBackground from "./ParticleBackground";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Multi-layer Parallax Background */}
      <ParallaxBackground />

      {/* Particle Layer */}
      <ParticleBackground />

      {/* Content */}
      <div className="relative z-[5] text-center px-6 pt-20">
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
