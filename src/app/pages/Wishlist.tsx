import { Link } from 'react-router';
import { Heart, ShoppingCart, Trash2, ArrowRight } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { formatCurrency } from '../utils/currency';

export function Wishlist() {
  const { wishlistItems, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleAddToCart = (product: any) => {
    addToCart(product);
    removeFromWishlist(product.id);
  };

  if (wishlistItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <Heart className="h-24 w-24 text-gray-300 mx-auto mb-4" />
          <h2 className="text-3xl mb-4">Your Wishlist is Empty</h2>
          <p className="text-gray-600 mb-8">
            Save your favorite products to your wishlist and they will appear here.
          </p>
          <Link to="/products">
            <Button size="lg" className="bg-orange-600 hover:bg-orange-700">
              Start Shopping
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-orange-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl mb-2">My Wishlist</h1>
          <p className="text-orange-100">
            {wishlistItems.length} item{wishlistItems.length !== 1 ? 's' : ''} saved for later
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-end mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={clearWishlist}
            className="text-red-600 hover:text-red-700"
          >
            Clear All
          </Button>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {wishlistItems.map((product) => (
            <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow relative">
              <button
                onClick={() => removeFromWishlist(product.id)}
                className="absolute top-2 right-2 z-10 bg-white p-2 rounded-full shadow-md hover:bg-red-50 transition-colors"
              >
                <Trash2 className="h-4 w-4 text-red-600" />
              </button>

              <Link to={`/products/${product.id}`}>
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
              </Link>

              <CardContent className="p-4">
                <Link to={`/products/${product.id}`}>
                  <h3 className="mb-2 hover:text-orange-600 transition-colors">
                    {product.name}
                  </h3>
                </Link>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {product.description}
                </p>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-2xl text-orange-600">{formatCurrency(product.price)}</p>
                    <p className="text-xs text-gray-500">{product.unit}</p>
                  </div>
                </div>
                <Button
                  size="sm"
                  onClick={() => handleAddToCart(product)}
                  disabled={!product.inStock}
                  className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-gray-300"
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link to="/products">
            <Button variant="outline" size="lg">
              Continue Shopping
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
