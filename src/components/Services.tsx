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
        <h2 className="text-6xl md:text-8xl font-bold mb-20">
          What i do:
        </h2>
        
        <div className="grid md:grid-cols-2 gap-16">
          {services.map((service) => (
            <div key={service.category}>
              <h3 className="text-3xl font-bold mb-8 text-accent">
                {service.category}
              </h3>
              <ul className="space-y-4">
                {service.items.map((item) => (
                  <li
                    key={item}
                    className="text-xl text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
