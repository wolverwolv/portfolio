import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, X, Sparkles } from "lucide-react";

// Import images
import halo1 from "@/assets/halo1.png";
import halo2 from "@/assets/halo2.png";
import halo3 from "@/assets/halo3.png";
import halo4 from "@/assets/halo4.png";
import npc from "@/assets/npc.png";
import npc2 from "@/assets/npc2.png";
import npc3 from "@/assets/npc3.png";
import gui from "@/assets/gui1.png";
import gui2 from "@/assets/gui2.png";
import crate from "@/assets/crate2.png";
import crate1 from "@/assets/crate.png";
import mm from "@/assets/mm1.png";
import mm2 from "@/assets/mm2.png";
import mm3 from "@/assets/mm3.png";
import plug from "@/assets/plug.png";
import s1 from "@/assets/setup.png";
import s2 from "@/assets/setup1.png";

interface Project {
  title: string;
  type: string;
  description: string;
  stats: string[];
  images?: string[];
}

const Portfolio = () => {
  const projects: Project[] = [
    {
      title: "HaloFlux Network",
      type: "Custom Lifesteal Server",
      description:
        "LifeSteal setup with economy, custom islands, and 200+ plugins.",
      stats: ["99.9% Uptime", "Custom Plugins"],
      images: [halo1, halo2, halo3, halo4],
    },
    {
      title: "NPCs",
      type: "Custom NPCS",
      description:
        "Cool NPCs with mythicMobs, Citizens, FancyNPCs etc",
      stats: ["NPCS with animations"],
      images: [npc, npc2, npc3],
    },
    {
      title: "GUIs Configurations",
      type: "Adding GUI textures to Menu's",
      description:
        "Configuration of menu's",
      stats: ["optimised menus", "no bugs"],
      images: [gui, gui2],
    },
    {
      title: "Crates Configurations",
      type: "Custom crates",
      description:
        "Configuration of crates",
      stats: ["custom model crates", "custom rewards"],
      images: [crate, crate1],
    },
    {
      title: "SetUps",
      type: "Custom Server Setups",
      description:
        "100+ plguins with custom made rps",
      stats: ["Optimized", "best service"],
      images: [s1, s2],
    },
    {
      title: "Custom Plugins",
      type: "Custom Plugin Development",
      description:
        "Custom made observation haki plugin(Fiction themed)",
      stats: ["Haki", "One Piece"],
      images: [plug],
    },
    {
      title: "MythicMobs configurations",
      type: "Custom entities",
      description:
        "Configuring custom mobs/entites for your server",
      stats: ["bosses", "npcs", "mobs"],
      images: [mm, mm2, mm3],
    },
  ];

  const [index, setIndex] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [direction, setDirection] = useState(1);
  const [isPaused, setIsPaused] = useState(false);

  const nextSlide = useCallback(() => {
    setDirection(1);
    setIndex((prev) => (prev + 1) % projects.length);
  }, [projects.length]);

  const prevSlide = useCallback(() => {
    setDirection(-1);
    setIndex((prev) => (prev - 1 + projects.length) % projects.length);
  }, [projects.length]);

  // Auto-slide with pause on hover
  useEffect(() => {
    if (isPaused || modalOpen) return;
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [isPaused, modalOpen, nextSlide]);

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 400 : -400,
      opacity: 0,
      scale: 0.9,
      rotateY: dir > 0 ? 15 : -15,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      rotateY: 0,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.46, 0.45, 0.94] as const,
      },
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -400 : 400,
      opacity: 0,
      scale: 0.9,
      rotateY: dir > 0 ? -15 : 15,
      transition: {
        duration: 0.4,
        ease: [0.25, 0.46, 0.45, 0.94] as const,
      },
    }),
  };

  const staggerContainer = {
    center: {
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.2,
      },
    },
  };

  const fadeUp = {
    enter: { opacity: 0, y: 20 },
    center: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" as const }
    },
  };

  const imageVariants = {
    enter: { opacity: 0, scale: 0.8, y: 20 },
    center: (i: number) => ({
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        delay: 0.3 + i * 0.1,
        duration: 0.4,
        ease: [0.25, 0.46, 0.45, 0.94] as const,
      },
    }),
  };

  return (
    <section id="work" className="py-32 px-6 relative overflow-hidden bg-secondary/20">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-accent/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <span className="inline-flex items-center gap-2 text-accent text-sm font-medium mb-4 tracking-wider uppercase">
            <Sparkles size={16} />
            Portfolio
          </span>
          <h2 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-foreground via-foreground to-muted-foreground bg-clip-text">
            Recent Work
          </h2>
        </motion.div>

        {/* Progress dots */}
        <div className="flex justify-center gap-2 mb-8">
          {projects.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setDirection(i > index ? 1 : -1);
                setIndex(i);
              }}
              className="group relative p-1"
            >
              <div className={`w-2 h-2 rounded-full transition-all duration-300 ${
                i === index 
                  ? "bg-accent scale-125" 
                  : "bg-muted-foreground/30 group-hover:bg-muted-foreground/50"
              }`} />
              {i === index && (
                <motion.div
                  layoutId="activeDot"
                  className="absolute inset-0 border-2 border-accent/50 rounded-full"
                  initial={false}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Slideshow */}
        <div 
          className="relative w-full max-w-5xl mx-auto h-[520px] perspective-1000"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={index}
              custom={direction}
              variants={{ ...slideVariants, ...staggerContainer }}
              initial="enter"
              animate="center"
              exit="exit"
              className="absolute inset-0 bg-gradient-to-br from-card to-card/80 border border-border/50 rounded-3xl p-8 shadow-2xl flex flex-col justify-between cursor-pointer group backdrop-blur-sm"
              onClick={() => setModalOpen(true)}
              style={{ transformStyle: "preserve-3d" }}
            >
              {/* Glow effect on hover */}
              <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-gradient-to-br from-accent/10 via-transparent to-primary/10" />
              
              <motion.div variants={fadeUp}>
                <span className="inline-block text-sm text-accent font-semibold tracking-wide uppercase mb-2 px-3 py-1 bg-accent/10 rounded-full">
                  {projects[index].type}
                </span>
                <h3 className="text-4xl md:text-5xl font-bold mb-3 group-hover:text-accent transition-colors duration-300">
                  {projects[index].title}
                </h3>
                <p className="text-muted-foreground leading-relaxed text-lg max-w-2xl mx-auto">
                  {projects[index].description}
                </p>
              </motion.div>

              {projects[index].images && (
                <div className="flex flex-wrap gap-3 justify-center mt-6">
                  {projects[index].images.map((img, i) => (
                    <motion.div
                      key={i}
                      custom={i}
                      variants={imageVariants}
                      initial="enter"
                      animate="center"
                      className="relative group/img overflow-hidden rounded-xl"
                    >
                      <img
                        src={img}
                        alt={`${projects[index].title} preview ${i + 1}`}
                        className="w-28 sm:w-36 md:w-44 h-28 sm:h-36 md:h-44 object-cover border border-border/50 rounded-xl shadow-lg transition-all duration-300 group-hover/img:scale-110 group-hover/img:border-accent/50"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover/img:opacity-100 transition-opacity duration-300 rounded-xl" />
                    </motion.div>
                  ))}
                </div>
              )}

              <motion.div variants={fadeUp} className="flex flex-wrap justify-center gap-3 mt-6">
                {projects[index].stats.map((stat, i) => (
                  <motion.span
                    key={stat}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 + i * 0.1 }}
                    className="px-4 py-2 bg-background/50 border border-border/50 text-sm rounded-full backdrop-blur-sm hover:border-accent/50 hover:bg-accent/5 transition-all duration-300"
                  >
                    {stat}
                  </motion.span>
                ))}
              </motion.div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Arrows */}
          <motion.button
            onClick={prevSlide}
            whileHover={{ scale: 1.1, x: -4 }}
            whileTap={{ scale: 0.95 }}
            className="absolute -left-6 md:-left-12 top-1/2 -translate-y-1/2 text-foreground bg-card/90 backdrop-blur-md rounded-full p-3 md:p-4 hover:bg-accent hover:text-accent-foreground transition-colors shadow-xl border border-border/50"
          >
            <ChevronLeft size={28} />
          </motion.button>

          <motion.button
            onClick={nextSlide}
            whileHover={{ scale: 1.1, x: 4 }}
            whileTap={{ scale: 0.95 }}
            className="absolute -right-6 md:-right-12 top-1/2 -translate-y-1/2 text-foreground bg-card/90 backdrop-blur-md rounded-full p-3 md:p-4 hover:bg-accent hover:text-accent-foreground transition-colors shadow-xl border border-border/50"
          >
            <ChevronRight size={28} />
          </motion.button>
        </div>

        {/* Click hint */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-muted-foreground/60 text-sm mt-6"
        >
          Click card to view details
        </motion.p>
      </div>

      {/* Modal Popup */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setModalOpen(false)}
          >
            <motion.div
              className="bg-gradient-to-br from-card to-card/95 rounded-3xl p-8 max-w-4xl w-full relative overflow-auto max-h-[90vh] border border-border/50 shadow-2xl"
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
            >
              <motion.button
                className="absolute top-4 right-4 text-muted-foreground hover:text-foreground bg-background/50 rounded-full p-2 transition-colors"
                onClick={() => setModalOpen(false)}
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
              >
                <X size={24} />
              </motion.button>

              <motion.span
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="inline-block text-sm text-accent font-semibold tracking-wide uppercase mb-2 px-3 py-1 bg-accent/10 rounded-full"
              >
                {projects[index].type}
              </motion.span>

              <motion.h3
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="text-4xl font-bold mb-4"
              >
                {projects[index].title}
              </motion.h3>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-muted-foreground mb-6 text-lg"
              >
                {projects[index].description}
              </motion.p>

              {projects[index].images && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                  {projects[index].images.map((img, i) => (
                    <motion.img
                      key={i}
                      src={img}
                      alt={`${projects[index].title} ${i + 1}`}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.25 + i * 0.1 }}
                      className="w-full aspect-square object-cover border border-border/50 rounded-xl shadow-lg hover:scale-105 transition-transform duration-300"
                    />
                  ))}
                </div>
              )}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex flex-wrap gap-3"
              >
                {projects[index].stats.map((stat) => (
                  <span
                    key={stat}
                    className="px-4 py-2 bg-background/50 border border-border/50 text-sm rounded-full"
                  >
                    {stat}
                  </span>
                ))}
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Portfolio;
