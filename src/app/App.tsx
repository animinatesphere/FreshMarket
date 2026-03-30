import { RouterProvider } from "react-router";
import { router } from "./routes";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";
import { AuthProvider } from "./context/AuthContext";
import { TransactionProvider } from "./context/TransactionContext";

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <TransactionProvider>
            <RouterProvider router={router} />
          </TransactionProvider>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
}
