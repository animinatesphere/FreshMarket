import { useState, useMemo, useEffect } from "react";
import { Link, useSearchParams } from "react-router";
import {
  Star,
  Heart,
  ShoppingCart as CartIcon,
  Zap,
  Truck,
  Eye,
} from "lucide-react";
import { products, categories } from "../data/products";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { formatCurrency } from "../utils/currency";
import { StockBadge } from "../components/StockBadge";
import { SkeletonProductCard } from "../components/SkeletonCard";

export function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [isLoading, setIsLoading] = useState(true);

  const categoryFromUrl = searchParams.get("category") || "All";
  const [selectedCategory, setSelectedCategory] = useState(categoryFromUrl);
  const [sortBy, setSortBy] = useState("featured");

  // Simulate loading on mount
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  const filteredAndSortedProducts = useMemo(() => {
    let filtered =
      selectedCategory === "All"
        ? products
        : products.filter((p) => p.category === selectedCategory);

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
  }, [selectedCategory, sortBy]);

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
          {/* Sidebar Filters */}
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

          {/* Products Grid */}
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
                {Array.from({ length: 6 }).map((_, idx) => (
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
                    <div className="relative overflow-hidden bg-gray-100">
                      {/* Discount Badge */}
                      <div className="absolute top-2 left-2 z-10 bg-red-600 text-white px-2 py-1 rounded text-xs font-bold flex items-center gap-1">
                        <Zap className="h-3 w-3" />
                        -15%
                      </div>

                      {/* Wishlist Button */}
                      <button
                        onClick={() =>
                          isInWishlist(product.id)
                            ? removeFromWishlist(product.id)
                            : addToWishlist(product)
                        }
                        className="absolute top-2 right-2 bg-white p-2 rounded-full shadow-md hover:scale-110 transition-transform z-10"
                      >
                        <Heart
                          className={`h-5 w-5 ${
                            isInWishlist(product.id)
                              ? "fill-red-500 text-red-500"
                              : "text-gray-600"
                          }`}
                        />
                      </button>

                      {/* Quick View Button */}
                      <Link
                        to={`/products/${product.id}`}
                        className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300"
                      >
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <button className="bg-white text-gray-800 px-6 py-2 rounded-full font-semibold flex items-center gap-2 shadow-lg">
                            <Eye className="h-4 w-4" />
                            Quick View
                          </button>
                        </div>
                      </Link>

                      <Link to={`/products/${product.id}`}>
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        {!product.inStock && (
                          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                            <span className="bg-white px-4 py-2 rounded text-sm">
                              Out of Stock
                            </span>
                          </div>
                        )}
                      </Link>
                    </div>
                    <CardContent className="p-3 flex-1 flex flex-col">
                      {/* Category & Rating */}
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded font-medium">
                          {product.category}
                        </span>
                        {product.rating && (
                          <div className="flex items-center gap-0.5 bg-yellow-50 px-1.5 py-0.5 rounded">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span className="text-xs font-semibold text-gray-700">
                              {product.rating}
                            </span>
                            <span className="text-xs text-gray-500">(428)</span>
                          </div>
                        )}
                      </div>

                      {/* Product Name */}
                      <Link to={`/products/${product.id}`}>
                        <h3 className="mb-1 text-sm font-medium hover:text-orange-600 transition-colors line-clamp-2 h-8">
                          {product.name}
                        </h3>
                      </Link>

                      {/* Verified Seller Badge */}
                      <div className="flex items-center gap-1 mb-2 text-xs text-gray-600">
                        <div className="h-3 w-3 bg-green-500 rounded-full"></div>
                        <span>✓ Verified Seller</span>
                      </div>

                      {/* Price Section */}
                      <div className="mb-2">
                        <div className="flex items-baseline gap-2">
                          <p className="text-lg font-bold text-orange-600">
                            {formatCurrency(product.price)}
                          </p>
                          <p className="text-xs text-gray-500 line-through">
                            {formatCurrency(Math.round(product.price * 1.18))}
                          </p>
                        </div>
                        <p className="text-xs text-gray-500 font-medium">
                          {product.unit}
                        </p>
                      </div>

                      {/* Delivery Info */}
                      <div className="flex items-center gap-1 mb-3 text-xs text-green-700 bg-green-50 px-2 py-1 rounded">
                        <Truck className="h-3 w-3" />
                        <span>Free Delivery</span>
                      </div>

                      {/* Stock */}
                      <div className="mb-3">
                        <StockBadge
                          stockQuantity={product.stockQuantity}
                          inStock={product.inStock}
                          size="sm"
                        />
                      </div>

                      {/* Add to Cart Button */}
                      <Button
                        onClick={() => addToCart(product)}
                        disabled={!product.inStock}
                        className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-gray-300 text-white font-semibold flex items-center justify-center gap-2 mt-auto"
                      >
                        <CartIcon className="h-4 w-4" />
                        {product.inStock ? "Add to Cart" : "Out of Stock"}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {!isLoading && filteredAndSortedProducts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">
                  No products found in this category.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
