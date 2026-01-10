import { useState } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { motion } from "framer-motion";

const Contact = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section id="contact" className="py-32 px-6">
      <div className="container mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-6xl md:text-8xl font-bold mb-8">
          Let's Build<br />Your Server
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-12">
          Ready to create the ultimate Minecraft server experience? Let's discuss your vision and make it reality.{" "}
          <a
            href="https://discord.com/channels/915849624718299166/991478519337066556/1426817639350665309"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent hover:underline"
          >
            Order through Arcane Studios
          </a>
          </p>

          <Button
          size="lg"
          className="bg-accent text-accent-foreground hover:bg-accent/90 text-lg px-12 py-6 h-auto"
          onClick={() => setIsOpen(true)}
          >
          Get In Touch
          </Button>
        </motion.div>

        {/* Popup Modal */}
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-background border border-border rounded-xl p-8 max-w-md w-full relative shadow-lg">
              <button
                className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
                onClick={() => setIsOpen(false)}
              >
                <X size={24} />
              </button>
              <h3 className="text-2xl font-bold mb-4">Contact Me</h3>
              <ul className="space-y-3 text-lg text-muted-foreground">
                <li>
                  📧 Email:{" "}
                  <a
                    href="mailto:Wolverw0lv7@gmail.com"
                    className="text-accent hover:underline"
                  >
                    Email Me
                  </a>
                </li>
                <li>
                  💬 Discord:{" "}
                  <a
                    href="https://discord.gg/cCsaBwVaqb"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent hover:underline"
                  >
                    wolver_wol
                  </a>
                </li>
                <li>
                  🌐 Community:{" "}
                  <a
                    href="https://discord.gg/cCsaBwVaqb"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent hover:underline"
                  >
                    Join my community
                  </a>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Contact;
