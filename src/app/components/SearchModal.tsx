import { useState, useEffect } from 'react';
import { X, Search } from 'lucide-react';
import { Link } from 'react-router';
import { products } from '../data/products';
import { formatCurrency } from '../utils/currency';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(products);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setSearchResults(products);
      return;
    }

    const filtered = products.filter(
      (product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setSearchResults(filtered);
  }, [searchQuery]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black bg-opacity-50 flex items-start justify-center pt-20">
      <div className="bg-white rounded-lg w-full max-w-3xl mx-4 max-h-[80vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="p-4 border-b flex items-center gap-3">
          <Search className="h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search for products..."
            className="flex-1 outline-none text-lg"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoFocus
          />
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Results */}
        <div className="overflow-y-auto flex-1 p-4">
          {searchResults.length === 0 ? (
            <div className="text-center py-12">
              <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">No products found for "{searchQuery}"</p>
            </div>
          ) : (
            <div className="space-y-3">
              {searchResults.map((product) => (
                <Link
                  key={product.id}
                  to={`/products/${product.id}`}
                  onClick={onClose}
                  className="flex gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium mb-1">{product.name}</h3>
                    <p className="text-sm text-gray-600 line-clamp-1 mb-2">
                      {product.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-orange-600 font-semibold">
                        {formatCurrency(product.price)}
                      </span>
                      <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">
                        {product.category}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
