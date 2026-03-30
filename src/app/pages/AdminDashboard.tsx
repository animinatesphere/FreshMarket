import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../components/ui/card";
import { useAuth } from "../context/AuthContext";
import { useTransaction } from "../context/TransactionContext";
import { formatCurrency } from "../utils/currency";
import {
  AlertCircle,
  Trash2,
  Edit,
  Plus,
  Users,
  Package,
  BarChart3,
  LogOut,
  DollarSign,
  TrendingUp,
  Eye,
  Receipt,
} from "lucide-react";
import { products as initialProducts } from "../data/products";
import { SkeletonTable } from "../components/SkeletonCard";

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  createdAt: string;
}

interface AdminProduct {
  id: number;
  title: string;
  description: string;
  price: number;
  category: string;
  image: string;
  unit: string;
  inStock: boolean;
  stockQuantity: number;
  featured: boolean;
  rating: number;
}

export function AdminDashboard() {
  const { user, isAdmin, logout } = useAuth();
  const { transactions } = useTransaction();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [products, setProducts] = useState<AdminProduct[]>(
    initialProducts.map((p) => ({
      id: parseInt(p.id),
      title: p.name,
      description: p.description,
      price: p.price,
      category: p.category,
      image: p.image,
      unit: p.unit,
      inStock: p.inStock,
      stockQuantity: p.stockQuantity || 0,
      featured: p.featured || false,
      rating: p.rating || 0,
    })),
  );
  const [newProduct, setNewProduct] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    image: "",
    unit: "",
    inStock: true,
    stockQuantity: "",
    featured: false,
    rating: "",
  });
  const [editingProduct, setEditingProduct] = useState<number | null>(null);

  // Redirect if not admin
  useEffect(() => {
    if (!isAdmin) {
      navigate("/");
    }
  }, [isAdmin, navigate]);

  // Simulate loading on mount
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 700);
    return () => clearTimeout(timer);
  }, []);

  // Load users from localStorage
  useEffect(() => {
    try {
      const storedUsers = localStorage.getItem("freshmarket_users") || "[]";
      const parsedUsers: AdminUser[] = JSON.parse(storedUsers).map(
        (u: any) => ({
          id: u.id,
          name: u.name,
          email: u.email,
          role: u.role,
          createdAt: u.createdAt,
        }),
      );
      setUsers(parsedUsers);
    } catch (err) {
      console.error("Failed to load users:", err);
    }
  }, []);

  const handleAddProduct = () => {
    if (
      newProduct.title &&
      newProduct.description &&
      newProduct.price &&
      newProduct.category &&
      newProduct.image &&
      newProduct.unit &&
      newProduct.stockQuantity
    ) {
      const product: AdminProduct = {
        id: Math.max(...products.map((p) => p.id), 0) + 1,
        title: newProduct.title,
        description: newProduct.description,
        price: parseFloat(newProduct.price),
        category: newProduct.category,
        image: newProduct.image,
        unit: newProduct.unit,
        inStock: newProduct.inStock,
        stockQuantity: parseInt(newProduct.stockQuantity),
        featured: newProduct.featured,
        rating: newProduct.rating ? parseFloat(newProduct.rating) : 0,
      };
      setProducts([...products, product]);
      setNewProduct({
        title: "",
        description: "",
        price: "",
        category: "",
        image: "",
        unit: "",
        inStock: true,
        stockQuantity: "",
        featured: false,
        rating: "",
      });
    }
  };

  const handleDeleteProduct = (id: number) => {
    setProducts(products.filter((p) => p.id !== id));
  };

  const handleDeleteUser = (id: string) => {
    setUsers(users.filter((u) => u.id !== id));
  };

  const stats = [
    {
      label: "Total Users",
      value: users.length,
      icon: Users,
      bgColor: "bg-blue-100",
      textColor: "text-blue-600",
    },
    {
      label: "Total Products",
      value: products.length,
      icon: Package,
      bgColor: "bg-green-100",
      textColor: "text-green-600",
    },
    {
      label: "Total Revenue",
      value: `₦${(products.reduce((sum, p) => sum + p.price, 0) * 1.2).toLocaleString()}`,
      icon: DollarSign,
      bgColor: "bg-purple-100",
      textColor: "text-purple-600",
    },
    {
      label: "Growth Rate",
      value: "+12.5%",
      icon: TrendingUp,
      bgColor: "bg-orange-100",
      textColor: "text-orange-600",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-orange-600 to-orange-700 p-2 rounded-lg">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Admin Dashboard
                </h1>
                <p className="text-sm text-gray-600">
                  Welcome, {user?.name || "Admin"}
                </p>
              </div>
            </div>
            <Button
              onClick={() => {
                logout();
                navigate("/");
              }}
              className="bg-red-600 hover:bg-red-700 text-white gap-2"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <Card
                key={idx}
                className="hover:shadow-lg transition-shadow border-0"
              >
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 font-medium">
                        {stat.label}
                      </p>
                      <p className="text-3xl font-bold text-gray-900 mt-2">
                        {stat.value}
                      </p>
                    </div>
                    <div className={`${stat.bgColor} p-3 rounded-lg`}>
                      <Icon className={`h-6 w-6 ${stat.textColor}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Tabs */}
        <Tabs defaultValue="products" className="space-y-6">
          <TabsList className="grid w-full max-w-2xl grid-cols-3 bg-white border border-gray-200 p-1">
            <TabsTrigger value="products" className="gap-2">
              <Package className="h-4 w-4" />
              Products
            </TabsTrigger>
            <TabsTrigger value="users" className="gap-2">
              <Users className="h-4 w-4" />
              Users
            </TabsTrigger>
            <TabsTrigger value="transactions" className="gap-2">
              <Receipt className="h-4 w-4" />
              Transactions
            </TabsTrigger>
          </TabsList>

          {/* Products Tab */}
          <TabsContent value="products">
            <Card className="border-0 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Product Management</CardTitle>
                    <CardDescription>
                      Add, edit, or remove products from your catalog
                    </CardDescription>
                  </div>
                  <Package className="h-8 w-8 text-orange-600" />
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                {/* Add Product Form */}
                <div className="mb-8 p-6 bg-gradient-to-br from-orange-50 to-amber-50 rounded-lg border border-orange-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                    <Plus className="h-5 w-5 text-orange-600" />
                    Add New Product
                  </h3>

                  {/* Required Fields Section */}
                  <div className="mb-6">
                    <p className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-1">
                      📋 Basic Information{" "}
                      <span className="text-red-600">*</span>
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        placeholder="Product Title (e.g., Organic Tomatoes)"
                        value={newProduct.title}
                        onChange={(e) =>
                          setNewProduct({
                            ...newProduct,
                            title: e.target.value,
                          })
                        }
                        className="border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                      />
                      <Input
                        placeholder="Price (e.g., 5000)"
                        type="number"
                        value={newProduct.price}
                        onChange={(e) =>
                          setNewProduct({
                            ...newProduct,
                            price: e.target.value,
                          })
                        }
                        className="border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                      />
                      <Input
                        placeholder="Category (e.g., Vegetables, Fruits, Bakery)"
                        value={newProduct.category}
                        onChange={(e) =>
                          setNewProduct({
                            ...newProduct,
                            category: e.target.value,
                          })
                        }
                        className="border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                      />
                      <Input
                        placeholder="Unit (e.g., per box, per kg, per loaf)"
                        value={newProduct.unit}
                        onChange={(e) =>
                          setNewProduct({
                            ...newProduct,
                            unit: e.target.value,
                          })
                        }
                        className="border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <div className="mb-6">
                    <p className="text-sm font-bold text-gray-700 mb-2 flex items-center gap-1">
                      📝 Description <span className="text-red-600">*</span>
                    </p>
                    <textarea
                      placeholder="Describe your product (what it is, qualities, origin, etc.)"
                      value={newProduct.description}
                      onChange={(e) =>
                        setNewProduct({
                          ...newProduct,
                          description: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 font-medium text-gray-900 min-h-24"
                    />
                  </div>

                  {/* Stock & Availability */}
                  <div className="mb-6">
                    <p className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-1">
                      📦 Stock Information{" "}
                      <span className="text-red-600">*</span>
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        placeholder="Stock Quantity (e.g., 45)"
                        type="number"
                        value={newProduct.stockQuantity}
                        onChange={(e) =>
                          setNewProduct({
                            ...newProduct,
                            stockQuantity: e.target.value,
                          })
                        }
                        className="border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                      />
                      <div className="flex items-center gap-3 bg-white p-3 rounded-lg border-2 border-gray-300">
                        <input
                          type="checkbox"
                          id="inStock"
                          checked={newProduct.inStock}
                          onChange={(e) =>
                            setNewProduct({
                              ...newProduct,
                              inStock: e.target.checked,
                            })
                          }
                          className="w-5 h-5 cursor-pointer accent-orange-600"
                        />
                        <label
                          htmlFor="inStock"
                          className="font-medium text-gray-900 cursor-pointer flex-1"
                        >
                          ✓ In Stock
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Image & Additional */}
                  <div className="mb-6">
                    <p className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-1">
                      🖼️ Display & Rating{" "}
                      <span className="text-red-600">*</span>
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        placeholder="Image URL (paste a web image link)"
                        value={newProduct.image}
                        onChange={(e) =>
                          setNewProduct({
                            ...newProduct,
                            image: e.target.value,
                          })
                        }
                        className="border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                      />
                      <Input
                        placeholder="Rating (0-5, optional)"
                        type="number"
                        min="0"
                        max="5"
                        step="0.1"
                        value={newProduct.rating}
                        onChange={(e) =>
                          setNewProduct({
                            ...newProduct,
                            rating: e.target.value,
                          })
                        }
                        className="border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                      />
                    </div>
                  </div>

                  {/* Featured Checkbox */}
                  <div className="mb-6 flex items-center gap-3 bg-white p-4 rounded-lg border-2 border-amber-200">
                    <input
                      type="checkbox"
                      id="featured"
                      checked={newProduct.featured}
                      onChange={(e) =>
                        setNewProduct({
                          ...newProduct,
                          featured: e.target.checked,
                        })
                      }
                      className="w-5 h-5 cursor-pointer accent-orange-600"
                    />
                    <label
                      htmlFor="featured"
                      className="font-semibold text-gray-900 cursor-pointer flex-1"
                    >
                      ⭐ Mark as Featured Product
                    </label>
                    <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded font-bold">
                      Featured products appear highlighted
                    </span>
                  </div>

                  <Button
                    onClick={handleAddProduct}
                    className="w-full bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white font-bold py-3 shadow-lg hover:shadow-xl transition-all gap-2"
                  >
                    <Plus className="h-5 w-5" />
                    Add Product to Catalog
                  </Button>
                </div>

                {/* Products List */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <Package className="h-5 w-5 text-orange-600" />
                    Products List ({products.length})
                  </h3>
                  {isLoading ? (
                    <SkeletonTable />
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">
                              Product
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">
                              Category
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">
                              Price / Unit
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">
                              Stock
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">
                              Rating
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">
                              Status
                            </th>
                            <th className="px-4 py-3 text-center text-xs font-bold text-gray-900 uppercase tracking-wider">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {products.map((product) => (
                            <tr
                              key={product.id}
                              className="hover:bg-gray-50 transition-colors"
                            >
                              <td className="px-4 py-4">
                                <div className="flex items-center gap-3">
                                  <img
                                    src={product.image}
                                    alt={product.title}
                                    className="h-12 w-12 rounded-lg object-cover shadow-md"
                                  />
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-gray-900 truncate">
                                      {product.title}
                                    </p>
                                    <p className="text-xs text-gray-600 truncate max-w-xs">
                                      {product.description.substring(0, 40)}...
                                    </p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-4 py-4">
                                <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700">
                                  {product.category}
                                </span>
                              </td>
                              <td className="px-4 py-4">
                                <div className="text-sm font-semibold text-gray-900">
                                  ₦{product.price.toLocaleString()}
                                </div>
                                <div className="text-xs text-gray-600 font-medium">
                                  {product.unit}
                                </div>
                              </td>
                              <td className="px-4 py-4">
                                <div className="text-sm font-bold text-gray-900">
                                  {product.stockQuantity}
                                </div>
                                <div className="text-xs text-gray-600">
                                  {product.inStock ? (
                                    <span className="text-green-600 font-bold">
                                      Available
                                    </span>
                                  ) : (
                                    <span className="text-red-600 font-bold">
                                      Out of Stock
                                    </span>
                                  )}
                                </div>
                              </td>
                              <td className="px-4 py-4">
                                <div className="text-sm font-bold text-yellow-600 flex items-center gap-1">
                                  {product.rating > 0 ? (
                                    <>⭐ {product.rating.toFixed(1)}</>
                                  ) : (
                                    <span className="text-gray-500">—</span>
                                  )}
                                </div>
                              </td>
                              <td className="px-4 py-4">
                                {product.featured ? (
                                  <span className="inline-flex items-center rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-700">
                                    ⭐ Featured
                                  </span>
                                ) : (
                                  <span className="text-xs text-gray-500">
                                    Regular
                                  </span>
                                )}
                              </td>
                              <td className="px-4 py-4 text-center">
                                <button
                                  onClick={() =>
                                    handleDeleteProduct(product.id)
                                  }
                                  className="inline-flex items-center justify-center h-9 w-9 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
                                  title="Delete product"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users">
            <Card className="border-0 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>User Management</CardTitle>
                    <CardDescription>
                      View and manage registered users
                    </CardDescription>
                  </div>
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                {isLoading ? (
                  <SkeletonTable />
                ) : users.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <AlertCircle className="h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-gray-600 font-medium">No users yet</p>
                    <p className="text-gray-500 text-sm">
                      Users will appear here once they sign up
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                            Name
                          </th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                            Email
                          </th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                            Role
                          </th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                            Joined
                          </th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {users.map((user) => (
                          <tr
                            key={user.id}
                            className="hover:bg-gray-50 transition-colors"
                          >
                            <td className="px-6 py-4">
                              <span className="text-sm font-medium text-gray-900">
                                {user.name}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <span className="text-sm text-gray-600">
                                {user.email}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <span
                                className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                                  user.role === "admin"
                                    ? "bg-purple-100 text-purple-700"
                                    : "bg-green-100 text-green-700"
                                }`}
                              >
                                {user.role.charAt(0).toUpperCase() +
                                  user.role.slice(1)}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <span className="text-sm text-gray-600">
                                {new Date(user.createdAt).toLocaleDateString()}
                              </span>
                            </td>
                            <td className="px-6 py-4 space-x-2 flex">
                              <button className="inline-flex items-center justify-center h-9 w-9 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors">
                                <Eye className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteUser(user.id)}
                                className="inline-flex items-center justify-center h-9 w-9 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Transactions Tab */}
          <TabsContent value="transactions">
            <Card className="border-0 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Transaction History</CardTitle>
                    <CardDescription>
                      View all orders and payment transactions
                    </CardDescription>
                  </div>
                  <Receipt className="h-8 w-8 text-green-600" />
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                {isLoading ? (
                  <SkeletonTable />
                ) : transactions.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <AlertCircle className="h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-gray-600 font-medium">
                      No transactions yet
                    </p>
                    <p className="text-gray-500 text-sm">
                      Transactions will appear here once customers make
                      purchases
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Transaction Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-lg border-2 border-green-200">
                        <p className="text-sm font-bold text-gray-600 mb-2">
                          Total Orders
                        </p>
                        <p className="text-3xl font-bold text-green-600">
                          {transactions.length}
                        </p>
                      </div>
                      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-lg border-2 border-blue-200">
                        <p className="text-sm font-bold text-gray-600 mb-2">
                          Completed Orders
                        </p>
                        <p className="text-3xl font-bold text-blue-600">
                          {
                            transactions.filter((t) => t.status === "completed")
                              .length
                          }
                        </p>
                      </div>
                      <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-lg border-2 border-purple-200">
                        <p className="text-sm font-bold text-gray-600 mb-2">
                          Total Revenue
                        </p>
                        <p className="text-3xl font-bold text-purple-600">
                          {formatCurrency(
                            transactions.reduce((sum, t) => sum + t.total, 0),
                          )}
                        </p>
                      </div>
                    </div>

                    {/* Transactions Table */}
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">
                              Order ID
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">
                              Customer
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">
                              Date
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">
                              Items
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">
                              Amount
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">
                              Payment
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">
                              Status
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {transactions.map((transaction) => (
                            <tr
                              key={transaction.id}
                              className="hover:bg-gray-50 transition-colors"
                            >
                              <td className="px-4 py-4">
                                <span className="text-sm font-bold text-gray-900">
                                  {transaction.orderId}
                                </span>
                              </td>
                              <td className="px-4 py-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {transaction.customerName || "Guest"}
                                </div>
                                <div className="text-xs text-gray-600">
                                  {transaction.customerEmail || "—"}
                                </div>
                              </td>
                              <td className="px-4 py-4">
                                <div className="text-sm text-gray-900 font-medium">
                                  {new Date(
                                    transaction.date,
                                  ).toLocaleDateString()}
                                </div>
                                <div className="text-xs text-gray-600">
                                  {new Date(
                                    transaction.date,
                                  ).toLocaleTimeString()}
                                </div>
                              </td>
                              <td className="px-4 py-4">
                                <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700">
                                  {transaction.items.length} item
                                  {transaction.items.length !== 1 ? "s" : ""}
                                </span>
                              </td>
                              <td className="px-4 py-4">
                                <span className="text-sm font-bold text-gray-900">
                                  {formatCurrency(transaction.total)}
                                </span>
                              </td>
                              <td className="px-4 py-4">
                                <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                                  {transaction.paymentMethod === "credit"
                                    ? "💳 Card"
                                    : transaction.paymentMethod === "debit"
                                      ? "🏦 Debit"
                                      : "🔵 PayPal"}
                                </span>
                              </td>
                              <td className="px-4 py-4">
                                <span
                                  className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ${
                                    transaction.status === "completed"
                                      ? "bg-green-100 text-green-700"
                                      : transaction.status === "pending"
                                        ? "bg-amber-100 text-amber-700"
                                        : "bg-red-100 text-red-700"
                                  }`}
                                >
                                  {transaction.status === "completed" && "✓"}
                                  {transaction.status === "pending" && "⏳"}
                                  {transaction.status === "failed" && "✕"}{" "}
                                  {transaction.status.charAt(0).toUpperCase() +
                                    transaction.status.slice(1)}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
