import { useEffect, useState } from "react";
import { API_URL } from "@/config";

const Footer = () => {
  const [status, setStatus] = useState<"online" | "offline">("offline");

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const res = await fetch(`${API_URL}/api/health`);
        if (res.ok) setStatus("online");
      } catch (e) {
        setStatus("offline");
      }
    };
    checkStatus();
    const interval = setInterval(checkStatus, 30000); // Check every 30s
    return () => clearInterval(interval);
  }, []);

  return (
    <footer className="border-t border-border py-8 px-6">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="text-sm text-muted-foreground">
          WolvDoesStuff
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span>© 2025 All rights reserved.</span>
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/50 border border-border/50">
            <div className={`w-2 h-2 rounded-full ${status === "online" ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" : "bg-red-500"}`} />
            <span className="text-xs font-medium uppercase tracking-wider">{status === "online" ? "System Online" : "System Offline"}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
