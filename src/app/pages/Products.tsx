import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router";
import { Star, Heart, ShoppingCart as CartIcon } from "lucide-react";
import { api } from "../lib/api";
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
  const [products, setProducts] = useState<Product[]>([]);

  const categoryFromUrl = searchParams.get("category") || "All";
  const [selectedCategory, setSelectedCategory] = useState(categoryFromUrl);
  const [sortBy, setSortBy] = useState("featured");

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams();
        if (selectedCategory !== "All") params.set("category", selectedCategory);
        params.set("sort", sortBy);
        const data = await api.get<Product[]>(`/products?${params.toString()}`);
        setProducts(data);
      } catch (err) {
        console.error("Failed to load products:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, [selectedCategory, sortBy]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setSearchParams(category === "All" ? {} : { category });
  };

  return (
    <div className="bg-background min-h-screen">
      {/* Header */}
      <div className="bg-primary text-primary-foreground py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="uppercase tracking-[0.2em] text-xs font-semibold text-primary-foreground/70 mb-3">
            The Market
          </p>
          <h1 className="text-4xl md:text-5xl mb-4">Our Products</h1>
          <p className="text-primary-foreground/80 max-w-2xl">
            Browse our complete selection of fresh, organic, and sustainably
            sourced food products.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="lg:w-64 flex-shrink-0">
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="mb-6">
                  <h3 className="mb-4">Categories</h3>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <button
                        key={category}
                        onClick={() => handleCategoryChange(category)}
                        className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                          selectedCategory === category
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-foreground/70 hover:bg-accent/10"
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
                    className="w-full px-4 py-2 border border-border rounded-lg bg-input-background"
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
              <p className="text-muted-foreground">
                {!isLoading && (
                  <>
                    Showing {products.length} product
                    {products.length !== 1 ? "s" : ""}
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
                {products.map((product) => (
                  <Card
                    key={product.id}
                    className="overflow-hidden border-0 shadow-sm card-hover flex flex-col group"
                  >
                    <div className="relative h-48 bg-muted overflow-hidden">
                      <button
                        onClick={() =>
                          isInWishlist(product.id)
                            ? removeFromWishlist(product.id)
                            : addToWishlist(product)
                        }
                        className="absolute top-2 right-2 z-20 bg-card p-2 rounded-full shadow-md hover:scale-110 transition-transform"
                      >
                        <Heart
                          className={`h-5 w-5 ${
                            isInWishlist(product.id)
                              ? "fill-accent text-accent"
                              : "text-foreground/60"
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
                          <div className="absolute inset-0 bg-foreground/50 flex items-center justify-center">
                            <span className="bg-card px-4 py-2 rounded text-sm font-bold">
                              Out of Stock
                            </span>
                          </div>
                        )}
                      </Link>
                    </div>

                    <CardContent className="p-4 flex-1 flex flex-col">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded-full font-medium">
                          {product.category}
                        </span>
                        {product.rating > 0 && (
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 fill-accent text-accent" />
                            <span className="text-xs font-bold">{product.rating}</span>
                          </div>
                        )}
                      </div>

                      <Link to={`/products/${product.id}`}>
                        <h3 className="text-sm font-semibold mb-1 hover:text-accent truncate font-sans">
                          {product.name}
                        </h3>
                      </Link>

                      <div className="mb-2">
                        <StockBadge inStock={product.inStock} stockQuantity={product.stockQuantity} size="sm" />
                      </div>

                      <div className="mb-4">
                        <p className="text-lg font-bold text-primary">
                          {formatCurrency(product.price)}
                        </p>
                        <p className="text-xs text-muted-foreground">{product.unit}</p>
                      </div>

                      <div className="mt-auto">
                        <Button
                          onClick={() => addToCart(product)}
                          disabled={!product.inStock}
                          className="w-full gap-2"
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

            {!isLoading && products.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">
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
