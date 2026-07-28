import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Product } from '../data/products';
import { api } from '../lib/api';
import { useAuth } from './AuthContext';

interface WishlistContextType {
  wishlistItems: Product[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlistItems, setWishlistItems] = useState<Product[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setWishlistItems([]);
      return;
    }
    loadWishlist();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const loadWishlist = async () => {
    try {
      const data = await api.get<Product[]>('/wishlist');
      setWishlistItems(data);
    } catch (err) {
      console.error('Error loading wishlist:', err);
    }
  };

  const addToWishlist = async (product: Product) => {
    if (wishlistItems.find((item) => item.id === product.id)) return;
    setWishlistItems((prev) => [...prev, product]);

    if (user) {
      try {
        await api.post('/wishlist', { productId: product.id });
      } catch (err) {
        console.error('Error adding to wishlist:', err);
      }
    }
  };

  const removeFromWishlist = async (productId: string) => {
    setWishlistItems((prev) => prev.filter((item) => item.id !== productId));

    if (user) {
      try {
        await api.delete(`/wishlist/${productId}`);
      } catch (err) {
        console.error('Error removing from wishlist:', err);
      }
    }
  };

  const isInWishlist = (productId: string) => {
    return wishlistItems.some((item) => item.id === productId);
  };

  const clearWishlist = async () => {
    setWishlistItems([]);
    if (user) {
      try {
        await api.delete('/wishlist');
      } catch (err) {
        console.error('Error clearing wishlist:', err);
      }
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        clearWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
