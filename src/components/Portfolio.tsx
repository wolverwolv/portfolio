import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { X, Sparkles, ExternalLink, ImageOff, Loader2 } from "lucide-react";

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
import { API_URL } from "@/config";

interface Project {
  title: string;
  type: string;
  description: string;
  stats: string[];
  images?: string[];
  _id?: string; // MongoDB ID
}

const ImageWithFallback = ({ src, alt, className, ...props }: any) => {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  // Helper to get the correct image source
  const getFullSrc = (url: string) => {
    if (!url) return "/placeholder.svg";
    // If url is a local asset import (not a string but an image module)
    if (typeof url !== 'string') return url;

    // If it's a relative path from our server
    if (url.startsWith("/uploads")) {
      return `${API_URL}${url}`;
    }
    return url;
  };

  if (error || !src) {
    return (
      <div className={`${className} bg-secondary/30 flex items-center justify-center flex-col gap-2 text-muted-foreground min-h-[100px]`}>
        <ImageOff size={24} />
        <span className="text-xs">Image unavailable</span>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {loading && (
        <div className="absolute inset-0 bg-secondary/30 flex items-center justify-center">
          <Loader2 className="animate-spin text-accent/50" size={24} />
        </div>
      )}
      <img
        src={getFullSrc(src)}
        alt={alt}
        className={`${className} ${loading ? 'opacity-0 scale-105' : 'opacity-100 scale-100'} transition-all duration-500 ease-out`}
        onLoad={() => setLoading(false)}
        onError={() => {
          console.error(`Failed to load image: ${src}`);
          setError(true);
        }}
        {...props}
      />
    </div>
  );
};

// 3D Tilt Card Component
const TiltCard = ({ 
  project, 
  onClick 
}: { 
  project: Project; 
  onClick: () => void;
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 15 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 15 });
  
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["12deg", "-12deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-12deg", "12deg"]);
  const brightness = useTransform(mouseXSpring, [-0.5, 0, 0.5], [0.9, 1, 1.1]);
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    
    x.set(xPct);
    y.set(yPct);
  };
  
  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      className="relative group cursor-pointer h-full"
      style={{
        perspective: 1000,
        transformStyle: "preserve-3d",
      }}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
    >
      <motion.div
        className="relative h-full bg-gradient-to-br from-card via-card to-card/80 border border-border/40 rounded-2xl overflow-hidden flex flex-col"
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
          filter: useTransform(brightness, (b) => `brightness(${b})`),
        }}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
      >
        {/* Shine effect */}
        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{
            background: useTransform(
              [mouseXSpring, mouseYSpring],
              ([latestX, latestY]) => 
                `radial-gradient(600px circle at ${(Number(latestX) + 0.5) * 100}% ${(Number(latestY) + 0.5) * 100}%, rgba(255,255,255,0.1), transparent 40%)`
            ),
          }}
        />
        
        {/* Border glow */}
        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none border-2 border-accent/30" />
        
        {/* Image */}
        <div className="relative h-48 overflow-hidden bg-secondary/20">
          {project.images && project.images[0] ? (
            <ImageWithFallback
              src={project.images[0]}
              alt={project.title}
              className="w-full h-full object-cover"
              style={{ transformStyle: "preserve-3d", translateZ: 20 }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ImageOff className="text-muted-foreground/30" size={32} />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent" />
          
          {/* Floating badge */}
          <motion.span 
            className="absolute top-3 left-3 text-xs font-semibold text-accent bg-background/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-accent/20"
            style={{ translateZ: 40 }}
          >
            {project.type}
          </motion.span>
          
          {/* View icon */}
          <motion.div
            className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300"
            style={{ translateZ: 50 }}
          >
            <div className="p-2 bg-accent/90 rounded-full text-accent-foreground shadow-lg">
              <ExternalLink size={14} />
            </div>
          </motion.div>
        </div>
        
        {/* Content */}
        <div className="p-5 flex-grow flex flex-col" style={{ transformStyle: "preserve-3d" }}>
          <motion.h3 
            className="text-xl font-bold mb-2 group-hover:text-accent transition-colors duration-300"
            style={{ translateZ: 30 }}
          >
            {project.title}
          </motion.h3>
          
          <motion.p 
            className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-2"
            style={{ translateZ: 20 }}
          >
            {project.description}
          </motion.p>
          
          {/* Stats */}
          <motion.div 
            className="flex flex-wrap gap-2 mt-auto"
            style={{ translateZ: 25 }}
          >
            {project.stats.slice(0, 2).map((stat) => (
              <span
                key={stat}
                className="text-xs px-3 py-1 bg-background/60 border border-border/50 rounded-full text-muted-foreground"
              >
                {stat}
              </span>
            ))}
          </motion.div>
          
          {/* Image count indicator */}
          {project.images && project.images.length > 1 && (
            <motion.div 
              className="absolute bottom-4 right-4 text-xs text-muted-foreground/60"
              style={{ translateZ: 20 }}
            >
              +{project.images.length - 1} more
            </motion.div>
          )}
        </div>
        
        {/* Bottom accent line */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-accent/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </motion.div>
    </motion.div>
  );
};

const Portfolio = () => {
  const initialProjects: Project[] = [
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
      title: "Custom Plugin",
      type: "Custom Plugin Development",
      description:
        "Custom made observation haki plugin(Fiction themed)",
      stats: ["Haki", "One Piece"],
      images: [plug],
    },
    {
      title: "MythicMobs interactable shell",
      type: "Custom entities",
      description:
        "Configuring custom mobs/entites for your server",
      stats: ["bosses", "npcs", "mobs"],
      images: [mm],
    },
  ];

  const [projects, setProjects] = useState<Project[]>(() => {
    // Try to load from localStorage on initial render
    const saved = localStorage.getItem("cached_projects");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return [...parsed, ...initialProjects];
      } catch (e) {
        return initialProjects;
      }
    }
    return initialProjects;
  });

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch(`${API_URL}/api/projects`);
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        if (Array.isArray(data)) {
          // Cache to localStorage
          localStorage.setItem("cached_projects", JSON.stringify(data));
          // Put new projects first
          setProjects([...data, ...initialProjects]);
        }
      } catch (error) {
        console.error("Failed to fetch projects, using cached/initial data:", error);
      }
    };
    fetchProjects();
  }, []);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const openModal = (project: Project) => {
    setSelectedProject(project);
    setModalOpen(true);
    // Prevent body scroll
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setModalOpen(false);
    // Restore body scroll
    document.body.style.overflow = "unset";
  };

  return (
    <section id="work" className="py-32 px-6 relative overflow-hidden bg-secondary/20">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-accent/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/3 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 text-accent text-sm font-medium mb-4 tracking-wider uppercase">
            <Sparkles size={16} />
            Portfolio
          </span>
          <h2 className="text-6xl md:text-8xl font-bold">
            Recent Work
          </h2>
        </motion.div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto auto-rows-fr">
          {projects.map((project, index) => (
            <TiltCard
              key={project._id || `${project.title}-${index}`}
              project={project}
              onClick={() => openModal(project)}
            />
          ))}
        </div>
      </div>

      {/* Modal Popup */}
      <AnimatePresence>
        {modalOpen && selectedProject && (
          <motion.div
            className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-[100] p-4 md:p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={closeModal}
          >
            <motion.div
              className="bg-gradient-to-br from-card to-card/95 rounded-3xl p-6 md:p-10 max-w-5xl w-full relative overflow-y-auto max-h-[95vh] border border-border/50 shadow-[0_0_50px_rgba(0,0,0,0.5)]"
              initial={{ scale: 0.9, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 30 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
            >
              <motion.button
                className="fixed md:absolute top-4 right-4 text-muted-foreground hover:text-foreground bg-background/50 backdrop-blur-md rounded-full p-2 transition-all z-[110] border border-border/50"
                onClick={closeModal}
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
              >
                <X size={24} />
              </motion.button>

              <div className="flex flex-col gap-8">
                <div>
                  <motion.span
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="inline-block text-sm text-accent font-semibold tracking-wide uppercase mb-3 px-4 py-1.5 bg-accent/10 rounded-full border border-accent/20"
                  >
                    {selectedProject.type}
                  </motion.span>

                  <motion.h3
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="text-4xl md:text-5xl font-bold mb-6 text-foreground"
                  >
                    {selectedProject.title}
                  </motion.h3>

                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-muted-foreground mb-8 text-lg md:text-xl leading-relaxed max-w-3xl"
                  >
                    {selectedProject.description}
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="flex flex-wrap gap-3 mb-8"
                  >
                    {selectedProject.stats.map((stat) => (
                      <span
                        key={stat}
                        className="px-5 py-2.5 bg-background/50 border border-border/50 text-sm md:text-base rounded-2xl font-medium"
                      >
                        {stat}
                      </span>
                    ))}
                  </motion.div>
                </div>

                {selectedProject.images && selectedProject.images.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedProject.images.map((img, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.35 + i * 0.1 }}
                        className={`${i === 0 && selectedProject.images!.length % 2 !== 0 ? 'md:col-span-2' : ''} group relative overflow-hidden rounded-2xl border border-border/50 shadow-lg bg-secondary/10`}
                      >
                        <ImageWithFallback
                          src={img}
                          alt={`${selectedProject.title} ${i + 1}`}
                          className="w-full h-full object-cover min-h-[300px] max-h-[500px] transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
                           <span className="bg-background/80 backdrop-blur-md px-4 py-2 rounded-full text-sm font-medium border border-border/50">View Image</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Portfolio;
