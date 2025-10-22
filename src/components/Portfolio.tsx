const Portfolio = () => {
  const projects = [
    {
      title: "SkyBlock Network",
      type: "Custom Skyblock Server",
      description: "Full custom skyblock setup with economy, custom islands, and 200+ plugins optimized for 500+ concurrent players.",
      stats: ["500+ Players", "99.9% Uptime", "Custom Plugins"],
    },
    {
      title: "Survival RPG",
      type: "Modded Survival",
      description: "Heavily modded survival server with custom quests, classes, and balanced progression system. 150+ mods configured.",
      stats: ["150+ Mods", "Custom Quests", "Balanced Economy"],
    },
    {
      title: "Prison Server",
      type: "Prison Game Mode",
      description: "Complete prison server with rankup system, custom mines, PvP arena, and automated events. Fully optimized.",
      stats: ["24/7 Events", "Rankup System", "PvP Arena"],
    },
    {
      title: "Creative Build",
      type: "Creative + WorldEdit",
      description: "Advanced creative server with WorldEdit, VoxelSniper, and custom building tools. Perfect for build teams.",
      stats: ["WorldEdit", "VoxelSniper", "Plot System"],
    },
  ];

  return (
    <section id="work" className="py-32 px-6 bg-secondary/20">
      <div className="container mx-auto">
        <h2 className="text-6xl md:text-8xl font-bold mb-20">
          Recent Work
        </h2>

        <div className="grid md:grid-cols-2 gap-8">
          {projects.map((project) => (
            <div
              key={project.title}
              className="border border-border bg-card p-8 hover:border-accent transition-all duration-300 group"
            >
              <div className="mb-4">
                <span className="text-sm text-accent font-medium">
                  {project.type}
                </span>
              </div>
              <h3 className="text-3xl font-bold mb-4 group-hover:text-accent transition-colors">
                {project.title}
              </h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                {project.description}
              </p>
              <div className="flex flex-wrap gap-3">
                {project.stats.map((stat) => (
                  <span
                    key={stat}
                    className="px-4 py-2 bg-background border border-border text-sm"
                  >
                    {stat}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Portfolio;
