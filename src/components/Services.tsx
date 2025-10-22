const Services = () => {
  const services = [
    {
      category: "Branding",
      items: [
        "Visual Identity Design",
        "Brand Strategy",
        "Brand Development",
        "Rebrands",
        "Online Brand Presence",
        "Audits and Design Studies",
      ],
    },
    {
      category: "Websites",
      items: [
        "Web Design",
        "Custom Code",
        "E-commerce",
        "CMS Integration",
        "UI System Design",
        "Webflow Development",
      ],
    },
  ];

  return (
    <section id="services" className="py-32 px-6">
      <div className="container mx-auto">
        <h2 className="text-6xl md:text-8xl font-bold mb-20">
          What We Do
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
