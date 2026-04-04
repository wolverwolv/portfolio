import { useLocation } from "react-router-dom";
import PillNav from "./PillNav";
import logo from "/favicon.ico";
import { useContext } from "react";
import { LoadingContext } from "@/App";
import { motion, AnimatePresence } from "framer-motion";

const Header = () => {
  const location = useLocation();
  const { isLoading } = useContext(LoadingContext);

  const navItems = [
    { label: "Home", href: "#" },
    { label: "Services", href: "#services" },
    { label: "Portfolio", href: "#work" },
    { label: "Reviews", href: "#reviews" },
    { label: "Contact", href: "#contact" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 pointer-events-none">
      <AnimatePresence>
        {!isLoading && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="container mx-auto px-6 py-4 flex justify-center pointer-events-auto"
          >
            <PillNav
              logo={logo}
              logoAlt="WolvDoesStuff Logo"
              items={navItems}
              activeHref={location.hash || "#"}
              baseColor="#0a0a0a"
              pillColor="#1a1a1a"
              pillTextColor="#ffffff"
              hoveredPillTextColor="#00ffcc"
              ease="power3.out"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
