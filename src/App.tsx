import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import TargetCursor from "./components/TargetCursor";
import { useLocoScroll } from "./hooks/useLocoScroll";
import { useEffect, useState, createContext } from "react";

// Create a context for the loading state
export const LoadingContext = createContext<{ isLoading: boolean; setIsLoading: (loading: boolean) => void }>({
  isLoading: true,
  setIsLoading: () => {},
});

const queryClient = new QueryClient();

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  // Pass !isLoading to useLocoScroll so it only initializes when loading is complete
  const scrollRef = useLocoScroll(!isLoading);

  useEffect(() => {
    if (isLoading) {
      document.body.style.overflow = 'hidden';
    } else {
      // When loading is complete, unset overflow. Locomotive Scroll will then take over.
      document.body.style.overflow = 'unset';
      // No need to manually call update here, as it's handled by useLocoScroll's initialization
    }
  }, [isLoading]);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <LoadingContext.Provider value={{ isLoading, setIsLoading }}>
          <TargetCursor
            spinDuration={2}
            hideDefaultCursor
            parallaxOn
            hoverDuration={0.2}
          />
          <BrowserRouter>
            {/* Main scroll container for Locomotive Scroll */}
            <div className="main-scroll-container" data-scroll-container ref={scrollRef}>
              <Routes>
                <Route path="/" element={<Index />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
          </BrowserRouter>
        </LoadingContext.Provider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
