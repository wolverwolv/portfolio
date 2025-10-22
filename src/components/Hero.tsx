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
          WOLVER<br/>WOLV
        </h1>
        <p className="max-w-3xl mx-auto text-lg md:text-xl text-purple-200 leading-relaxed drop-shadow-[0_0_8px_rgba(200,180,255,0.6)]">
          Expert Minecraft server configuration that will make other servers look amateur.<br></br> I provide high-performance, custom-configured servers that<br></br>push technical boundaries and exceed player expectations.<br></br>Also providing simple custom codded plugins!
        </p>
      </div>
    </section>
  );
};

export default Hero;
