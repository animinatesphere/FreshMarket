import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router';
import { Star, Minus, Plus, ShoppingCart, ArrowLeft, Leaf, Truck, Shield, Heart } from 'lucide-react';
import { products } from '../data/products';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { formatCurrency } from '../utils/currency';
import { ProductReviews } from '../components/ProductReviews';
import { StockBadge } from '../components/StockBadge';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { ShareButtons } from '../components/ShareButtons';

export function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [quantity, setQuantity] = useState(1);

  const product = products.find(p => p.id === id);

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
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/cart');
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
            { label: 'Products', path: '/products' },
            { label: product.category, path: `/products?category=${product.category}` },
            { label: product.name }
          ]}
        />

        {/* Product Details */}
        <div className="grid md:grid-cols-2 gap-12 mb-16">
          {/* Image */}
          <div>
            <img
              src={product.image}
              alt={product.name}
              className="w-full rounded-xl shadow-lg"
            />
          </div>

          {/* Info */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-orange-100 text-orange-800 text-sm px-3 py-1 rounded">
                {product.category}
              </span>
              <StockBadge
                stockQuantity={product.stockQuantity}
                inStock={product.inStock}
                size="md"
              />
            </div>

            <h1 className="text-4xl mb-4">{product.name}</h1>

            {product.rating && (
              <div className="flex items-center gap-2 mb-6">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(product.rating!)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-gray-600">
                  {product.rating} out of 5
                </span>
              </div>
            )}

            <div className="mb-6">
              <p className="text-4xl text-orange-600 mb-1">{formatCurrency(product.price)}</p>
              <p className="text-gray-600">{product.unit}</p>
            </div>

            <p className="text-gray-700 mb-8 text-lg leading-relaxed">
              {product.description}
            </p>

            {/* Quantity Selector */}
            <div className="mb-6">
              <label className="block text-sm mb-2">Quantity</label>
              <div className="flex items-center gap-4">
                <div className="flex items-center border rounded-md">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 hover:bg-gray-100"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="px-6">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-3 hover:bg-gray-100"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <p className="text-gray-600">
                  Total: {formatCurrency(product.price * quantity)}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 mb-8">
              <Button
                size="lg"
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className="flex-1 bg-orange-600 hover:bg-orange-700"
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                Add to Cart
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={handleBuyNow}
                disabled={!product.inStock}
                className="flex-1"
              >
                Buy Now
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() =>
                  isInWishlist(product.id)
                    ? removeFromWishlist(product.id)
                    : addToWishlist(product)
                }
                className="px-6"
              >
                <Heart
                  className={`h-5 w-5 ${
                    isInWishlist(product.id)
                      ? 'fill-red-500 text-red-500'
                      : ''
                  }`}
                />
              </Button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="text-center p-4 bg-white rounded-lg">
                <Leaf className="h-6 w-6 text-orange-600 mx-auto mb-2" />
                <p className="text-xs text-gray-600">100% Organic</p>
              </div>
              <div className="text-center p-4 bg-white rounded-lg">
                <Truck className="h-6 w-6 text-orange-600 mx-auto mb-2" />
                <p className="text-xs text-gray-600">Fast Delivery</p>
              </div>
              <div className="text-center p-4 bg-white rounded-lg">
                <Shield className="h-6 w-6 text-orange-600 mx-auto mb-2" />
                <p className="text-xs text-gray-600">Quality Guarantee</p>
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
          <div>
            <h2 className="text-3xl mb-8">Related Products</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <Card key={relatedProduct.id} className="overflow-hidden hover:shadow-lg transition-shadow">
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
                    <p className="text-2xl text-orange-600 mb-3">{formatCurrency(relatedProduct.price)}</p>
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
