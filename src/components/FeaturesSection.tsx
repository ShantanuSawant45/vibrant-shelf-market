import { Truck, Shield, RotateCcw, Headphones } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: Truck,
    title: "Free Shipping",
    description: "Free delivery on orders over $50"
  },
  {
    icon: Shield,
    title: "Secure Payment",
    description: "Your payment information is safe"
  },
  {
    icon: RotateCcw,
    title: "Easy Returns",
    description: "30-day hassle-free returns"
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    description: "Customer support around the clock"
  }
];

const FeaturesSection = () => {
  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={feature.title} className="text-center border-none shadow-card hover:shadow-card-hover transition-all duration-300">
              <CardContent className="pt-8 pb-6">
                <div className="mb-4 inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full">
                  <feature.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;