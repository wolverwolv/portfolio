import { useEffect, useState, useContext } from "react";
import LiquidEther from "./LiquidEther";
import { motion } from "framer-motion";
import ParallaxBackground from "./ParallaxBackground";
import CardSwap, { Card } from "./CardSwap";
import OrbitImages from "./OrbitImages";
import { API_URL } from "@/config";
import { LoadingContext } from "@/App"; // Import the LoadingContext

// Local fallbacks for the orbit
import halo1 from "@/assets/halo1.png";
import npc from "@/assets/npc.png";
import gui from "@/assets/gui1.png";
import crate from "@/assets/crate2.png";
import plug from "@/assets/plug.png";
import mm from "@/assets/mm1.png";

const Hero = () => {
  const { isLoading, setIsLoading } = useContext(LoadingContext);
  const [orbitImages, setOrbitImages] = useState<string[]>([halo1, npc, gui, crate, plug, mm]);
  const [dataLoaded, setDataLoaded] = useState(false);

  useEffect(() => {
    const fetchRandomImages = async () => {
      try {
        const projectsRes = await fetch(`${API_URL}/api/projects?t=${Date.now()}`);
        const projectsData = await projectsRes.json();
        const allProjectImages = projectsData.flatMap((p: any) => p.images || []).filter(Boolean);

        const reviewsRes = await fetch(`${API_URL}/api/reviews?t=${Date.now()}`);
        const reviewsData = await reviewsRes.json();
        const allReviewImages = reviewsData.map((r: any) => r.image).filter(Boolean);

        const combinedImages = [...allProjectImages, ...allReviewImages];
        const uniqueImages = Array.from(new Set(combinedImages));

        const orbitDisplayImages = uniqueImages.slice(0, 8);
        if (orbitDisplayImages.length < 8) {
          orbitDisplayImages.push(halo1);
        }
        setOrbitImages(orbitDisplayImages);
        setDataLoaded(true);
      } catch (error) {
        console.error("Failed to fetch orbit images:", error);
        setDataLoaded(true); // Still allow to proceed even if fetch fails
      }
    };
    fetchRandomImages();
  }, []);

  useEffect(() => {
    if (dataLoaded) {
      // Ensure isLoading is true for a minimum of 3 seconds
      const minAnimationTime = setTimeout(() => {
        setIsLoading(false);
      }, 3000); // Minimum 3 seconds of loading animation

      return () => clearTimeout(minAnimationTime);
    }
  }, [dataLoaded, setIsLoading]);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background">
      {/* Parallax Background - Low Opacity */}
      <div className="absolute inset-0 z-0 opacity-20">
        <ParallaxBackground />
      </div>

      {/* Liquid Ether Background */}
      <div className="absolute inset-0 z-0">
        <LiquidEther
            colors={['#1a0b2e', '#311b92', '#4a148c', '#000000']}
            resolution={0.35}
            mouseForce={20}
            isViscous={true}
            viscous={40}
            iterationsViscous={16}
            iterationsPoisson={16}
            autoSpeed={0.2}
        />
      </div>

      {/* Orbit Images - Dynamic speed based on loading state */}
      <div className="absolute inset-0 z-[10] pointer-events-none opacity-80 scale-110 flex items-center justify-center">
        <div className="w-full max-w-7xl aspect-square md:aspect-video">
           <OrbitImages
              images={orbitImages}
              shape="ellipse"
              radiusX={600}
              radiusY={150}
              rotation={-10}
              initialDuration={0.5} // Initial fast spin duration
              finalDuration={30}   // Final slow spin duration
              durationTransition={2} // Duration for the speed transition
              isLoading={isLoading} // Pass isLoading state
              itemSize={120}
              responsive={true}
              radius={250}
              direction="normal"
              fill
              showPath
              pathColor="rgba(255, 255, 255, 0.1)"
            />
        </div>
      </div>

      {/* Gradients for blending */}
      <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-background via-background/80 to-transparent z-[1] pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background via-background/80 to-transparent z-[1] pointer-events-none" />

      {/* Loading Text */}
      {isLoading && (
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="absolute text-4xl font-bold text-foreground z-[20]"
        >
          Loading...
        </motion.h1>
      )}

      {/* Content */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: isLoading ? 0 : 1, y: isLoading ? 30 : 0 }}
        transition={{ duration: 1, ease: "easeOut", delay: isLoading ? 0 : 0.2 }}
        className="relative z-[15] text-center px-6 pt-20"
      >
        <h1 className="text-[12vw] md:text-[10vw] font-bold tracking-tighter leading-none mb-12 text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50 drop-shadow-2xl">
          WOLVER<br/>WOLV
        </h1>
      </motion.div>

      {/* Card Swap - Bottom Right */}
      <CardSwap
        width={280}
        height={340}
        cardDistance={40}
        verticalDistance={50}
        delay={4000}
        pauseOnHover={true}
      >
        <Card>
          <h3 className="text-xl font-bold text-purple-300 mb-2">Server Setup</h3>
          <p className="text-sm text-gray-300 leading-relaxed">
            Complete server configuration from scratch. Performance optimization, security hardening, and network setup.
          </p>
        </Card>
        <Card>
          <h3 className="text-xl font-bold text-blue-300 mb-2">Advanced Config</h3>
          <p className="text-sm text-gray-300 leading-relaxed">
            Complex permission systems, economy balancing, custom game modes, and anti-cheat integration.
          </p>
        </Card>
        <Card>
          <h3 className="text-xl font-bold text-pink-300 mb-2">Custom Plugins</h3>
          <p className="text-sm text-gray-300 leading-relaxed">
            Tailored plugin development to bring unique mechanics and features to your Minecraft server.
          </p>
        </Card>
      </CardSwap>
    </section>
  );
};

export default Hero;
