import { Card } from "@/components/ui/card";

interface ProductCardProps {
  productDisplayName: string;
  price: string;
  filename: string;
  baseColour?: string;
  articleType?: string;
  link?: string;
}

const ProductCard = ({ 
  productDisplayName, 
  price, 
  filename, 
  baseColour, 
  articleType,
  link 
}: ProductCardProps) => {
  // Use the actual link from database or fallback to constructed URL
  const imageUrl = link || `https://images.unsplash.com/photo-${filename}?w=300&h=300&fit=crop&crop=center`;
  
  return (
    <Card className="group cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1 bg-gradient-card border-muted/30">
      <div className="relative">
        <div className="overflow-hidden h-48">
          <img
            src={imageUrl}
            alt={productDisplayName}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            onError={(e) => {
              // Fallback to a placeholder image if the constructed URL fails
              e.currentTarget.src = `https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=300&h=300&fit=crop&crop=center`;
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
        
        <div className="p-4">
          <h3 className="text-sm font-semibold text-foreground mb-2 line-clamp-2">
            {productDisplayName}
          </h3>
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-primary">
              ₹{price}
            </span>
            {baseColour && (
              <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                {baseColour}
              </span>
            )}
          </div>
          {articleType && (
            <p className="text-xs text-muted-foreground mt-1">{articleType}</p>
          )}
        </div>
      </div>
    </Card>
  );
};

export default ProductCard;