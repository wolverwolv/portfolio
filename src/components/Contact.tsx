import { Button } from "@/components/ui/button";

const Contact = () => {
  return (
    <section id="contact" className="py-32 px-6">
      <div className="container mx-auto text-center">
        <h2 className="text-6xl md:text-8xl font-bold mb-8">
          Let's Build<br/>Your Server
        </h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-12">
          Ready to create the ultimate Minecraft server experience? Let's discuss your vision and make it reality.
        </p>
        <Button 
          size="lg" 
          className="bg-accent text-accent-foreground hover:bg-accent/90 text-lg px-12 py-6 h-auto"
        >
          Get In Touch
        </Button>
      </div>
    </section>
  );
};

export default Contact;
