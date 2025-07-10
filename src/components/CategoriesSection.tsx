import { useState, useEffect } from "react";
import CategoryCard from "./CategoryCard";
import ProductCard from "./ProductCard";
import { supabase } from "@/integrations/supabase/client";
import apparelImg from "@/assets/apparel.jpg";
import shoesImg from "@/assets/shoes.jpg";
import makeupImg from "@/assets/makeup.jpg";
import watchesImg from "@/assets/watches.jpg";
import electronicsImg from "@/assets/electronics.jpg";
import homeGardenImg from "@/assets/home-garden.jpg";
import sportsImg from "@/assets/sports.jpg";
import booksImg from "@/assets/books.jpg";

interface Product {
  id: string;
  productDisplayName: string;
  price: string;
  filename: string;
  baseColour?: string;
  articleType?: string;
  masterCategory: string;
}

interface CategoryData {
  title: string;
  image: string;
  itemCount: string;
  featured?: boolean;
  dbCategory: string;
  products: Product[];
}

const categoryMapping: CategoryData[] = [
  {
    title: "Apparel",
    image: apparelImg,
    itemCount: "0 items",
    featured: true,
    dbCategory: "Apparel",
    products: []
  },
  {
    title: "Accessories",
    image: watchesImg,
    itemCount: "0 items",
    dbCategory: "Accessories",
    products: []
  },
  {
    title: "Footwear",
    image: shoesImg,
    itemCount: "0 items",
    dbCategory: "Footwear",
    products: []
  },
  {
    title: "Personal Care",
    image: makeupImg,
    itemCount: "0 items",
    dbCategory: "Personal Care",
    products: []
  },
  {
    title: "Sporting Goods",
    image: sportsImg,
    itemCount: "0 items",
    dbCategory: "Sporting Goods",
    products: []
  },
  {
    title: "Home",
    image: homeGardenImg,
    itemCount: "0 items",
    dbCategory: "Home",
    products: []
  }
];

const CategoriesSection = () => {
  const [categories, setCategories] = useState<CategoryData[]>(categoryMapping);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategoryData();
  }, []);

  const fetchCategoryData = async () => {
    try {
      const { data, error } = await supabase
        .from('walamart_data')
        .select('id, "productDisplayName", price, filename, "baseColour", "articleType", "masterCategory"');

      if (error) {
        console.error('Error fetching data:', error);
        return;
      }

      // Group products by category
      const productsByCategory = data.reduce((acc: Record<string, Product[]>, product) => {
        const category = product.masterCategory;
        if (!acc[category]) {
          acc[category] = [];
        }
        acc[category].push(product as Product);
        return acc;
      }, {});

      // Update categories with real data
      const updatedCategories = categoryMapping.map(category => {
        const products = productsByCategory[category.dbCategory] || [];
        return {
          ...category,
          itemCount: `${products.length} items`,
          products: products.slice(0, 8) // Limit to 8 products per category for display
        };
      }).filter(category => category.products.length > 0); // Only show categories with products

      setCategories(updatedCategories);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-muted-foreground">Loading categories...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Shop by Category
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover thousands of products across all your favorite categories. 
            Quality items at unbeatable prices.
          </p>
        </div>

        {!selectedCategory ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((category) => (
                <div
                  key={category.title}
                  onClick={() => setSelectedCategory(category.dbCategory)}
                  className="cursor-pointer"
                >
                  <CategoryCard
                    title={category.title}
                    image={category.image}
                    itemCount={category.itemCount}
                    featured={category.featured}
                  />
                </div>
              ))}
            </div>

            {/* Call to Action */}
            <div className="text-center mt-12">
              <div className="inline-flex items-center gap-2 text-muted-foreground">
                <span>Can't find what you're looking for?</span>
                <button className="text-primary hover:text-primary/80 font-medium underline">
                  Browse All Categories
                </button>
              </div>
            </div>
          </>
        ) : (
          <div>
            {/* Back button */}
            <button
              onClick={() => setSelectedCategory(null)}
              className="mb-6 text-primary hover:text-primary/80 font-medium flex items-center gap-2"
            >
              ← Back to Categories
            </button>

            {/* Selected category products */}
            {(() => {
              const category = categories.find(c => c.dbCategory === selectedCategory);
              if (!category) return null;

              return (
                <div>
                  <h3 className="text-2xl font-bold text-foreground mb-6">
                    {category.title} ({category.itemCount})
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {category.products.map((product) => (
                      <ProductCard
                        key={product.id}
                        productDisplayName={product.productDisplayName}
                        price={product.price}
                        filename={product.filename}
                        baseColour={product.baseColour}
                        articleType={product.articleType}
                      />
                    ))}
                  </div>
                </div>
              );
            })()}
          </div>
        )}
      </div>
    </section>
  );
};

export default CategoriesSection;