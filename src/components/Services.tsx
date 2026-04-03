import { motion } from "framer-motion";

const Services = () => {
  const services = [
    {
      category: "Server Setup",
      items: [
        "Custom Server Configuration",
        "Performance Optimization",
        "Plugin Installation & Setup",
        "World Generation & Management",
        "Backup Systems & Recovery",
        " ",
        "And many more!",
      ],
    },
    {
      category: "Advanced Services",
      items: [
        "Permission Systems (LuckPerms)",
        "Economy & Shop Setup",
        "Custom Game Modes",
        "Anti-Cheat Integration",
        "Mythic Mobs configuration",
        "Simple Plugin development",
        " ",
        "And many more!",
      ],
    },
  ];

  return (
    <section id="services" className="py-32 px-6">
      <div className="container mx-auto">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-6xl md:text-8xl font-bold mb-20"
        >
          What i do:
        </motion.h2>
        
        <div className="grid md:grid-cols-2 gap-16">
          {services.map((service, index) => (
            <motion.div 
              key={service.category}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
            >
              <h3 className="text-3xl font-bold mb-8 text-accent">
                {service.category}
              </h3>
              <ul className="space-y-4">
                {service.items.map((item, i) => (
                  <motion.li
                    key={item}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.1 + (i * 0.05) }}
                    className="text-xl text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                  >
                    {item}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
