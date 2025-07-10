import { Card } from "@/components/ui/card";

interface CategoryCardProps {
  title: string;
  image: string;
  itemCount: string;
  featured?: boolean;
}

const CategoryCard = ({ title, image, itemCount, featured = false }: CategoryCardProps) => {
  return (
    <Card 
      className={`group cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-card-hover hover:-translate-y-2 bg-gradient-card border-muted/30 ${
        featured ? 'lg:col-span-2 lg:row-span-2' : ''
      }`}
    >
      <div className="relative">
        <div className={`overflow-hidden ${featured ? 'h-80' : 'h-48'}`}>
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
        
        {/* Content Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4 text-primary-foreground transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <h3 className="text-lg font-semibold mb-1">{title}</h3>
          <p className="text-sm opacity-90">{itemCount}</p>
        </div>
        
        {/* Static Content */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-primary/80 to-transparent group-hover:opacity-0 transition-opacity duration-300">
          <h3 className="text-lg font-semibold text-primary-foreground mb-1">{title}</h3>
          <p className="text-sm text-primary-foreground/80">{itemCount}</p>
        </div>
      </div>
    </Card>
  );
};

export default CategoryCard;