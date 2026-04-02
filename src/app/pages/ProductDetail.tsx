import { useState, useEffect } from "react";
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
  Loader2,
} from "lucide-react";
import { supabase } from "../utils/supabase";
import { Product } from "../data/products";
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
  
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProductDetails = async () => {
      if (!id) return;
      setIsLoading(true);
      try {
        // Fetch current product
        const { data: pData, error: pError } = await supabase
          .from("products")
          .select("*")
          .eq("id", id)
          .maybeSingle();

        if (pError) throw pError;
        
        if (pData) {
          const mappedProduct: Product = {
            id: pData.id.toString(),
            name: pData.name,
            description: pData.description,
            price: pData.price,
            category: pData.category,
            image: pData.image,
            unit: pData.unit,
            inStock: pData.in_stock,
            stockQuantity: pData.stock_quantity,
            featured: pData.featured,
            rating: pData.rating,
          };
          setProduct(mappedProduct);

          // Fetch related products
          const { data: rData, error: rError } = await supabase
            .from("products")
            .select("*")
            .eq("category", pData.category)
            .neq("id", id)
            .limit(4);
          
          if (!rError && rData) {
            setRelatedProducts(rData.map((rp: any) => ({
              id: rp.id.toString(),
              name: rp.name,
              description: rp.description,
              price: rp.price,
              category: rp.category,
              image: rp.image,
              unit: rp.unit,
              inStock: rp.in_stock,
              stockQuantity: rp.stock_quantity,
              featured: rp.featured,
              rating: rp.rating,
            })));
          }
        }
      } catch (err) {
        console.error("Error fetching product details:", err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProductDetails();
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate("/cart");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-12 w-12 text-orange-600 animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h2 className="text-2xl mb-4 font-bold">Product Not Found</h2>
        <p className="text-gray-600 mb-8">The product you are looking for does not exist or has been removed.</p>
        <Link to="/products">
          <Button className="bg-orange-600 hover:bg-orange-700">Back to Products</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
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
          <div className="flex justify-center bg-white p-4 rounded-2xl shadow-sm h-fit">
            <img
              src={product.image}
              alt={product.name}
              className="w-full max-w-md md:max-w-none rounded-xl shadow-inner object-cover transition-transform hover:scale-[1.02] duration-300"
            />
          </div>

          {/* Info */}
          <div>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-4">
              <span className="bg-orange-100 text-orange-800 text-xs sm:text-sm px-3 py-1 rounded-full font-semibold">
                {product.category}
              </span>
              <StockBadge
                stockQuantity={product.stockQuantity}
                inStock={product.inStock}
                size="md"
              />
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight text-gray-900">
              {product.name}
            </h1>

            {product.rating !== undefined && product.rating > 0 && (
              <div className="flex flex-wrap items-center gap-2 mb-6">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 sm:h-5 w-4 sm:w-5 ${
                        i < Math.floor(product.rating || 0)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs sm:text-sm text-gray-600 font-medium">
                  {product.rating} out of 5
                </span>
              </div>
            )}

            <div className="mb-6">
              <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-orange-600 mb-1">
                {formatCurrency(product.price)}
              </p>
              <p className="text-sm sm:text-base text-gray-600 font-medium italic">
                {product.unit}
              </p>
            </div>

            <p className="text-sm sm:text-base text-gray-700 mb-8 leading-relaxed bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
              {product.description}
            </p>

            {/* Quantity Selector */}
            <div className="mb-6">
              <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">
                Select Quantity
              </label>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                <div className="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden bg-white">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 hover:bg-gray-100 transition active:bg-gray-200"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="px-6 text-center font-bold text-lg min-w-[50px]">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-3 hover:bg-gray-100 transition active:bg-gray-200"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <p className="text-sm sm:text-base text-gray-600 font-semibold">
                  Subtotal:{" "}
                  <span className="text-orange-600 text-lg">
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
                  className="col-span-1 sm:col-span-2 bg-orange-600 hover:bg-orange-700 text-white font-bold h-14 text-lg shadow-lg shadow-orange-200"
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
                  className="h-14 hover:bg-gray-50 border-2"
                >
                  <Heart
                    className={`h-6 w-6 transition-colors ${
                      isInWishlist(product.id)
                        ? "fill-red-500 text-red-500"
                        : "text-gray-400"
                    }`}
                  />
                </Button>
              </div>
              <Button
                size="lg"
                variant="outline"
                onClick={handleBuyNow}
                disabled={!product.inStock}
                className="w-full font-bold h-14 text-lg border-2 border-orange-600 text-orange-600 hover:bg-orange-50"
              >
                Buy It Now
              </Button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-8">
              <div className="text-center p-3 sm:p-4 bg-white rounded-xl border border-gray-100 hover:shadow-md transition">
                <Leaf className="h-5 sm:h-6 w-5 sm:w-6 text-green-600 mx-auto mb-2" />
                <p className="text-[10px] sm:text-xs text-gray-700 font-bold uppercase">
                  100% Organic
                </p>
              </div>
              <div className="text-center p-3 sm:p-4 bg-white rounded-xl border border-gray-100 hover:shadow-md transition">
                <Truck className="h-5 sm:h-6 w-5 sm:w-6 text-blue-600 mx-auto mb-2" />
                <p className="text-[10px] sm:text-xs text-gray-700 font-bold uppercase">
                  Fast Delivery
                </p>
              </div>
              <div className="text-center p-3 sm:p-4 bg-white rounded-xl border border-gray-100 hover:shadow-md transition">
                <Shield className="h-5 sm:h-6 w-5 sm:w-6 text-orange-600 mx-auto mb-2" />
                <p className="text-[10px] sm:text-xs text-gray-700 font-bold uppercase">
                  Quality Guaranteed
                </p>
              </div>
            </div>

            {/* Share Buttons */}
            <div className="pt-8 border-t border-gray-200">
              <ShareButtons title={product.name} />
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-12 bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100">
          <ProductReviews productId={product.id} />
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 border-l-4 border-orange-600 pl-4">
                  Related Products
                </h2>
                <Link to="/products" className="text-orange-600 font-semibold hover:underline">View All</Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.map((relatedProduct) => (
                <Card
                  key={relatedProduct.id}
                  className="overflow-hidden hover:shadow-xl transition-all group border-0 shadow-sm"
                >
                  <Link to={`/products/${relatedProduct.id}`}>
                    <div className="h-48 overflow-hidden bg-gray-100">
                        <img
                          src={relatedProduct.image}
                          alt={relatedProduct.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                    </div>
                  </Link>
                  <CardContent className="p-4">
                    <Link to={`/products/${relatedProduct.id}`}>
                      <h3 className="font-semibold text-gray-900 hover:text-orange-600 transition-colors truncate mb-1">
                        {relatedProduct.name}
                      </h3>
                    </Link>
                    <p className="text-xl font-bold text-orange-600 mb-4">
                      {formatCurrency(relatedProduct.price)}
                    </p>
                    <Button
                      size="sm"
                      onClick={() => addToCart(relatedProduct)}
                      disabled={!relatedProduct.inStock}
                      className="w-full bg-orange-600 hover:bg-orange-700 font-bold"
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
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
