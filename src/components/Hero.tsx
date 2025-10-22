import heroStatue from "@/assets/hero-statue.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroStatue}
          alt="Classical sculpture"
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/20 to-background" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 pt-20">
        <h1 className="text-[12vw] md:text-[10vw] font-bold tracking-tighter leading-none mb-8">
          STUDIO
        </h1>
        <p className="max-w-3xl mx-auto text-lg md:text-xl text-muted-foreground leading-relaxed">
          Poison Studio is a bold, ambitious design studio based in Manchester, UK that will help you leave your competitors in the dust and make them look like a bunch of amateurs. We bring bold, creative ideas to life in projects that always push boundaries and exceed expectations.
        </p>
      </div>
    </section>
  );
};

export default Hero;
