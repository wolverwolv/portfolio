import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import OrbitImages from './OrbitImages';
import { API_URL } from '@/config';
import halo1 from "@/assets/halo1.png"; // Example local asset for orbit fallback

interface LoadingScreenProps {
  children: React.ReactNode;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ children }) => {
  const [loadingComplete, setLoadingComplete] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(false);
  const [orbitImages, setOrbitImages] = useState<string[]>([]);

  useEffect(() => {
    const preloadData = async () => {
      try {
        // Fetch projects
        const projectsRes = await fetch(`${API_URL}/api/projects?t=${Date.now()}`);
        const projectsData = await projectsRes.json();
        const allProjectImages = projectsData.flatMap((p: any) => p.images || []).filter(Boolean);

        // Fetch reviews
        const reviewsRes = await fetch(`${API_URL}/api/reviews?t=${Date.now()}`);
        const reviewsData = await reviewsRes.json();
        const allReviewImages = reviewsData.map((r: any) => r.image).filter(Boolean);

        // Combine all images for the orbit animation
        const combinedImages = [...allProjectImages, ...allReviewImages];
        const uniqueImages = Array.from(new Set(combinedImages));

        // Use a subset for the orbit, mix with local fallbacks if not enough
        const orbitDisplayImages = uniqueImages.slice(0, 8);
        if (orbitDisplayImages.length < 8) {
          orbitDisplayImages.push(halo1); // Add a local fallback if not enough
        }
        setOrbitImages(orbitDisplayImages);

        // Simulate a minimum loading time for the animation to play
        await new Promise(resolve => setTimeout(resolve, 2000)); // Minimum 2 seconds loading

        setLoadingComplete(true);
      } catch (error) {
        console.error("Error preloading data:", error);
        setLoadingComplete(true); // Still allow content to show even if preload fails
      }
    };

    preloadData();
  }, []);

  return (
    <>
      <AnimatePresence>
        {!animationComplete && (
          <motion.div
            key="loading-screen"
            initial={{ opacity: 1 }}
            animate={{ opacity: loadingComplete ? 0 : 1 }}
            transition={{ duration: 1, delay: loadingComplete ? 1 : 0 }}
            onAnimationComplete={() => {
              if (loadingComplete) setAnimationComplete(true);
            }}
            className="fixed inset-0 z-[999] bg-background flex items-center justify-center overflow-hidden"
          >
            {/* Central "Big Bang" effect - Multiple layers for more dynamism */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale: loadingComplete ? [0, 1, 3, 0] : [0, 1], // Explode bigger
                opacity: loadingComplete ? [0, 1, 0.8, 0] : [0, 1]
              }}
              transition={{
                duration: loadingComplete ? 1.2 : 0.6,
                ease: loadingComplete ? "easeOut" : "easeIn",
                delay: loadingComplete ? 0.1 : 0 // Slight delay for the main explosion
              }}
              className="absolute w-80 h-80 bg-accent/30 rounded-full blur-3xl"
            />
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale: loadingComplete ? [0, 0.5, 2, 0] : [0, 0.5], // Inner, faster explosion
                opacity: loadingComplete ? [0, 1, 0.6, 0] : [0, 0.8]
              }}
              transition={{
                duration: loadingComplete ? 1 : 0.4,
                ease: loadingComplete ? "easeOut" : "easeIn",
                delay: loadingComplete ? 0 : 0 // Start slightly before main explosion
              }}
              className="absolute w-48 h-48 bg-accent/50 rounded-full blur-2xl"
            />
            {/* Flash effect */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: loadingComplete ? [0, 1, 0] : 0 }}
              transition={{ duration: 0.5, delay: loadingComplete ? 0.2 : 0 }}
              className="absolute inset-0 bg-white/80"
            />

            {/* Orbiting Images */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5, rotate: 0 }}
              animate={{
                opacity: 1,
                scale: loadingComplete ? 0.5 : 1, // Shrink slightly on exit
                rotate: loadingComplete ? 360 * 15 : 360 * 5 // Continuous fast spin, then MUCH faster on exit
              }}
              transition={{
                duration: loadingComplete ? 1.5 : 5, // Faster exit, continuous spin during load
                ease: "linear",
                repeat: loadingComplete ? 0 : Infinity, // Continuous during load, no repeat on exit
                delay: loadingComplete ? 0 : 0.5 // Start spin after a slight delay
              }}
              className="relative w-full h-full flex items-center justify-center"
            >
              {orbitImages.length > 0 && (
                <OrbitImages
                  images={orbitImages}
                  shape="ellipse"
                  radiusX={300}
                  radiusY={80}
                  rotation={-10}
                  duration={5} // Continuous spin duration
                  itemSize={80}
                  responsive={true}
                  radius={150}
                  direction="normal"
                  fill
                  showPath={false}
                  paused={false} // Always spinning during loading
                />
              )}
            </motion.div>

            {/* Loading Text */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{
                opacity: loadingComplete ? 0 : 1,
                y: loadingComplete ? -20 : 0
              }}
              transition={{ duration: 0.5, delay: loadingComplete ? 0 : 0.5 }}
              className="absolute text-4xl font-bold text-foreground z-10"
            >
              Loading...
            </motion.h1>
          </motion.div>
        )}
      </AnimatePresence>
      <div className={!animationComplete ? "filter blur-lg pointer-events-none" : ""}>
        {children}
      </div>
    </>
  );
};

export default LoadingScreen;
