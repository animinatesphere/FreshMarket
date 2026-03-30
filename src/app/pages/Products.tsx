import { useState, useMemo, useEffect } from "react";
import { Link, useSearchParams } from "react-router";
import { Star, Heart } from "lucide-react";
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
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, idx) => (
                  <SkeletonProductCard key={idx} />
                ))}
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAndSortedProducts.map((product) => (
                  <Card
                    key={product.id}
                    className="overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <div className="relative">
                      <Link to={`/products/${product.id}`}>
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-56 object-cover"
                        />
                        {!product.inStock && (
                          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                            <span className="bg-white px-4 py-2 rounded text-sm">
                              Out of Stock
                            </span>
                          </div>
                        )}
                      </Link>
                      <button
                        onClick={() =>
                          isInWishlist(product.id)
                            ? removeFromWishlist(product.id)
                            : addToWishlist(product)
                        }
                        className="absolute top-2 right-2 bg-white p-2 rounded-full shadow-md hover:scale-110 transition-transform"
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
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">
                          {product.category}
                        </span>
                        {product.rating && (
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm">{product.rating}</span>
                          </div>
                        )}
                      </div>
                      <Link to={`/products/${product.id}`}>
                        <h3 className="mb-2 hover:text-orange-600 transition-colors">
                          {product.name}
                        </h3>
                      </Link>
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                        {product.description}
                      </p>
                      <div className="mb-3">
                        <StockBadge
                          stockQuantity={product.stockQuantity}
                          inStock={product.inStock}
                          size="sm"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-2xl text-orange-600">
                            {formatCurrency(product.price)}
                          </p>
                          <p className="text-xs text-gray-500">
                            {product.unit}
                          </p>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => addToCart(product)}
                          disabled={!product.inStock}
                          className="bg-orange-600 hover:bg-orange-700 disabled:bg-gray-300"
                        >
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
