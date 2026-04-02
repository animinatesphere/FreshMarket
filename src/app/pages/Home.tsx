import { useState, useEffect } from "react";
import { Link } from "react-router";
import { Star, Heart, ShoppingCart, ArrowRight, Loader2, Package } from "lucide-react";
import { supabase } from "../utils/supabase";
import { Product } from "../data/products";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { formatCurrency } from "../utils/currency";
import { ImageLoader } from "../components/ImageLoader";

const getBannerProducts = (products: Product[]) => {
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
  const [isLoading, setIsLoading] = useState(true);
  const [dbProducts, setDbProducts] = useState<Product[]>([]);

  // Fetch from Supabase
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;

        const mapped: Product[] = (data || []).map((p: any) => ({
          id: p.id.toString(),
          name: p.name,
          description: p.description,
          price: p.price,
          category: p.category,
          image: p.image,
          unit: p.unit,
          inStock: p.in_stock,
          stockQuantity: p.stock_quantity,
          featured: p.featured,
          rating: p.rating,
        }));
        setDbProducts(mapped);
      } catch (err) {
        console.error("Home fetch failed:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const banners = getBannerProducts(dbProducts);
  const featuredProducts = dbProducts.filter(p => p.featured).slice(0, 4);
  // If no featured products, just take first 4
  const displayProducts = featuredProducts.length > 0 ? featuredProducts : dbProducts.slice(0, 4);

  // Auto-rotate banner
  useEffect(() => {
    if (banners.length === 0) return;
    const timer = setInterval(() => {
      setCurrentBannerIndex((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [banners.length]);

  const currentBanner = banners[currentBannerIndex];

  if (isLoading) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <Loader2 className="h-12 w-12 text-orange-600 animate-spin" />
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Banner */}
      {currentBanner ? (
        <div className="relative h-96 sm:h-[500px] overflow-hidden">
          <div
            className="absolute inset-0 transition-all duration-700 ease-in-out"
            style={{
              backgroundImage: `url(${currentBanner.image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          <div className="absolute inset-0 bg-black/40" />
          <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
            <div className="text-white space-y-6 flex-1">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold animate-in fade-in slide-in-from-left-8 duration-700">
                {currentBanner.title}
              </h1>
              <p className="text-lg sm:text-xl text-white/90 max-w-2xl animate-in fade-in slide-in-from-left-8 duration-700 delay-100">
                {currentBanner.description.trim().slice(0, 150)}
              </p>
              <div className="flex justify-start gap-4 pt-4 animate-in fade-in slide-in-from-left-8 duration-700 delay-200">
                <Link to="/products">
                  <Button size="lg" className="bg-orange-600 hover:bg-orange-700 text-white font-semibold shadow-lg">
                    Explore Market
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Button
                  size="lg"
                  onClick={() => addToCart(currentBanner.product)}
                  className="bg-white text-orange-600 hover:bg-gray-100 font-semibold shadow-lg"
                >
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Add to Cart
                </Button>
              </div>
            </div>
          </div>
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex justify-center gap-2">
            {banners.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentBannerIndex(index)}
                className={`h-2 rounded-full transition-all ${
                  index === currentBannerIndex ? "bg-white w-8" : "bg-white/50 w-2"
                }`}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-orange-600 h-96 flex items-center justify-center text-white p-8">
            <div className="text-center">
                <h1 className="text-4xl font-bold mb-4">Welcome to FreshMarket</h1>
                <p className="mb-6">Please add some products in the Admin Dashboard to see them here!</p>
                <Link to="/products">
                    <Button className="bg-white text-orange-600">Browse Shop</Button>
                </Link>
            </div>
        </div>
      )}

      {/* Featured Products */}
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

          {displayProducts.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {displayProducts.map((product) => (
                <Card key={product.id} className="overflow-hidden hover:shadow-xl transition-all group">
                  <div className="relative h-48 bg-gray-200">
                    <ImageLoader
                      src={product.image}
                      alt={product.name}
                      imageClassName="group-hover:scale-105 transition-transform duration-300"
                    />
                    {!product.inStock && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span className="text-white font-bold">Out of Stock</span>
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
                          isInWishlist(product.id) ? "fill-red-500 text-red-500" : "text-gray-600"
                        }`}
                      />
                    </button>
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-1 mb-2">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm text-gray-600">{product.rating}</span>
                    </div>
                    <Link to={`/products/${product.id}`}>
                      <h3 className="font-semibold text-gray-900 hover:text-orange-600 transition-colors truncate">
                        {product.name}
                      </h3>
                    </Link>
                    <p className="text-sm text-gray-600 line-clamp-2 mb-3 h-10">
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
          ) : (
            <div className="text-center py-12 bg-white rounded-xl shadow-sm">
                <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No featured products available yet.</p>
            </div>
          )}

          <div className="text-center mt-12">
            <Link to="/products">
              <Button size="lg" className="bg-orange-600 hover:bg-orange-700 text-white font-bold shadow-lg">
                View All Products
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
