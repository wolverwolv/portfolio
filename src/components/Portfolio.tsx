import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { X, Sparkles, ExternalLink, ImageOff, Loader2, Maximize2 } from "lucide-react";

// Import images (local assets)
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
  _id?: string;
}

const ImageViewer = ({ src, onClose }: { src: string; onClose: () => void }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center p-4 md:p-12 cursor-zoom-out"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <motion.button
        className="absolute top-6 right-6 text-white hover:text-accent bg-white/10 p-2 rounded-full backdrop-blur-md transition-colors z-[210]"
        onClick={onClose}
      >
        <X size={32} />
      </motion.button>
      <motion.img
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        src={src}
        className="max-w-full max-h-full object-contain rounded-lg shadow-2xl cursor-target"
        onClick={(e) => e.stopPropagation()}
      />
    </motion.div>
  );
};

export const ImageWithFallback = ({ src, alt, className, ...props }: any) => {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

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
        src={src}
        alt={alt}
        className={`${className} ${loading ? 'opacity-0 scale-105' : 'opacity-100 scale-100'} transition-all duration-500 ease-out`}
        onLoad={() => setLoading(false)}
        onError={() => {
          console.error(`Failed to load image: ${typeof src === 'string' ? src.substring(0, 50) : 'object'}`);
          setError(true);
        }}
        {...props}
      />
    </div>
  );
};

const TiltCard = ({ project, onClick }: { project: Project; onClick: () => void }) => {
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
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  return (
    <motion.div
      ref={cardRef}
      className="relative group cursor-pointer h-full cursor-target"
      style={{ perspective: 1000, transformStyle: "preserve-3d" }}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      onClick={onClick}
    >
      <motion.div
        className="relative h-full bg-gradient-to-br from-card via-card to-card/80 border border-border/40 rounded-2xl overflow-hidden flex flex-col shadow-lg"
        style={{ rotateX, rotateY, filter: useTransform(brightness, (b) => `brightness(${b})`) }}
      >
        <div className="relative h-56 overflow-hidden bg-secondary/20">
          <ImageWithFallback src={project.images?.[0]} alt={project.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent" />
          <span className="absolute top-3 left-3 text-[10px] font-bold text-accent bg-background/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-accent/20 uppercase">{project.type}</span>
        </div>
        <div className="p-5 flex-grow flex flex-col">
          <h3 className="text-xl font-bold mb-2 group-hover:text-accent transition-colors">{project.title}</h3>
          <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-2">{project.description}</p>
          <div className="flex flex-wrap gap-2 mt-auto">
            {project.stats.slice(0, 2).map((s) => (
              <span key={s} className="text-[10px] px-3 py-1 bg-background/60 border border-border/50 rounded-full text-muted-foreground uppercase font-semibold">{s}</span>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const Portfolio = () => {
  const initialProjects: Project[] = [
    { title: "HaloFlux Network", type: "Custom Lifesteal Server", description: "LifeSteal setup with economy, custom islands, and 200+ plugins.", stats: ["99.9% Uptime", "Custom Plugins"], images: [halo1, halo2, halo3, halo4] },
    { title: "NPCs", type: "Custom NPCS", description: "Cool NPCs with mythicMobs, Citizens, FancyNPCs etc", stats: ["NPCS with animations"], images: [npc, npc2, npc3] },
    { title: "GUIs Configurations", type: "Adding GUI textures to Menu's", description: "Configuration of menu's", stats: ["optimised menus", "no bugs"], images: [gui, gui2] },
    { title: "Crates Configurations", type: "Custom crates", description: "Configuration of crates", stats: ["custom model crates", "custom rewards"], images: [crate, crate1] },
    { title: "SetUps", type: "Custom Server Setups", description: "100+ plguins with custom made rps", stats: ["Optimized", "best service"], images: [s1, s2] },
    { title: "Custom Plugin", type: "Custom Plugin Development", description: "Custom made observation haki plugin(Fiction themed)", stats: ["Haki", "One Piece"], images: [plug] },
    { title: "MythicMobs interactable shell", type: "Custom entities", description: "Configuring custom mobs/entites for your server", stats: ["bosses", "npcs", "mobs"], images: [mm] },
  ];

  const [projects, setProjects] = useState<Project[]>(initialProjects);

  const fetchProjects = async () => {
    try {
      const res = await fetch(`${API_URL}/api/projects?t=${Date.now()}`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setProjects([...data, ...initialProjects]);
      }
    } catch (error) { console.error("Fetch failed:", error); }
  };

  useEffect(() => {
    fetchProjects();
    const interval = setInterval(fetchProjects, 60000);
    return () => clearInterval(interval);
  }, []);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [viewerImage, setViewerImage] = useState<string | null>(null);

  const openModal = (p: Project) => {
    setSelectedProject(p);
    setModalOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setModalOpen(false);
    document.body.style.overflow = "unset";
  };

  return (
    <section id="work" className="py-32 px-6 relative overflow-hidden bg-secondary/20">
      <div className="container mx-auto relative z-10">
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 text-accent text-sm font-medium mb-4 uppercase tracking-wider"><Sparkles size={16} />Portfolio</span>
          <h2 className="text-6xl md:text-8xl font-bold">Recent Work</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto auto-rows-fr">
          {projects.map((p, i) => ( <TiltCard key={p._id || i} project={p} onClick={() => openModal(p)} /> ))}
        </div>
      </div>
      <AnimatePresence>
        {modalOpen && selectedProject && (
          <motion.div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-[100] p-4 md:p-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeModal}>
            <motion.div className="bg-card rounded-3xl p-6 md:p-10 max-w-5xl w-full relative overflow-y-auto max-h-[95vh] border border-border/50 shadow-2xl" onClick={(e) => e.stopPropagation()}>
              <button className="absolute top-4 right-4 text-muted-foreground hover:text-foreground bg-background/50 rounded-full p-2 z-[110] cursor-target" onClick={closeModal}><X size={24} /></button>
              <div className="flex flex-col gap-8">
                <div>
                  <span className="inline-block text-sm text-accent font-semibold tracking-wide uppercase mb-3 px-4 py-1.5 bg-accent/10 rounded-full border border-accent/20">{selectedProject.type}</span>
                  <h3 className="text-4xl md:text-5xl font-bold mb-6">{selectedProject.title}</h3>
                  <p className="text-muted-foreground mb-8 text-lg leading-relaxed max-w-3xl">{selectedProject.description}</p>
                  <div className="flex flex-wrap gap-3 mb-8">{selectedProject.stats.map((s) => ( <span key={s} className="px-5 py-2 bg-background/50 border border-border/50 text-sm rounded-2xl font-medium">{s}</span> ))}</div>
                </div>
                {selectedProject.images && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedProject.images.map((img, i) => (
                      <div key={i} className={`relative group cursor-zoom-in overflow-hidden rounded-2xl border border-border/50 cursor-target`} onClick={() => setViewerImage(img)}>
                        <ImageWithFallback src={img} alt="Project" className="w-full h-full object-cover min-h-[300px]" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center"><div className="bg-background/80 px-6 py-3 rounded-full flex items-center gap-2 font-bold"><Maximize2 size={20} className="text-accent" />View Image</div></div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>{viewerImage && ( <ImageViewer src={viewerImage} onClose={() => setViewerImage(null)} /> )}</AnimatePresence>
    </section>
  );
};

export default Portfolio;
