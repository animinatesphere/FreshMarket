import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Product } from '../data/products';
import { supabase } from '../utils/supabase';
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

  // Load wishlist from Supabase when user logs in
  useEffect(() => {
    if (!user) {
      setWishlistItems([]);
      return;
    }
    loadWishlist();
  }, [user]);

  const loadWishlist = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from('wishlist')
      .select('product_id')
      .eq('user_id', user.id);

    if (error) {
      console.error('Error loading wishlist:', error);
      return;
    }

    // We store just product_ids and match against the local products list
    // The product details come from static data which the app already has
    setWishlistItems((prev) => {
      const ids = (data || []).map((r: any) => r.product_id);
      return prev.filter((p) => ids.includes(p.id));
    });
  };

  const addToWishlist = async (product: Product) => {
    if (wishlistItems.find((item) => item.id === product.id)) return;
    setWishlistItems((prev) => [...prev, product]);

    if (user) {
      await supabase.from('wishlist').upsert({
        user_id: user.id,
        product_id: product.id,
      });
    }
  };

  const removeFromWishlist = async (productId: string) => {
    setWishlistItems((prev) => prev.filter((item) => item.id !== productId));

    if (user) {
      await supabase
        .from('wishlist')
        .delete()
        .eq('user_id', user.id)
        .eq('product_id', productId);
    }
  };

  const isInWishlist = (productId: string) => {
    return wishlistItems.some((item) => item.id === productId);
  };

  const clearWishlist = async () => {
    setWishlistItems([]);
    if (user) {
      await supabase.from('wishlist').delete().eq('user_id', user.id);
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
