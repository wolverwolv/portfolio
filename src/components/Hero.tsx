import minecraftHero from "@/assets/minecraft-hero.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={minecraftHero}
          alt="Minecraft server infrastructure"
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/20 to-background" />
      </div>

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
