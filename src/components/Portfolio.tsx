import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

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
import crate from "@/assets/crate2.png"
import crate1 from "@/assets/crate.png"
import mm from "@/assets/mm1.png"
import mm2 from "@/assets/mm2.png"
import mm3 from "@/assets/mm3.png"
import plug from "@/assets/plug.png"
import s1 from "@/assets/setup.png"
import s2 from "@/assets/setup1.png"

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

  // Auto-slide
  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % projects.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [projects.length]);

  const nextSlide = () => setIndex((prev) => (prev + 1) % projects.length);
  const prevSlide = () =>
    setIndex((prev) => (prev - 1 + projects.length) % projects.length);

  return (
    <section id="work" className="py-32 px-6 relative overflow-hidden bg-secondary/20">
      <div className="container mx-auto text-center">
        <h2 className="text-6xl md:text-8xl font-bold mb-16">Recent Work</h2>

        {/* Slideshow */}
        <div className="relative w-full max-w-5xl mx-auto h-[500px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 150 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -150 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className="absolute inset-0 bg-card border border-border rounded-2xl p-8 shadow-lg flex flex-col justify-between hover:shadow-xl hover:border-accent transition-all duration-300 cursor-pointer"
              onClick={() => setModalOpen(true)}
            >
              <div>
                <span className="text-sm text-accent font-medium">{projects[index].type}</span>
                <h3 className="text-4xl font-bold mb-4 group-hover:text-accent transition-colors">
                  {projects[index].title}
                </h3>
                <p className="text-muted-foreground mb-4 leading-relaxed text-lg">
                  {projects[index].description}
                </p>
              </div>

              {projects[index].images && (
                <div className="flex flex-wrap gap-3 justify-center mt-4">
                  {projects[index].images.map((img, i) => (
                    <img
                      key={i}
                      src={img}
                      alt={`Project ${projects[index].title} ${i}`}
                      className="w-32 sm:w-40 md:w-48 h-32 sm:h-40 md:h-48 object-cover border border-border rounded-lg shadow-md"
                    />
                  ))}
                </div>
              )}

              <div className="flex flex-wrap justify-center gap-3 mt-6">
                {projects[index].stats.map((stat) => (
                  <span
                    key={stat}
                    className="px-4 py-2 bg-background border border-border text-sm rounded-md"
                  >
                    {stat}
                  </span>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Arrows */}
          <button
            onClick={prevSlide}
            className="absolute -left-10 top-1/2 -translate-y-1/2 text-accent bg-background/70 backdrop-blur-md rounded-full p-4 hover:bg-background/80 transition shadow-lg"
          >
            <ChevronLeft size={32} />
          </button>

          <button
            onClick={nextSlide}
            className="absolute -right-10 top-1/2 -translate-y-1/2 text-accent bg-background/70 backdrop-blur-md rounded-full p-4 hover:bg-background/80 transition shadow-lg"
          >
            <ChevronRight size={32} />
          </button>
        </div>
      </div>

      {/* Modal Popup */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setModalOpen(false)}
          >
            <motion.div
              className="bg-card rounded-2xl p-6 max-w-3xl w-full relative overflow-auto"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute top-4 right-4 text-accent hover:text-red-500"
                onClick={() => setModalOpen(false)}
              >
                <X size={28} />
              </button>

              <h3 className="text-3xl font-bold mb-4">{projects[index].title}</h3>
              <p className="text-muted-foreground mb-4">{projects[index].description}</p>

              {projects[index].images && (
                <div className="flex flex-wrap gap-3 mb-4 justify-center">
                  {projects[index].images.map((img, i) => (
                    <img
                      key={i}
                      src={img}
                      alt={`Project ${i}`}
                      className="w-32 sm:w-40 md:w-48 h-32 sm:h-40 md:h-48 object-cover border border-border rounded-lg shadow-md"
                    />
                  ))}
                </div>
              )}

              <div className="flex flex-wrap gap-3 justify-center">
                {projects[index].stats.map((stat) => (
                  <span
                    key={stat}
                    className="px-4 py-2 bg-background border border-border text-sm rounded-md"
                  >
                    {stat}
                  </span>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Portfolio;
