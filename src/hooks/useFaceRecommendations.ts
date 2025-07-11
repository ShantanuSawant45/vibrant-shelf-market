import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface FaceDetectionResult {
  expressions: { [key: string]: number };
  dominantEmotion: string;
  confidenceScore: number;
}

export interface Product {
  id: string;
  productDisplayName: string;
  price: string;
  masterCategory: string;
  filename: string;
  baseColour?: string;
  articleType?: string;
  link?: string;
}

export interface RecommendationFilters {
  maxPrice?: number;
  minPrice?: number;
  category?: string;
  sortBy?: 'price-asc' | 'price-desc' | 'rating' | 'discount';
}

export const useFaceRecommendations = () => {
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [priceRange, setPriceRange] = useState<{ min: number; max: number } | null>(null);
  const [emotionBasedMessage, setEmotionBasedMessage] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const fetchProductsFromSupabase = async (filters: RecommendationFilters = {}) => {
    setLoading(true);
    try {
      let query = supabase
        .from('walamart_data')
        .select('id, "productDisplayName", price, filename, "baseColour", "articleType", "masterCategory", link');

      // Apply category filter
      if (filters.category) {
        query = query.eq('masterCategory', filters.category);
      }

      // Apply price range filter
      if (filters.maxPrice || filters.minPrice) {
        if (filters.minPrice) {
          query = query.gte('price', filters.minPrice.toString());
        }
        if (filters.maxPrice) {
          query = query.lte('price', filters.maxPrice.toString());
        }
      }

      const { data, error } = await query.limit(50);

      if (error) {
        console.error('Error fetching products:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error:', error);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const getEmotionBasedPriceRange = (faceResult: FaceDetectionResult, searchedPrice: number) => {
    const { dominantEmotion } = faceResult;
    let priceMultiplier = 1;
    let message = '';

    switch (dominantEmotion) {
      case 'sad':
      case 'angry':
      case 'fearful':
        // User seems price-sensitive or unhappy, suggest cheaper alternatives
        priceMultiplier = 0.6; // Show products 40% cheaper
        message = `I noticed you might be looking for more budget-friendly options. Here are some great alternatives under ₹${Math.floor(searchedPrice * priceMultiplier)}:`;
        break;
      
      case 'surprised':
      case 'disgusted':
        // User might be shocked by price, suggest mid-range alternatives
        priceMultiplier = 0.8; // Show products 20% cheaper
        message = `Let me show you some better value options under ₹${Math.floor(searchedPrice * priceMultiplier)}:`;
        break;
      
      case 'happy':
        // User is happy, might be willing to spend more or similar amount
        priceMultiplier = 1.2; // Show products up to 20% more expensive
        message = `Great choice! Here are some premium options you might love:`;
        break;
      
      case 'neutral':
      default:
        // Neutral expression, show similar price range
        priceMultiplier = 1;
        message = `Here are some similar products in your price range:`;
        break;
    }

    const maxPrice = Math.floor(searchedPrice * priceMultiplier);
    const minPrice = Math.floor(maxPrice * 0.3); // Minimum 30% of max price

    return {
      priceRange: { min: minPrice, max: maxPrice },
      message
    };
  };

  const getRecommendations = async (
    faceResult: FaceDetectionResult | null,
    filters: RecommendationFilters = {}
  ) => {
    let products = await fetchProductsFromSupabase(filters);

    // Apply face-based price filtering if face result is available
    if (faceResult && priceRange) {
      products = products.filter(product => {
        const productPrice = parseFloat(product.price);
        return productPrice >= priceRange.min && productPrice <= priceRange.max;
      });
    }

    // Sort products
    switch (filters.sortBy) {
      case 'price-asc':
        products.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
        break;
      case 'price-desc':
        products.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
        break;
      default:
        // Default: sort by price ascending for budget-conscious emotions
        if (faceResult && ['sad', 'angry', 'fearful'].includes(faceResult.dominantEmotion)) {
          products.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
        } else {
          // Sort by price ascending by default
          products.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
        }
    }

    setRecommendations(products.slice(0, 12)); // Return top 12 recommendations
  };

  const analyzeFaceAndRecommend = async (
    faceResult: FaceDetectionResult,
    searchedPrice: number,
    category?: string
  ) => {
    const { priceRange: newPriceRange, message } = getEmotionBasedPriceRange(faceResult, searchedPrice);
    
    setPriceRange(newPriceRange);
    setEmotionBasedMessage(message);
    
    await getRecommendations(faceResult, {
      maxPrice: newPriceRange.max,
      minPrice: newPriceRange.min,
      category,
      sortBy: 'price-asc'
    });
  };

  const searchByCategory = async (category: string) => {
    await getRecommendations(null, { category });
  };

  return {
    recommendations,
    priceRange,
    emotionBasedMessage,
    loading,
    getRecommendations,
    analyzeFaceAndRecommend,
    searchByCategory
  };
};
