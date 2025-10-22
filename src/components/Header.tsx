import { Menu } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const Header = () => {
  const [open, setOpen] = useState(false);

  const navItems = [
    { title: "Services", href: "#services" },
    { title: "Portfolio", href: "#work" },
    { title: "Contact", href: "#contact" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="text-2xl font-bold tracking-tight">
          WolvDoesStuff
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-8">
          {navItems.map((item) => (
            <a
              key={item.title}
              href={item.href}
              className="text-sm font-medium hover:text-accent transition-colors"
            >
              {item.title}
            </a>
          ))}
        </nav>

        {/* Mobile Menu */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-full bg-background">
            <nav className="flex flex-col gap-6 mt-8">
              {navItems.map((item) => (
                <a
                  key={item.title}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="text-2xl font-bold hover:text-accent transition-colors"
                >
                  {item.title}
                </a>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};

export default Header;
