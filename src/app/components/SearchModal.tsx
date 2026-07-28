import { useState, useEffect } from 'react';
import { X, Search, Loader2 } from 'lucide-react';
import { Link } from 'react-router';
import { api } from '../lib/api';
import { Product } from '../data/products';
import { formatCurrency } from '../utils/currency';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const timeout = setTimeout(() => {
      setIsLoading(true);
      const params = searchQuery.trim() ? `?search=${encodeURIComponent(searchQuery.trim())}` : '';
      api
        .get<Product[]>(`/products${params}`)
        .then(setSearchResults)
        .catch(() => setSearchResults([]))
        .finally(() => setIsLoading(false));
    }, 250);

    return () => clearTimeout(timeout);
  }, [searchQuery, isOpen]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
      setSearchQuery('');
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-foreground/40 backdrop-blur-sm flex items-start justify-center pt-20">
      <div className="bg-card rounded-2xl w-full max-w-3xl mx-4 max-h-[80vh] flex flex-col shadow-2xl border border-border">
        {/* Header */}
        <div className="p-4 border-b border-border flex items-center gap-3">
          <Search className="h-5 w-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search for products..."
            className="flex-1 outline-none text-lg bg-transparent"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoFocus
          />
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-full">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Results */}
        <div className="overflow-y-auto flex-1 p-4">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 text-primary animate-spin" />
            </div>
          ) : searchResults.length === 0 ? (
            <div className="text-center py-12">
              <Search className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground">No products found for "{searchQuery}"</p>
            </div>
          ) : (
            <div className="space-y-3">
              {searchResults.map((product) => (
                <Link
                  key={product.id}
                  to={`/products/${product.id}`}
                  onClick={onClose}
                  className="flex gap-4 p-3 hover:bg-muted rounded-lg transition-colors"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium mb-1 font-sans">{product.name}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-1 mb-2">
                      {product.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-primary font-semibold">
                        {formatCurrency(product.price)}
                      </span>
                      <span className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded-full">
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
