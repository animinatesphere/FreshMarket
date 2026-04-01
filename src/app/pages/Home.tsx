import { useState, useEffect } from "react";
import { Link } from "react-router";
import { Star, Heart, ShoppingCart, ArrowRight } from "lucide-react";
import { products } from "../data/products";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { formatCurrency } from "../utils/currency";
import { ImageLoader } from "../components/ImageLoader";

const getBannerProducts = (products: any[]) => {
  // Create banners from first 3 products
  return products.slice(0, 3).map((product) => ({
    product,
    title: `Fresh ${product.name}`,
    description: product.description,
    image: product.image,
  }));
};

export function Home() {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);

  // Get banners from actual products
  const banners = getBannerProducts(products);

  // Auto-rotate banner every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBannerIndex((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [banners.length]);

  // Get all products
  const allProducts = products;
  const currentBanner = banners[currentBannerIndex];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Dynamic Hero Banner with Product Image */}
      <div className="relative h-96 sm:h-[500px] overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 transition-all duration-500"
          style={{
            backgroundImage: `url(${currentBanner.image})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40" />

        {/* Content */}
        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
          <div className="text-white space-y-6 flex-1">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold">
              {currentBanner.title}
            </h1>
            <p className="text-lg sm:text-xl text-white/90 max-w-2xl">
              {currentBanner.description}
            </p>
            <div className="flex justify-start gap-4 pt-4">
              <Link to="/products">
                <Button
                  size="lg"
                  className="bg-orange-600 hover:bg-orange-700 text-white font-semibold"
                >
                  Explore Market
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button
                size="lg"
                onClick={() => addToCart(currentBanner.product)}
                className="bg-white text-orange-600 hover:bg-gray-100 font-semibold"
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                Add to Cart
              </Button>
            </div>
          </div>
        </div>

        {/* Banner indicators */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex justify-center gap-2">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentBannerIndex(index)}
              className={`h-2 rounded-full transition-all ${
                index === currentBannerIndex
                  ? "bg-white w-8"
                  : "bg-white/50 w-2 hover:bg-white/70"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Stats Section - REMOVED */}

      {/* Featured Products Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Featured Products
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Handpicked selection of our freshest and most popular products
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {allProducts.map((product) => (
              <Card
                key={product.id}
                className="overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="relative h-48 bg-gray-200">
                  <ImageLoader
                    src={product.image}
                    alt={product.name}
                    imageClassName="hover:scale-105 transition-transform"
                    containerClassName="block w-full h-full"
                  />
                  {!product.inStock && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                      <span className="text-white font-bold">Out of Stock</span>
                    </div>
                  )}
                  {product.label && (
                    <div className="absolute top-3 left-3 bg-orange-600 text-white px-3 py-1 rounded-full text-xs font-semibold uppercase shadow-md">
                      {product.label}
                    </div>
                  )}
                  <button
                    onClick={() =>
                      isInWishlist(product.id)
                        ? removeFromWishlist(product.id)
                        : addToWishlist(product)
                    }
                    className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-md hover:scale-110 transition-transform"
                  >
                    <Heart
                      className={`h-5 w-5 ${
                        isInWishlist(product.id)
                          ? "fill-red-500 text-red-500"
                          : "text-gray-600"
                      }`}
                    />
                  </button>
                </div>
                <CardContent className="p-4">
                  <div className="flex items-center gap-1 mb-2">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm text-gray-600">
                      {product.rating}
                    </span>
                  </div>
                  <Link to={`/products/${product.id}`}>
                    <h3 className="font-medium text-gray-900 hover:text-orange-600 transition-colors line-clamp-2 mb-2">
                      {product.name}
                    </h3>
                  </Link>
                  <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                    {product.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xl font-bold text-orange-600">
                        {formatCurrency(product.price)}
                      </p>
                      <p className="text-xs text-gray-500">{product.unit}</p>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => addToCart(product)}
                      disabled={!product.inStock}
                      className="bg-orange-600 hover:bg-orange-700"
                    >
                      <ShoppingCart className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/products">
              <Button
                size="lg"
                className="bg-orange-600 hover:bg-orange-700 text-white"
              >
                View All Products
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section - REMOVED */}
      {/* How It Works Section - REMOVED */}
      {/* CTA Section - REMOVED */}
    </div>
  );
}
