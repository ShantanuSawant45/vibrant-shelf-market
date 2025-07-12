import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ShoppingCart, Heart } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Product {
  id: string;
  productDisplayName: string;
  price: string;
  filename: string;
  baseColour?: string;
  articleType?: string;
  masterCategory: string;
  subCategory?: string;
  gender?: string;
  season?: string;
  usage?: string;
  link?: string;
}

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (id) {
      fetchProduct(id);
    }
  }, [id]);

  const fetchProduct = async (productId: string) => {
    try {
      const { data, error } = await supabase
        .from('walamart_data')
        .select('*')
        .eq('id', productId)
        .single();

      if (error) {
        console.error('Error fetching product:', error);
        toast({
          title: "Error",
          description: "Product not found",
          variant: "destructive",
        });
        navigate('/');
        return;
      }

      setProduct(data as Product);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to load product",
        variant: "destructive",
      });
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handleBuyNow = () => {
    toast({
      title: "Buy Now",
      description: `Proceeding to checkout with ${quantity} item(s)`,
    });
    // Implement buy now logic here
  };

  const handleAddToCart = () => {
    toast({
      title: "Added to Cart",
      description: `${quantity} ${product?.productDisplayName} added to cart`,
    });
    // Implement add to cart logic here
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading product...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Product not found</p>
      </div>
    );
  }

  const imageUrl = product.link || `https://images.unsplash.com/photo-${product.filename}?w=600&h=600&fit=crop&crop=center`;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Back button */}
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="mb-6 flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Products
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="space-y-4">
            <Card className="overflow-hidden">
              <img
                src={imageUrl}
                alt={product.productDisplayName}
                className="w-full h-96 lg:h-[500px] object-cover"
                onError={(e) => {
                  e.currentTarget.src = `https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=600&fit=crop&crop=center`;
                }}
              />
            </Card>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                {product.productDisplayName}
              </h1>
              <p className="text-2xl font-bold text-primary mb-4">
                ₹{product.price}
              </p>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {product.baseColour && (
                  <Badge variant="secondary">{product.baseColour}</Badge>
                )}
                {product.articleType && (
                  <Badge variant="outline">{product.articleType}</Badge>
                )}
                {product.masterCategory && (
                  <Badge variant="default">{product.masterCategory}</Badge>
                )}
              </div>
            </div>

            {/* Product Information */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Product Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                {product.gender && (
                  <div>
                    <span className="font-medium text-foreground">Gender:</span>
                    <span className="text-muted-foreground ml-2">{product.gender}</span>
                  </div>
                )}
                {product.subCategory && (
                  <div>
                    <span className="font-medium text-foreground">Category:</span>
                    <span className="text-muted-foreground ml-2">{product.subCategory}</span>
                  </div>
                )}
                {product.season && (
                  <div>
                    <span className="font-medium text-foreground">Season:</span>
                    <span className="text-muted-foreground ml-2">{product.season}</span>
                  </div>
                )}
                {product.usage && (
                  <div>
                    <span className="font-medium text-foreground">Usage:</span>
                    <span className="text-muted-foreground ml-2">{product.usage}</span>
                  </div>
                )}
              </div>
            </Card>

            {/* Quantity and Actions */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <label htmlFor="quantity" className="font-medium text-foreground">
                  Quantity:
                </label>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    -
                  </Button>
                  <span className="px-4 py-2 text-center min-w-[50px] bg-muted rounded">
                    {quantity}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    +
                  </Button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  onClick={handleBuyNow}
                  className="flex-1"
                  size="lg"
                >
                  Buy Now
                </Button>
                <Button 
                  onClick={handleAddToCart}
                  variant="outline"
                  className="flex-1"
                  size="lg"
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add to Cart
                </Button>
              </div>

              <Button variant="ghost" className="w-full">
                <Heart className="h-4 w-4 mr-2" />
                Add to Wishlist
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;