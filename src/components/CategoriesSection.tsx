import CategoryCard from "./CategoryCard";
import apparelImg from "@/assets/apparel.jpg";
import shoesImg from "@/assets/shoes.jpg";
import makeupImg from "@/assets/makeup.jpg";
import watchesImg from "@/assets/watches.jpg";
import electronicsImg from "@/assets/electronics.jpg";
import homeGardenImg from "@/assets/home-garden.jpg";
import sportsImg from "@/assets/sports.jpg";
import booksImg from "@/assets/books.jpg";

const categories = [
  {
    title: "Electronics",
    image: electronicsImg,
    itemCount: "5,000+ items",
    featured: true
  },
  {
    title: "Apparel",
    image: apparelImg,
    itemCount: "8,500+ items"
  },
  {
    title: "Shoes",
    image: shoesImg,
    itemCount: "3,200+ items"
  },
  {
    title: "Makeup & Beauty",
    image: makeupImg,
    itemCount: "2,800+ items"
  },
  {
    title: "Watches",
    image: watchesImg,
    itemCount: "1,500+ items"
  },
  {
    title: "Home & Garden",
    image: homeGardenImg,
    itemCount: "4,200+ items"
  },
  {
    title: "Sports & Fitness",
    image: sportsImg,
    itemCount: "3,600+ items"
  },
  {
    title: "Books & Media",
    image: booksImg,
    itemCount: "2,100+ items"
  }
];

const CategoriesSection = () => {
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <CategoryCard
              key={category.title}
              title={category.title}
              image={category.image}
              itemCount={category.itemCount}
              featured={category.featured}
            />
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
      </div>
    </section>
  );
};

export default CategoriesSection;