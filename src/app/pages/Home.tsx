import { useState, useEffect } from "react";
import { Link } from "react-router";
import { Star, Heart, ShoppingCart, ArrowRight, Loader2, Package, Leaf, Truck, ShieldCheck } from "lucide-react";
import { api } from "../lib/api";
import { Product, categories } from "../data/products";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { formatCurrency } from "../utils/currency";
import { ImageLoader } from "../components/ImageLoader";

const getBannerProducts = (products: Product[]) => {
  return products.slice(0, 3).map((product) => ({
    product,
    title: product.name,
    description: product.description,
    image: product.image,
  }));
};

const perks = [
  { icon: Leaf, title: "Organically Sourced", description: "Grown by local farmers we know by name." },
  { icon: Truck, title: "Fast Delivery", description: "Fresh to your door, usually the same day." },
  { icon: ShieldCheck, title: "Quality Guaranteed", description: "Not happy? We'll make it right, no questions asked." },
];

export function Home() {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const data = await api.get<Product[]>("/products");
        setProducts(data);
      } catch (err) {
        console.error("Home fetch failed:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const banners = getBannerProducts(products);
  const featuredProducts = products.filter((p) => p.featured).slice(0, 4);
  const displayProducts = featuredProducts.length > 0 ? featuredProducts : products.slice(0, 4);

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
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Banner */}
      {currentBanner ? (
        <div className="relative h-[520px] sm:h-[560px] overflow-hidden">
          <div
            className="absolute inset-0 transition-all duration-700 ease-in-out"
            style={{
              backgroundImage: `url(${currentBanner.image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#14201a]/85 via-[#14201a]/55 to-transparent" />
          <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
            <div className="text-white space-y-6 flex-1 max-w-2xl">
              <p className="uppercase tracking-[0.25em] text-xs font-semibold text-white/70 animate-in fade-in duration-700">
                Fresh from the farm
              </p>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl animate-in fade-in slide-in-from-left-8 duration-700">
                {currentBanner.title}
              </h1>
              <p className="text-lg text-white/85 max-w-xl animate-in fade-in slide-in-from-left-8 duration-700 delay-100">
                {currentBanner.description.trim().slice(0, 150)}
              </p>
              <div className="flex justify-start gap-4 pt-4 animate-in fade-in slide-in-from-left-8 duration-700 delay-200">
                <Link to="/products">
                  <Button size="lg" className="font-semibold shadow-lg">
                    Explore Market
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Button
                  size="lg"
                  variant="secondary"
                  onClick={() => addToCart(currentBanner.product)}
                  className="font-semibold shadow-lg"
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
        <div className="bg-primary h-96 flex items-center justify-center text-primary-foreground p-8">
          <div className="text-center">
            <h1 className="text-4xl mb-4">Welcome to FreshMarket</h1>
            <p className="mb-6">Please add some products in the Admin Dashboard to see them here!</p>
            <Link to="/products">
              <Button variant="secondary">Browse Shop</Button>
            </Link>
          </div>
        </div>
      )}

      {/* Perks */}
      <section className="py-12 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid sm:grid-cols-3 gap-8">
          {perks.map((perk) => (
            <div key={perk.title} className="flex items-start gap-4">
              <div className="p-3 rounded-full bg-secondary text-primary shrink-0">
                <perk.icon className="h-5 w-5" />
              </div>
              <div>
                <h4 className="mb-1">{perk.title}</h4>
                <p className="text-sm text-muted-foreground">{perk.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <p className="uppercase tracking-[0.2em] text-xs font-semibold text-accent mb-3">Shop by category</p>
            <h2 className="text-3xl md:text-4xl">What are you craving today?</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {categories.filter((c) => c !== "All").map((category) => (
              <Link
                key={category}
                to={`/products?category=${category}`}
                className="group flex flex-col items-center justify-center gap-3 p-6 rounded-2xl bg-secondary hover:bg-primary transition-colors text-center"
              >
                <span className="font-semibold text-secondary-foreground group-hover:text-primary-foreground transition-colors">
                  {category}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-secondary/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="uppercase tracking-[0.2em] text-xs font-semibold text-accent mb-3">Handpicked</p>
            <h2 className="text-3xl md:text-4xl mb-4">Featured Products</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              A handpicked selection of our freshest and most popular products
            </p>
          </div>

          {displayProducts.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {displayProducts.map((product) => (
                <Card key={product.id} className="overflow-hidden border-0 shadow-sm card-hover group">
                  <div className="relative h-48 bg-muted">
                    <ImageLoader
                      src={product.image}
                      alt={product.name}
                      imageClassName="group-hover:scale-105 transition-transform duration-300"
                    />
                    {!product.inStock && (
                      <div className="absolute inset-0 bg-foreground/50 flex items-center justify-center">
                        <span className="text-white font-bold">Out of Stock</span>
                      </div>
                    )}
                    <button
                      onClick={() =>
                        isInWishlist(product.id)
                          ? removeFromWishlist(product.id)
                          : addToWishlist(product)
                      }
                      className="absolute top-3 right-3 bg-card p-2 rounded-full shadow-md hover:scale-110 transition-transform"
                    >
                      <Heart
                        className={`h-5 w-5 ${
                          isInWishlist(product.id) ? "fill-accent text-accent" : "text-foreground/60"
                        }`}
                      />
                    </button>
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-1 mb-2">
                      <Star className="h-4 w-4 fill-accent text-accent" />
                      <span className="text-sm text-muted-foreground">{product.rating}</span>
                    </div>
                    <Link to={`/products/${product.id}`}>
                      <h3 className="font-semibold hover:text-accent transition-colors truncate font-sans">
                        {product.name}
                      </h3>
                    </Link>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3 h-10">
                      {product.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xl font-bold text-primary">
                          {formatCurrency(product.price)}
                        </p>
                        <p className="text-xs text-muted-foreground">{product.unit}</p>
                      </div>
                      <Button size="sm" onClick={() => addToCart(product)} disabled={!product.inStock}>
                        <ShoppingCart className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-card rounded-2xl shadow-sm">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No featured products available yet.</p>
            </div>
          )}

          <div className="text-center mt-12">
            <Link to="/products">
              <Button size="lg" className="font-bold shadow-lg">
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
