import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router";
import {
  Star,
  Minus,
  Plus,
  ShoppingCart,
  ArrowLeft,
  Leaf,
  Truck,
  Shield,
  Heart,
} from "lucide-react";
import { products } from "../data/products";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { formatCurrency } from "../utils/currency";
import { ProductReviews } from "../components/ProductReviews";
import { StockBadge } from "../components/StockBadge";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { ShareButtons } from "../components/ShareButtons";

export function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [quantity, setQuantity] = useState(1);

  const product = products.find((p) => p.id === id);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h2 className="text-2xl mb-4">Product Not Found</h2>
        <Link to="/products">
          <Button>Back to Products</Button>
        </Link>
      </div>
    );
  }

  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate("/cart");
  };

  return (
    <div className="bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        {/* Breadcrumbs */}
        <Breadcrumbs
          items={[
            { label: "Products", path: "/products" },
            {
              label: product.category,
              path: `/products?category=${product.category}`,
            },
            { label: product.name },
          ]}
        />

        {/* Product Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 mb-16">
          {/* Image */}
          <div className="flex justify-center">
            <img
              src={product.image}
              alt={product.name}
              className="w-full max-w-md md:max-w-none rounded-xl shadow-lg"
            />
          </div>

          {/* Info */}
          <div>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-4">
              <span className="bg-orange-100 text-orange-800 text-xs sm:text-sm px-3 py-1 rounded">
                {product.category}
              </span>
              <StockBadge
                stockQuantity={product.stockQuantity}
                inStock={product.inStock}
                size="md"
              />
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
              {product.name}
            </h1>

            {product.rating && (
              <div className="flex flex-wrap items-center gap-2 mb-6">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 sm:h-5 w-4 sm:w-5 ${
                        i < Math.floor(product.rating!)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs sm:text-sm text-gray-600">
                  {product.rating} out of 5
                </span>
              </div>
            )}

            <div className="mb-6">
              <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-orange-600 mb-1">
                {formatCurrency(product.price)}
              </p>
              <p className="text-sm sm:text-base text-gray-600">
                {product.unit}
              </p>
            </div>

            <p className="text-sm sm:text-base text-gray-700 mb-8 leading-relaxed">
              {product.description}
            </p>

            {/* Quantity Selector */}
            <div className="mb-6">
              <label className="block text-xs sm:text-sm font-medium mb-2">
                Quantity
              </label>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 sm:p-3 hover:bg-gray-100 transition"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="px-3 sm:px-6 text-center font-medium">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 sm:p-3 hover:bg-gray-100 transition"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <p className="text-xs sm:text-sm text-gray-600 font-medium">
                  Total:{" "}
                  <span className="text-orange-600">
                    {formatCurrency(product.price * quantity)}
                  </span>
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 mb-8">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Button
                  size="lg"
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  className="col-span-1 sm:col-span-2 bg-orange-600 hover:bg-orange-700 text-white font-semibold w-full"
                >
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Add to Cart
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() =>
                    isInWishlist(product.id)
                      ? removeFromWishlist(product.id)
                      : addToWishlist(product)
                  }
                  className="w-full"
                  title={
                    isInWishlist(product.id)
                      ? "Remove from Wishlist"
                      : "Add to Wishlist"
                  }
                >
                  <Heart
                    className={`h-5 w-5 ${
                      isInWishlist(product.id)
                        ? "fill-red-500 text-red-500"
                        : ""
                    }`}
                  />
                </Button>
              </div>
              <Button
                size="lg"
                variant="outline"
                onClick={handleBuyNow}
                disabled={!product.inStock}
                className="w-full font-semibold"
              >
                Buy Now
              </Button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-8">
              <div className="text-center p-3 sm:p-4 bg-white rounded-lg border border-gray-100 hover:shadow-md transition">
                <Leaf className="h-5 sm:h-6 w-5 sm:w-6 text-green-600 mx-auto mb-2" />
                <p className="text-xs sm:text-sm text-gray-600 font-medium">
                  100% Organic
                </p>
              </div>
              <div className="text-center p-3 sm:p-4 bg-white rounded-lg border border-gray-100 hover:shadow-md transition">
                <Truck className="h-5 sm:h-6 w-5 sm:w-6 text-blue-600 mx-auto mb-2" />
                <p className="text-xs sm:text-sm text-gray-600 font-medium">
                  Fast Delivery
                </p>
              </div>
              <div className="text-center p-3 sm:p-4 bg-white rounded-lg border border-gray-100 hover:shadow-md transition">
                <Shield className="h-5 sm:h-6 w-5 sm:w-6 text-orange-600 mx-auto mb-2" />
                <p className="text-xs sm:text-sm text-gray-600 font-medium">
                  Quality Guarantee
                </p>
              </div>
            </div>

            {/* Share Buttons */}
            <div className="pt-8 border-t">
              <ShareButtons title={product.name} />
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-12">
          <ProductReviews productId={product.id} />
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-8">
              Related Products
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.map((relatedProduct) => (
                <Card
                  key={relatedProduct.id}
                  className="overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <Link to={`/products/${relatedProduct.id}`}>
                    <img
                      src={relatedProduct.image}
                      alt={relatedProduct.name}
                      className="w-full h-48 object-cover"
                    />
                  </Link>
                  <CardContent className="p-4">
                    <Link to={`/products/${relatedProduct.id}`}>
                      <h3 className="mb-2 hover:text-orange-600 transition-colors">
                        {relatedProduct.name}
                      </h3>
                    </Link>
                    <p className="text-2xl text-orange-600 mb-3">
                      {formatCurrency(relatedProduct.price)}
                    </p>
                    <Button
                      size="sm"
                      onClick={() => addToCart(relatedProduct)}
                      className="w-full bg-orange-600 hover:bg-orange-700"
                    >
                      Add to Cart
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
