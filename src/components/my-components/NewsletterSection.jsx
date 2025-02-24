import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
const NewsletterSection = () => {
  return (
    <section className="py-8 lg:py-12 max-w-8xl mx-auto px-5 xl:px-0">
      <div className="bg-primary/10 rounded-md px-5 py-12">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            Stay Updated with Study Sphere
          </h2>
          <p className="text-muted-foreground mb-6">
            Subscribe to our newsletter for the latest study tips, tutor
            spotlights, and exclusive offers.
          </p>
          <div className="flex space-x-2">
            <Input
              type="email"
              placeholder="Enter your email"
              className="flex-grow"
            />
            <Button>Subscribe</Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSection;
