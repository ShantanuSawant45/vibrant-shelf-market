import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Camera, CameraOff, Search, Heart, Filter } from 'lucide-react';
import { useFaceDetection } from '@/hooks/useFaceDetection';
import { useFaceRecommendations } from '@/hooks/useFaceRecommendations';
import ProductCard from './ProductCard';

const FaceRecommendationSystem = () => {
  // All useState hooks first
  const [searchQuery, setSearchQuery] = useState('');
  const [searchPrice, setSearchPrice] = useState<number>(1000);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showCamera, setShowCamera] = useState(false);
  
  // All custom hooks next
  const {
    videoRef,
    faceResult,
    isModelLoaded,
    isDetecting,
    error,
    startCamera,
    stopCamera,
    detectExpressions
  } = useFaceDetection();

  const {
    recommendations,
    priceRange,
    emotionBasedMessage,
    loading,
    analyzeFaceAndRecommend,
    searchByCategory
  } = useFaceRecommendations();

  const handleStartCamera = async () => {
    setShowCamera(true);
    await startCamera();
  };

  const handleStopCamera = () => {
    setShowCamera(false);
    stopCamera();
  };

  const handleAnalyzeAndRecommend = async () => {
    if (faceResult) {
      const actualCategory = selectedCategory === 'all' ? '' : selectedCategory;
      await analyzeFaceAndRecommend(faceResult, searchPrice, actualCategory);
    }
  };

  const handleCategorySearch = async (category: string) => {
    const actualCategory = category === 'all' ? '' : category;
    setSelectedCategory(actualCategory);
    await searchByCategory(actualCategory);
  };

  const getEmotionColor = (emotion: string) => {
    switch (emotion) {
      case 'happy': return 'bg-green-500';
      case 'sad': return 'bg-blue-500';
      case 'angry': return 'bg-red-500';
      case 'surprised': return 'bg-yellow-500';
      case 'fearful': return 'bg-purple-500';
      case 'disgusted': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="w-6 h-6 text-red-500" />
            AI-Powered Face Expression Shopping Assistant
          </CardTitle>
          <p className="text-muted-foreground">
            Let our AI analyze your facial expressions to find products that match your budget and mood!
          </p>
        </CardHeader>
      </Card>

      {/* Search and Filter Section */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-2">Search Product</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="e.g., t-shirt, shoes, electronics"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Expected Price (₹)</label>
              <Input
                type="number"
                placeholder="1000"
                value={searchPrice}
                onChange={(e) => setSearchPrice(Number(e.target.value))}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Category</label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Apparel">Apparel</SelectItem>
                  <SelectItem value="Accessories">Accessories</SelectItem>
                  <SelectItem value="Footwear">Footwear</SelectItem>
                  <SelectItem value="Personal Care">Personal Care</SelectItem>
                  <SelectItem value="Sporting Goods">Sporting Goods</SelectItem>
                  <SelectItem value="Home">Home</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            <Button
              variant="outline"
              onClick={() => handleCategorySearch('Apparel')}
              className="text-sm"
            >
              <Filter className="w-4 h-4 mr-2" />
              Apparel
            </Button>
            <Button
              variant="outline"
              onClick={() => handleCategorySearch('Accessories')}
              className="text-sm"
            >
              <Filter className="w-4 h-4 mr-2" />
              Accessories
            </Button>
            <Button
              variant="outline"
              onClick={() => handleCategorySearch('Footwear')}
              className="text-sm"
            >
              <Filter className="w-4 h-4 mr-2" />
              Footwear
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Face Detection Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="w-5 h-5" />
            Face Expression Analysis
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            {!isModelLoaded ? 'Loading AI models...' : 'Start camera for real-time expression analysis'}
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-4">
              <Button
                onClick={handleStartCamera}
                disabled={!isModelLoaded || isDetecting}
                className="flex items-center gap-2"
              >
                <Camera className="w-4 h-4" />
                {isDetecting ? 'Camera Active' : 'Start Camera'}
              </Button>
              
              <Button
                onClick={handleStopCamera}
                disabled={!isDetecting}
                variant="outline"
                className="flex items-center gap-2"
              >
                <CameraOff className="w-4 h-4" />
                Stop Camera
              </Button>
              
              <Button
                onClick={handleAnalyzeAndRecommend}
                disabled={!faceResult || !searchPrice}
                className="flex items-center gap-2"
              >
                <Heart className="w-4 h-4" />
                Get Recommendations
              </Button>
            </div>

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700">{error}</p>
              </div>
            )}

            {showCamera && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <video
                    ref={videoRef}
                    autoPlay
                    muted
                    playsInline
                    className="w-full h-64 object-cover rounded-lg border"
                  />
                  {isDetecting && (
                    <div className="absolute top-2 right-2 flex items-center gap-2 bg-green-500 text-white px-2 py-1 rounded text-xs">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                      Live Detection
                    </div>
                  )}
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">Real-time Analysis</h3>
                    {isDetecting && (
                      <Badge variant="outline" className="animate-pulse">
                        Analyzing...
                      </Badge>
                    )}
                  </div>
                  {faceResult ? (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Badge className={`${getEmotionColor(faceResult.dominantEmotion)} text-white`}>
                          {faceResult.dominantEmotion}
                        </Badge>
                        <div className="flex items-center gap-1">
                          <span className="text-sm text-muted-foreground">
                            {(faceResult.confidenceScore * 100).toFixed(1)}%
                          </span>
                          <div className="w-8 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className={`h-full ${
                                faceResult.confidenceScore > 0.7 ? 'bg-green-500' : 
                                faceResult.confidenceScore > 0.5 ? 'bg-yellow-500' : 'bg-red-500'
                              } transition-all duration-300`}
                              style={{ width: `${faceResult.confidenceScore * 100}%` }}
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        <h4 className="text-sm font-medium">Expression Breakdown:</h4>
                        <div className="space-y-1">
                          {Object.entries(faceResult.expressions)
                            .sort(([,a], [,b]) => b - a)
                            .map(([emotion, value]) => (
                              <div key={emotion} className="flex justify-between items-center text-sm">
                                <span className="capitalize">{emotion}</span>
                                <div className="flex items-center gap-2">
                                  <div className="w-12 h-2 bg-gray-200 rounded-full overflow-hidden">
                                    <div 
                                      className={`h-full ${getEmotionColor(emotion)} transition-all duration-300`}
                                      style={{ width: `${value * 100}%` }}
                                    />
                                  </div>
                                  <span className="text-xs w-10 text-right">{(value * 100).toFixed(1)}%</span>
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-muted-foreground">
                      {isDetecting ? 'Looking for face...' : 'No face detected. Please face the camera.'}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Recommendations Section */}
      {(recommendations.length > 0 || emotionBasedMessage) && (
        <Card>
          <CardHeader>
            <CardTitle>Smart Recommendations</CardTitle>
            {emotionBasedMessage && (
              <p className="text-muted-foreground">{emotionBasedMessage}</p>
            )}
            {priceRange && (
              <div className="flex items-center gap-2 text-sm">
                <Badge variant="outline">
                  Price Range: ₹{priceRange.min} - ₹{priceRange.max}
                </Badge>
              </div>
            )}
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-gray-200 h-48 rounded-lg mb-2"></div>
                    <div className="bg-gray-200 h-4 rounded mb-2"></div>
                    <div className="bg-gray-200 h-4 rounded w-2/3"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {recommendations.map((product) => (
                  <ProductCard
                    key={product.id}
                    productDisplayName={product.productDisplayName}
                    price={product.price}
                    filename={product.filename}
                    baseColour={product.baseColour}
                    articleType={product.articleType}
                    link={product.link}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default FaceRecommendationSystem;
