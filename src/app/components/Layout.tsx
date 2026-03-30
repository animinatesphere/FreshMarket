import { Link, Outlet, useLocation } from "react-router";
import {
  ShoppingCart,
  Leaf,
  Search,
  Menu,
  X,
  Heart,
  User,
  LogOut,
  Settings,
  Receipt,
} from "lucide-react";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import { SearchModal } from "./SearchModal";
import { Newsletter } from "./Newsletter";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export function Layout() {
  const { getTotalItems } = useCart();
  const { wishlistItems } = useWishlist();
  const { user, isAdmin, logout } = useAuth();
  const totalItems = getTotalItems();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const navigation = [
    { name: "Home", path: "/" },
    { name: "Products", path: "/products" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <Leaf className="h-8 w-8 text-orange-600" />
              <span className="text-xl font-semibold text-gray-900">
                FreshMarket
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              {navigation.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`transition-colors ${
                    isActive(item.path)
                      ? "text-orange-600"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* Right Section */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSearchModalOpen(true)}
                className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <Search className="h-5 w-5" />
              </button>

              <Link
                to="/wishlist"
                className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors hidden sm:block"
              >
                <Heart className="h-5 w-5" />
                {wishlistItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-orange-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {wishlistItems.length}
                  </span>
                )}
              </Link>

              {/* User Account Dropdown */}
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="p-2 text-gray-600 hover:text-gray-900 transition-colors hidden sm:block">
                      <User className="h-5 w-5" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <div className="px-2 py-1.5">
                      <p className="text-sm font-medium">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link
                        to="/transaction-history"
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <Receipt className="h-4 w-4" />
                        Transaction History
                      </Link>
                    </DropdownMenuItem>
                    {isAdmin && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link
                            to="/admin"
                            className="flex items-center gap-2 cursor-pointer"
                          >
                            <Settings className="h-4 w-4" />
                            Admin Panel
                          </Link>
                        </DropdownMenuItem>
                      </>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => logout()}
                      className="flex items-center gap-2 text-red-600"
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="hidden sm:flex gap-2">
                  <Link
                    to="/login"
                    className="text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium"
                  >
                    Sign In
                  </Link>
                  <span className="text-gray-300">|</span>
                  <Link
                    to="/signup"
                    className="text-orange-600 hover:text-orange-700 transition-colors text-sm font-medium"
                  >
                    Join
                  </Link>
                </div>
              )}

              <Link
                to="/cart"
                className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ShoppingCart className="h-5 w-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-orange-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Link>

              {/* Mobile menu button */}
              <button
                className="md:hidden p-2 text-gray-600 hover:text-gray-900"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t">
              <nav className="flex flex-col gap-4">
                {navigation.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`transition-colors ${
                      isActive(item.path)
                        ? "text-orange-600"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
                {!user && (
                  <>
                    <div className="border-t pt-4 mt-4 flex flex-col gap-3">
                      <Link
                        to="/login"
                        className="text-gray-600 hover:text-gray-900 transition-colors font-medium"
                      >
                        Sign In
                      </Link>
                      <Link
                        to="/signup"
                        className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors font-medium text-center"
                      >
                        Join
                      </Link>
                    </div>
                  </>
                )}
                {user && isAdmin && (
                  <>
                    <div className="border-t pt-4 mt-4 space-y-3">
                      <Link
                        to="/transaction-history"
                        className="text-gray-600 hover:text-gray-900 transition-colors font-medium flex items-center gap-2"
                      >
                        <Receipt className="h-4 w-4" />
                        Transaction History
                      </Link>
                      <Link
                        to="/admin"
                        className="text-gray-600 hover:text-gray-900 transition-colors font-medium flex items-center gap-2"
                      >
                        <Settings className="h-4 w-4" />
                        Admin Panel
                      </Link>
                    </div>
                  </>
                )}
                {user && !isAdmin && (
                  <>
                    <div className="border-t pt-4 mt-4">
                      <Link
                        to="/transaction-history"
                        className="text-gray-600 hover:text-gray-900 transition-colors font-medium flex items-center gap-2"
                      >
                        <Receipt className="h-4 w-4" />
                        Transaction History
                      </Link>
                    </div>
                  </>
                )}
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Search Modal */}
      <SearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
      />

      {/* Newsletter */}
      <Newsletter />

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Leaf className="h-6 w-6 text-orange-500" />
                <span className="text-lg">FreshMarket</span>
              </div>
              <p className="text-gray-400 text-sm">
                Your trusted source for fresh, organic, and locally-sourced food
                products.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Shop</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <Link
                    to="/products"
                    className="hover:text-white transition-colors"
                  >
                    All Products
                  </Link>
                </li>
                <li>
                  <Link
                    to="/products?category=Vegetables"
                    className="hover:text-white transition-colors"
                  >
                    Vegetables
                  </Link>
                </li>
                <li>
                  <Link
                    to="/products?category=Fruits"
                    className="hover:text-white transition-colors"
                  >
                    Fruits
                  </Link>
                </li>
                <li>
                  <Link
                    to="/products?category=Bakery"
                    className="hover:text-white transition-colors"
                  >
                    Bakery
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <Link
                    to="/about"
                    className="hover:text-white transition-colors"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    to="/contact"
                    className="hover:text-white transition-colors"
                  >
                    Contact
                  </Link>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Careers
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    FAQ
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Shipping
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Returns
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Privacy Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2026 FreshMarket. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
