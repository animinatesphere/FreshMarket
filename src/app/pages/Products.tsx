import { useState, useMemo, useEffect } from "react";
import { Link, useSearchParams } from "react-router";
import {
  Star,
  Heart,
  ShoppingCart as CartIcon,
  Zap,
  Truck,
  Eye,
  Loader2,
} from "lucide-react";
import { supabase } from "../utils/supabase";
import { categories, Product } from "../data/products";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { formatCurrency } from "../utils/currency";
import { StockBadge } from "../components/StockBadge";
import { SkeletonProductCard } from "../components/SkeletonCard";
import { ImageLoader } from "../components/ImageLoader";

export function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [isLoading, setIsLoading] = useState(true);
  const [dbProducts, setDbProducts] = useState<Product[]>([]);

  const categoryFromUrl = searchParams.get("category") || "All";
  const [selectedCategory, setSelectedCategory] = useState(categoryFromUrl);
  const [sortBy, setSortBy] = useState("featured");

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
        console.error("Fetch failed:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filteredAndSortedProducts = useMemo(() => {
    let filtered =
      selectedCategory === "All"
        ? dbProducts
        : dbProducts.filter((p) => p.category === selectedCategory);

    switch (sortBy) {
      case "price-low":
        return [...filtered].sort((a, b) => a.price - b.price);
      case "price-high":
        return [...filtered].sort((a, b) => b.price - a.price);
      case "name":
        return [...filtered].sort((a, b) => a.name.localeCompare(b.name));
      case "rating":
        return [...filtered].sort((a, b) => (b.rating || 0) - (a.rating || 0));
      default:
        return filtered;
    }
  }, [selectedCategory, sortBy, dbProducts]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    if (category === "All") {
      setSearchParams({});
    } else {
      setSearchParams({ category });
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-orange-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl mb-4">Our Products</h1>
          <p className="text-orange-100 max-w-2xl">
            Browse our complete selection of fresh, organic, and sustainably
            sourced food products.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="lg:w-64 flex-shrink-0">
            <Card>
              <CardContent className="p-6">
                <div className="mb-6">
                  <h3 className="mb-4">Categories</h3>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <button
                        key={category}
                        onClick={() => handleCategoryChange(category)}
                        className={`w-full text-left px-4 py-2 rounded transition-colors ${
                          selectedCategory === category
                            ? "bg-orange-600 text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="mb-4">Sort By</h3>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-4 py-2 border rounded-md"
                  >
                    <option value="featured">Featured</option>
                    <option value="name">Name (A-Z)</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Highest Rated</option>
                  </select>
                </div>
              </CardContent>
            </Card>
          </aside>

          {/* Grid */}
          <div className="flex-1">
            <div className="mb-6 flex items-center justify-between">
              <p className="text-gray-600">
                {!isLoading && (
                  <>
                    Showing {filteredAndSortedProducts.length} product
                    {filteredAndSortedProducts.length !== 1 ? "s" : ""}
                  </>
                )}
              </p>
            </div>

            {isLoading ? (
              <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
                {Array.from({ length: 8 }).map((_, idx) => (
                  <SkeletonProductCard key={idx} />
                ))}
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
                {filteredAndSortedProducts.map((product) => (
                  <Card
                    key={product.id}
                    className="overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col group"
                  >
                    <div className="relative h-48 bg-gray-100 overflow-hidden">
                      <button
                        onClick={() =>
                          isInWishlist(product.id)
                            ? removeFromWishlist(product.id)
                            : addToWishlist(product)
                        }
                        className="absolute top-2 right-2 z-20 bg-white p-2 rounded-full shadow-md hover:scale-110 transition-transform"
                      >
                        <Heart
                          className={`h-5 w-5 ${
                            isInWishlist(product.id)
                              ? "fill-red-500 text-red-500"
                              : "text-gray-600"
                          }`}
                        />
                      </button>

                      <Link to={`/products/${product.id}`}>
                        <ImageLoader
                          src={product.image}
                          alt={product.name}
                          imageClassName="group-hover:scale-110 transition-transform duration-300"
                        />
                        {!product.inStock && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <span className="bg-white px-4 py-2 rounded text-sm font-bold">
                              Out of Stock
                            </span>
                          </div>
                        )}
                      </Link>
                    </div>

                    <CardContent className="p-4 flex-1 flex flex-col">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded font-medium">
                          {product.category}
                        </span>
                        {product.rating > 0 && (
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span className="text-xs font-bold">{product.rating}</span>
                          </div>
                        )}
                      </div>

                      <Link to={`/products/${product.id}`}>
                        <h3 className="text-sm font-semibold mb-2 hover:text-orange-600 truncate">
                          {product.name}
                        </h3>
                      </Link>

                      <div className="mb-4">
                        <p className="text-lg font-bold text-orange-600">
                          {formatCurrency(product.price)}
                        </p>
                        <p className="text-xs text-gray-500">{product.unit}</p>
                      </div>

                      <div className="mt-auto">
                        <Button
                          onClick={() => addToCart(product)}
                          disabled={!product.inStock}
                          className="w-full bg-orange-600 hover:bg-orange-700 gap-2"
                        >
                          <CartIcon className="h-4 w-4" />
                          {product.inStock ? "Add to Cart" : "Out of Stock"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {!isLoading && filteredAndSortedProducts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">
                  No products found here yet.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
