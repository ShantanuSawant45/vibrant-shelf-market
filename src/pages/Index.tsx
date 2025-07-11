import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import CategoriesSection from "@/components/CategoriesSection";
import FeaturesSection from "@/components/FeaturesSection";
import Footer from "@/components/Footer";
import FaceRecommendationSystem from "@/components/FaceRecommendationSystem";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <FaceRecommendationSystem />
      <CategoriesSection />
      <FeaturesSection />
      <Footer />
    </div>
  );
};

export default Index;
