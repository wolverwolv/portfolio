import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NotFound from "./pages/NotFound";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Services from "./components/Services";
import Portfolio from "./components/Portfolio";
import Reviews from "./components/Reviews";
import Contact from "./components/Contact";
import GradualBlur from "./components/GradualBlur";
import Footer from "./components/Footer";

const queryClient = new QueryClient();

const Index = () => (
  <main className="bg-background min-h-screen text-foreground">
    <style>{`
      html {
        scroll-behavior: smooth;
      }
    `}</style>
    <Header />
    <Hero />
    <Services />
    <Portfolio />
    <Reviews />
    <Contact />
    <GradualBlur preset="page-footer" strength={0.6} height="4rem" zIndex={40} />
    <Footer />
  </main>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
