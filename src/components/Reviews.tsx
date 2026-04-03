import { useRef, useState, useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";
import { Star, Quote, Maximize2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import r1 from "@/assets/r1.png";
import r2 from "@/assets/r2.png";
import r3 from "@/assets/r3.png";
import r4 from "@/assets/r4.png";
import r5 from "@/assets/r5.png";
import { API_URL } from "@/config";
import { ImageWithFallback } from "./Portfolio";

interface Review {
  name: string;
  role: string;
  image: string;
  rating: number;
  date: string;
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
        className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      />
    </motion.div>
  );
};

const ReviewCard = ({ review, onImageClick }: { review: Review, onImageClick: (src: string) => void }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 15 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 15 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["12deg", "-12deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-12deg", "12deg"]);
  const brightness = useTransform(mouseXSpring, [-0.5, 0, 0.5], [0.95, 1, 1.05]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      className="relative group h-full"
      style={{ perspective: 1000, transformStyle: "preserve-3d" }}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        className="relative h-full bg-gradient-to-br from-card via-card to-card/80 border border-border/40 rounded-2xl p-8 flex flex-col shadow-lg"
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
          filter: useTransform(brightness, (b) => `brightness(${b})`),
        }}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
      >
        <div className="absolute top-6 right-6 text-accent/10 group-hover:text-accent/20 transition-colors duration-300" style={{ transform: "translateZ(20px)" }}>
          <Quote size={48} />
        </div>

        <div className="flex-1 mb-6 relative z-10" style={{ transformStyle: "preserve-3d", transform: "translateZ(30px)" }}>
          <div className="flex gap-1 mb-4 text-yellow-500/80">
            {[...Array(review.rating)].map((_, i) => (
              <Star key={i} size={16} fill="currentColor" />
            ))}
          </div>

          <div
            className="rounded-xl overflow-hidden border border-border/50 bg-black/20 relative aspect-video cursor-zoom-in"
            onClick={() => onImageClick(review.image)}
          >
            <ImageWithFallback
              src={review.image} 
              alt={`${review.name}'s review`}
              className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-all duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
              <div className="bg-background/80 backdrop-blur-md px-4 py-2 rounded-full flex items-center gap-2 font-bold shadow-xl border border-border/50 scale-90 group-hover:scale-100 transition-transform">
                <Maximize2 size={16} className="text-accent" />
                <span className="text-sm">View</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 mt-auto pt-6 border-t border-border/30" style={{ transformStyle: "preserve-3d", transform: "translateZ(20px)" }}>
          <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center text-accent font-bold text-xl border border-accent/20">
            {review.name.charAt(0)}
          </div>
          <div>
            <h4 className="font-bold text-foreground group-hover:text-accent transition-colors duration-300">{review.name}</h4>
            <p className="text-sm text-muted-foreground">{review.role}</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const Reviews = () => {
  const [visibleCount, setVisibleCount] = useState(3);
  const initialReviews: Review[] = [
    { name: "unipotatoo", role: "client", image: r1, rating: 5, date: "6 months ago" },
    { name: "kafer", role: "client", image: r2, rating: 5, date: "1 month ago" },
    { name: "Jay", role: "client", image: r3, rating: 5, date: "2 months ago" },
    { name: "nugget", role: "client", image: r4, rating: 5, date: "3 months ago" },
    { name: "nugget", role: "client", image: r5, rating: 5, date: "3 months ago" }
  ];

  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem("cached_reviews");
    if (saved) {
      try { return [...JSON.parse(saved), ...initialReviews]; } catch (e) { return initialReviews; }
    }
    return initialReviews;
  });

  const [viewerImage, setViewerImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch(`${API_URL}/api/reviews`);
        const data = await res.json();
        if (Array.isArray(data)) {
          localStorage.setItem("cached_reviews", JSON.stringify(data));
          setReviews([...data, ...initialReviews]);
        }
      } catch (error) { console.error("Failed to fetch reviews:", error); }
    };
    fetchReviews();
  }, []);

  const handleLoadMore = () => setVisibleCount((prev) => Math.min(prev + 3, reviews.length));

  return (
    <section id="reviews" className="py-32 px-6 relative overflow-hidden">
      <div className="container mx-auto relative z-10">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-20">
          <span className="inline-flex items-center gap-2 text-accent text-sm font-medium mb-4 tracking-wider uppercase"><Star size={16} />Testimonials</span>
          <h2 className="text-6xl md:text-8xl font-bold">Client Reviews</h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto auto-rows-fr">
          {reviews.slice(0, visibleCount).map((review, index) => (
            <ReviewCard key={index} review={review} onImageClick={(src) => setViewerImage(src)} />
          ))}
        </div>

        {visibleCount < reviews.length && (
          <div className="text-center mt-16">
            <Button onClick={handleLoadMore} size="lg" variant="outline" className="min-w-[200px]">Load More Reviews</Button>
          </div>
        )}
      </div>

      <AnimatePresence>
        {viewerImage && (
          <ImageViewer
            src={typeof viewerImage === 'string' && viewerImage.startsWith('/uploads') ? `${API_URL}${viewerImage}` : viewerImage}
            onClose={() => setViewerImage(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
};

export default Reviews;
