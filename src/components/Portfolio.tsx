import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { X, Sparkles, ExternalLink } from "lucide-react";

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
}

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
      className="relative group cursor-pointer"
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
        className="relative h-full bg-gradient-to-br from-card via-card to-card/80 border border-border/40 rounded-2xl overflow-hidden"
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
        <div className="relative h-48 overflow-hidden">
          {project.images && project.images[0] && (
            <motion.img
              src={project.images[0]}
              alt={project.title}
              className="w-full h-full object-cover"
              style={{ transformStyle: "preserve-3d", translateZ: 20 }}
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.4 }}
            />
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
            <div className="p-2 bg-accent/90 rounded-full text-accent-foreground">
              <ExternalLink size={14} />
            </div>
          </motion.div>
        </div>
        
        {/* Content */}
        <div className="p-5" style={{ transformStyle: "preserve-3d" }}>
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
            className="flex flex-wrap gap-2"
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
      title: "Christmas Event",
      type: "Custom Lifesteal Server",
      description:
        "LifeSteal setup with economy, custom islands, and 200+ plugins.",
      stats: ["99.9% Uptime", "Custom Plugins"],
      images: [halo1, halo2, halo3, halo4],
    },
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

  const [projects, setProjects] = useState<Project[]>(initialProjects);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch(`${API_URL}/api/projects`);
        const data = await res.json();
        if (Array.isArray(data)) {
          setProjects([...data, ...initialProjects]);
        }
      } catch (error) {
        console.error("Failed to fetch projects:", error);
      }
    };
    fetchProjects();
  }, []);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const openModal = (project: Project) => {
    setSelectedProject(project);
    setModalOpen(true);
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {projects.map((project, index) => (
            <TiltCard
              key={project.title}
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
                className="absolute top-4 right-4 text-muted-foreground hover:text-foreground bg-background/50 rounded-full p-2 transition-colors z-10"
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
                {selectedProject.type}
              </motion.span>

              <motion.h3
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="text-4xl font-bold mb-4"
              >
                {selectedProject.title}
              </motion.h3>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-muted-foreground mb-6 text-lg"
              >
                {selectedProject.description}
              </motion.p>

              {selectedProject.images && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                  {selectedProject.images.map((img, i) => (
                    <motion.img
                      key={i}
                      src={img}
                      alt={`${selectedProject.title} ${i + 1}`}
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
                {selectedProject.stats.map((stat) => (
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
