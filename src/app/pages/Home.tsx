import { Link } from "react-router";
import {
  ArrowRight,
  Truck,
  Shield,
  Star,
  Leaf,
  Heart,
  TrendingUp,
  Clock,
  Users,
} from "lucide-react";
import { products } from "../data/products";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { formatCurrency } from "../utils/currency";

export function Home() {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { user, isAuthenticated } = useAuth();
  const featuredProducts = products.filter((p) => p.featured);

  return (
    <div>
      {/* Hero Section - Enhanced */}
      <section className="bg-gradient-to-br from-orange-50 via-white to-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="inline-block">
                  <span className="bg-orange-100 text-orange-800 px-4 py-2 rounded-full text-sm font-medium">
                    🌱 100% Organic & Fresh
                  </span>
                </div>
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight">
                  Fresh & Organic Food, Delivered to Your Door
                </h1>
              </div>
              <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
                Discover the finest selection of organic produce, artisan goods,
                and sustainably sourced products. Support local farmers while
                eating healthy.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/products">
                  <Button
                    size="lg"
                    className="bg-orange-600 hover:bg-orange-700 text-white w-full sm:w-auto"
                  >
                    Shop Now
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                {!isAuthenticated && (
                  <Link to="/signup">
                    <Button
                      size="lg"
                      variant="outline"
                      className="w-full sm:w-auto"
                    >
                      Join & Get 10% Off
                      <TrendingUp className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                )}
                {isAuthenticated &&
                  isAuthenticated &&
                  user?.role === "admin" && (
                    <Link to="/admin">
                      <Button
                        size="lg"
                        variant="outline"
                        className="w-full sm:w-auto"
                      >
                        Admin Dashboard
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  )}
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-col sm:flex-row gap-6 pt-4">
                <div className="flex items-center gap-2">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <Shield className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Secure & Safe</p>
                    <p className="text-xs text-gray-600">
                      100% secure payments
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <Truck className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Fast Delivery</p>
                    <p className="text-xs text-gray-600">
                      Free on orders over ₦75k
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative hidden md:block">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-200 to-orange-100 rounded-3xl blur-3xl opacity-30"></div>
              <img
                src="https://images.unsplash.com/photo-1722810767143-40a6a7a74b13?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMG9yZ2FuaWMlMjB2ZWdldGFibGVzfGVufDF8fHx8MTc3MDgyMTQyMXww&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Fresh organic vegetables"
                className="rounded-3xl shadow-2xl relative z-10 object-cover h-96 w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <p className="text-4xl font-bold text-orange-500 mb-2">50K+</p>
              <p className="text-gray-300">Happy Customers</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-orange-500 mb-2">500+</p>
              <p className="text-gray-300">Products Available</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-orange-500 mb-2">4.8★</p>
              <p className="text-gray-300">Average Rating</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-orange-500 mb-2">24/7</p>
              <p className="text-gray-300">Customer Support</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Enhanced */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose FreshMarket?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We're committed to bringing you the best quality products with
              exceptional service.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6 text-center space-y-4">
                <div className="bg-gradient-to-br from-orange-100 to-orange-50 w-16 h-16 rounded-xl flex items-center justify-center mx-auto">
                  <Truck className="h-8 w-8 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Free Delivery</h3>
                  <p className="text-sm text-gray-600">
                    On all orders over ₦75,000 within Lagos
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6 text-center space-y-4">
                <div className="bg-gradient-to-br from-green-100 to-green-50 w-16 h-16 rounded-xl flex items-center justify-center mx-auto">
                  <Leaf className="h-8 w-8 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">100% Organic</h3>
                  <p className="text-sm text-gray-600">
                    Certified organic products from trusted farms
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6 text-center space-y-4">
                <div className="bg-gradient-to-br from-blue-100 to-blue-50 w-16 h-16 rounded-xl flex items-center justify-center mx-auto">
                  <Shield className="h-8 w-8 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Secure Payment</h3>
                  <p className="text-sm text-gray-600">
                    PCI compliant, encrypted transactions
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6 text-center space-y-4">
                <div className="bg-gradient-to-br from-yellow-100 to-yellow-50 w-16 h-16 rounded-xl flex items-center justify-center mx-auto">
                  <Star className="h-8 w-8 text-yellow-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Best Quality</h3>
                  <p className="text-sm text-gray-600">
                    Quality guaranteed or your money back
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Featured Products
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Handpicked selection of our finest products, fresh from local
              farms and artisan producers.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <Card
                key={product.id}
                className="overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="relative">
                  <Link to={`/products/${product.id}`}>
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-48 object-cover hover:scale-105 transition-transform"
                    />
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
                      className={`h-4 w-4 ${
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
                    <h3 className="mb-1 font-medium hover:text-orange-600 transition-colors line-clamp-2">
                      {product.name}
                    </h3>
                  </Link>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {product.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-orange-600">
                        {formatCurrency(product.price)}
                      </p>
                      <p className="text-xs text-gray-500">{product.unit}</p>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => addToCart(product)}
                      className="bg-orange-600 hover:bg-orange-700"
                    >
                      Add
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/products">
              <Button
                variant="outline"
                size="lg"
                className="border-orange-600 text-orange-600 hover:bg-orange-50"
              >
                View All Products
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              {
                icon: Users,
                title: "Create Account",
                desc: "Sign up and join our community",
              },
              {
                icon: Star,
                title: "Browse Products",
                desc: "Explore our organic selection",
              },
              {
                icon: Heart,
                title: "Add to Cart",
                desc: "Build your perfect order",
              },
              {
                icon: Truck,
                title: "Fast Delivery",
                desc: "Receive at your doorstep",
              },
            ].map((step, idx) => (
              <div key={idx} className="text-center">
                <div className="relative">
                  <div className="w-20 h-20 bg-gradient-to-br from-orange-100 to-orange-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <step.icon className="h-10 w-10 text-orange-600" />
                  </div>
                  {idx < 3 && (
                    <div className="hidden md:block absolute top-10 -right-3 w-6 border-t-2 border-orange-600"></div>
                  )}
                </div>
                <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
                <p className="text-gray-600 text-sm">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Enhanced */}
      <section className="py-20 bg-gradient-to-r from-orange-600 to-orange-700 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Start Eating Healthy Today
            </h2>
            <p className="text-xl text-orange-100">
              Join thousands of satisfied customers who trust FreshMarket for
              their organic, fresh food needs.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/products">
              <Button
                size="lg"
                className="bg-white text-orange-600 hover:bg-gray-100 w-full sm:w-auto"
              >
                Browse Products
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            {!isAuthenticated && (
              <Link to="/signup">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-orange-700 w-full sm:w-auto"
                >
                  Create Account
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Admin Invitation Section */}
      {isAuthenticated && user?.role === "admin" && (
        <section className="py-12 bg-gradient-to-r from-red-50 to-red-100 border-2 border-red-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              👨‍💼 Admin Access
            </h3>
            <p className="text-gray-600 mb-6">
              You have admin privileges. Access the admin dashboard to manage
              products, users, and view analytics.
            </p>
            <Link to="/admin">
              <Button className="bg-red-600 hover:bg-red-700 text-white">
                Go to Admin Dashboard
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}
