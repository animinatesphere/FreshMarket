import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { Home } from "./pages/Home";
import { Products } from "./pages/Products";
import { ProductDetail } from "./pages/ProductDetail";
import { Cart } from "./pages/Cart";
import { Wishlist } from "./pages/Wishlist";
import { About } from "./pages/About";
import { Contact } from "./pages/Contact";
import { NotFound } from "./pages/NotFound";
import { Login } from "./pages/Login";
import { Signup } from "./pages/Signup";
import { AdminDashboard } from "./pages/AdminDashboard";
import { TransactionHistory } from "./pages/TransactionHistory";
import { ReceiptPage } from "./pages/ReceiptPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Home },
      { path: "products", Component: Products },
      { path: "products/:id", Component: ProductDetail },
      { path: "cart", Component: Cart },
      { path: "wishlist", Component: Wishlist },
      { path: "about", Component: About },
      { path: "contact", Component: Contact },
      { path: "transaction-history", Component: TransactionHistory },
      { path: "receipt/:id", Component: ReceiptPage },
      { path: "*", Component: NotFound },
    ],
  },
  { path: "/login", Component: Login },
  { path: "/signup", Component: Signup },
  { path: "/admin", Component: AdminDashboard },
]);
