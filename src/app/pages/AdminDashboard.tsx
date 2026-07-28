import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { api, ApiError } from "../lib/api";
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
import { useTransaction, Transaction } from "../context/TransactionContext";
import { formatCurrency } from "../utils/currency";
import { categories } from "../data/products";
import {
  Trash2,
  Users,
  Package,
  BarChart3,
  LogOut,
  DollarSign,
  Eye,
  Receipt,
  Loader2,
  Upload,
  CheckCircle,
  Clock,
  MapPin,
  Phone,
  X,
  CreditCard,
} from "lucide-react";
import { SkeletonTable } from "../components/SkeletonCard";

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  createdAt: string;
}

interface AdminProduct {
  id: string;
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
  const { transactions: allTransactions, updateTransactionStatus } = useTransaction();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const [users, setUsers] = useState<AdminUser[]>([]);
  const [products, setProducts] = useState<AdminProduct[]>([]);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Detail/Edit View State
  const [selectedProduct, setSelectedProduct] = useState<AdminProduct | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Transaction | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const [newProduct, setNewProduct] = useState({
    title: "",
    description: "",
    price: "",
    category: categories[1],
    image: "",
    unit: "",
    inStock: true,
    stockQuantity: "",
    featured: false,
    rating: "",
  });

  // Redirect if not admin
  useEffect(() => {
    if (!isAdmin) {
      navigate("/");
    }
  }, [isAdmin, navigate]);

  const fetchProducts = async () => {
    try {
      const data = await api.get<any[]>("/products");
      setProducts(
        data.map((p) => ({
          id: p.id,
          title: p.name,
          description: p.description,
          price: p.price,
          category: p.category,
          image: p.image,
          unit: p.unit,
          inStock: p.inStock,
          stockQuantity: p.stockQuantity,
          featured: p.featured,
          rating: p.rating,
        }))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const fetchUsers = async () => {
    try {
      const data = await api.get<AdminUser[]>("/admin/users");
      setUsers(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const loadAll = async () => {
      setIsLoading(true);
      await Promise.all([fetchProducts(), fetchUsers()]);
      setIsLoading(false);
    };
    loadAll();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    const formData = new FormData();
    formData.append("image", file);
    try {
      const { url } = await api.upload<{ url: string }>("/upload", formData);
      return url;
    } catch {
      return null;
    }
  };

  const handleAddProduct = async () => {
    if (!newProduct.title || !newProduct.price || (!newProduct.image && !imageFile)) {
      alert("Please provide a name, price, and image!");
      return;
    }
    setIsSubmitting(true);
    let finalImageUrl = newProduct.image;
    try {
      if (imageFile) {
        setIsUploading(true);
        const uploadedUrl = await uploadImage(imageFile);
        if (!uploadedUrl) throw new Error("Upload failed");
        finalImageUrl = uploadedUrl;
      }
      await api.post("/products", {
        name: newProduct.title,
        description: newProduct.description,
        price: parseFloat(newProduct.price),
        category: newProduct.category,
        image: finalImageUrl,
        unit: newProduct.unit,
        inStock: newProduct.inStock,
        stockQuantity: parseInt(newProduct.stockQuantity) || 0,
        featured: newProduct.featured,
        rating: newProduct.rating ? parseFloat(newProduct.rating) : 0,
      });
      await fetchProducts();
      setNewProduct({ title: "", description: "", price: "", category: categories[1], image: "", unit: "", inStock: true, stockQuantity: "", featured: false, rating: "" });
      setImageFile(null);
      setImagePreview(null);
    } catch (err) {
      alert(err instanceof ApiError ? err.message : "Failed to add product");
    } finally {
      setIsSubmitting(false);
      setIsUploading(false);
    }
  };

  const handleUpdateProduct = async () => {
    if (!selectedProduct) return;
    setIsSubmitting(true);
    try {
      await api.put(`/products/${selectedProduct.id}`, {
        name: selectedProduct.title,
        description: selectedProduct.description,
        price: selectedProduct.price,
        category: selectedProduct.category,
        unit: selectedProduct.unit,
        inStock: selectedProduct.inStock,
        stockQuantity: selectedProduct.stockQuantity,
        featured: selectedProduct.featured,
      });
      await fetchProducts();
      setSelectedProduct(null);
      setIsEditMode(false);
    } catch (err) {
      alert(err instanceof ApiError ? err.message : "Failed to update product");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateOrderStatus = async (id: string, newStatus: Transaction["status"]) => {
    setIsSubmitting(true);
    try {
      await updateTransactionStatus(id, newStatus);
      if (selectedOrder && selectedOrder.id === id) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    await api.delete(`/products/${id}`);
    setProducts(products.filter((p) => p.id !== id));
  };

  const handleDeleteUser = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    await api.delete(`/admin/users/${id}`);
    setUsers(users.filter((u) => u.id !== id));
  };

  const stats = [
    { label: "Orders", value: allTransactions.length, icon: Receipt, bg: "bg-secondary", text: "text-primary" },
    { label: "Revenue", value: formatCurrency(allTransactions.reduce((sum, t) => sum + t.total, 0)), icon: DollarSign, bg: "bg-accent/10", text: "text-accent" },
    { label: "Products", value: products.length, icon: Package, bg: "bg-secondary", text: "text-primary" },
    { label: "Customers", value: users.length, icon: Users, bg: "bg-muted", text: "text-foreground/70" },
  ];

  return (
    <div className="min-h-screen bg-muted/30 flex flex-col">
      {/* Navbar */}
      <header className="bg-card border-b border-border h-16 flex items-center shrink-0 px-8 justify-between sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg">
            <BarChart3 className="text-primary-foreground w-6 h-6" />
          </div>
          <h1 className="text-xl font-serif tracking-tight">FRESHMARKET <span className="text-accent">ADMIN</span></h1>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <div className="text-right mr-2 hidden sm:block">
            <p className="font-bold leading-none">{user?.name}</p>
            <p className="text-muted-foreground text-xs text-right">Super Administrator</p>
          </div>
          <Button onClick={() => { logout(); navigate("/"); }} variant="ghost" className="text-destructive hover:bg-destructive/10 font-bold">
            <LogOut className="w-4 h-4 mr-2" /> Sign Out
          </Button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Dashboard Stats */}
          <section className="grid grid-cols-1 md:grid-cols-4 gap-6 text-left">
            {stats.map((stat, i) => (
              <Card key={i} className="border-0 shadow-sm overflow-hidden group">
                <CardContent className="p-6 relative">
                  <div className="space-y-1 relative z-10">
                    <p className="text-xs font-black text-muted-foreground uppercase tracking-widest">{stat.label}</p>
                    <p className="text-3xl font-bold">{stat.value}</p>
                  </div>
                  <div className={`absolute top-4 right-4 p-3 rounded-2xl ${stat.bg} transition-transform group-hover:scale-110`}>
                    <stat.icon className={`w-6 h-6 ${stat.text}`} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </section>

          <Tabs defaultValue="products" className="space-y-6">
            <TabsList className="bg-card p-1 border border-border shadow-sm w-fit rounded-xl">
              <TabsTrigger value="products" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Products</TabsTrigger>
              <TabsTrigger value="transactions" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Live Orders</TabsTrigger>
              <TabsTrigger value="users" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">User Base</TabsTrigger>
            </TabsList>

            <TabsContent value="products">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-left">
                {/* Add Product Form */}
                <Card className="border-0 shadow-sm h-fit">
                  <CardHeader>
                    <CardTitle>Inventory Entry</CardTitle>
                    <CardDescription>Add fresh stock to your digital market.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-muted-foreground uppercase">Product Name</label>
                      <Input placeholder="e.g. Red Apples" value={newProduct.title} onChange={(e) => setNewProduct({ ...newProduct, title: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-muted-foreground uppercase">Category</label>
                      <select
                        className="w-full h-10 px-3 bg-input-background border border-border rounded-md font-bold text-sm focus:ring-2 focus:ring-ring outline-none"
                        value={newProduct.category}
                        onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                      >
                        {categories.filter((c) => c !== "All").map((c) => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-muted-foreground uppercase">Price (₦)</label>
                        <Input type="number" value={newProduct.price} onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-muted-foreground uppercase">Unit</label>
                        <Input placeholder="per kg" value={newProduct.unit} onChange={(e) => setNewProduct({ ...newProduct, unit: e.target.value })} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-muted-foreground uppercase">Description</label>
                      <textarea
                        className="w-full text-sm p-3 border border-border rounded-md h-24 bg-input-background focus:ring-2 focus:ring-ring outline-none"
                        value={newProduct.description}
                        onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                      />
                    </div>

                    {/* Image Upload Area */}
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-muted-foreground uppercase block">Visual Identity</label>
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className="border-2 border-dashed border-border rounded-xl p-4 flex flex-col items-center justify-center min-h-[140px] cursor-pointer hover:bg-secondary/50 transition-colors group relative overflow-hidden"
                      >
                        {imagePreview ? (
                          <img src={imagePreview} className="absolute inset-0 w-full h-full object-cover" alt="Preview" />
                        ) : (
                          <>
                            <Upload className="w-8 h-8 text-muted-foreground/40 group-hover:text-accent mb-2" />
                            <p className="text-xs font-bold text-muted-foreground group-hover:text-accent">Click to Upload</p>
                          </>
                        )}
                        <input type="file" ref={fileInputRef} className="hidden" onChange={handleImageChange} />
                      </div>
                    </div>

                    <Button onClick={handleAddProduct} disabled={isSubmitting || isUploading} className="w-full font-bold h-12 rounded-xl">
                      {isSubmitting ? <Loader2 className="animate-spin" /> : "PUBLISH TO MARKET"}
                    </Button>
                  </CardContent>
                </Card>

                {/* Inventory Table */}
                <Card className="lg:col-span-2 border-0 shadow-sm overflow-hidden">
                  <CardHeader className="flex flex-row justify-between items-center bg-card">
                    <CardTitle>Market Inventory</CardTitle>
                    <Button variant="outline" size="sm" onClick={fetchProducts}>Refresh Data</Button>
                  </CardHeader>
                  <CardContent className="p-0">
                    {isLoading ? <SkeletonTable /> : (
                      <table className="w-full text-left">
                        <thead className="bg-muted/40 border-y border-border">
                          <tr className="text-[10px] font-black text-muted-foreground p-4">
                            <th className="p-4 uppercase">Product Details</th>
                            <th className="p-4 uppercase">Category</th>
                            <th className="p-4 uppercase text-right">Pricing</th>
                            <th className="p-4 uppercase text-center">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                          {products.map((p) => (
                            <tr key={p.id} className="hover:bg-muted/20 group">
                              <td className="p-4">
                                <div className="flex items-center gap-4">
                                  <img src={p.image} className="w-12 h-12 rounded-lg object-cover bg-muted" alt="" />
                                  <div>
                                    <p className="font-bold leading-tight">{p.title}</p>
                                    <p className="text-xs text-muted-foreground mt-1">{p.stockQuantity} in stock</p>
                                  </div>
                                </div>
                              </td>
                              <td className="p-4">
                                <span className="px-3 py-1 bg-secondary text-secondary-foreground text-[10px] font-black rounded-full uppercase tracking-tighter">{p.category}</span>
                              </td>
                              <td className="p-4 text-right">
                                <p className="font-bold">{formatCurrency(p.price)}</p>
                                <p className="text-[10px] text-muted-foreground font-bold uppercase">{p.unit}</p>
                              </td>
                              <td className="p-4 text-center">
                                <div className="flex items-center justify-center gap-2">
                                  <Button onClick={() => { setSelectedProduct(p); setIsEditMode(false); }} variant="secondary" size="icon" className="h-8 w-8 hover:bg-accent/20 hover:text-accent">
                                    <Eye className="w-4 h-4" />
                                  </Button>
                                  <Button onClick={() => handleDeleteProduct(p.id)} variant="ghost" size="icon" className="h-8 w-8 text-destructive/70 hover:text-destructive">
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="transactions">
              <Card className="border-0 shadow-sm overflow-hidden text-left">
                <CardHeader className="bg-card border-b border-border flex flex-row justify-between items-center">
                  <div>
                    <CardTitle>Live Sales Stream</CardTitle>
                    <CardDescription>Tracking orders and delivery locations.</CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  {isLoading ? <SkeletonTable /> : (
                    <table className="w-full text-left">
                      <thead className="bg-muted/40">
                        <tr className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                          <th className="p-4">Order & Time</th>
                          <th className="p-4">Customer</th>
                          <th className="p-4">Delivery Info</th>
                          <th className="p-4 text-right">Total</th>
                          <th className="p-4 text-center">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {allTransactions.map((t) => (
                          <tr key={t.id} className="hover:bg-muted/20 group cursor-pointer" onClick={() => setSelectedOrder(t)}>
                            <td className="p-4">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
                                  <Receipt className="w-4 h-4 text-primary" />
                                </div>
                                <div>
                                  <p className="font-black text-sm">{t.orderId}</p>
                                  <p className="text-[10px] text-muted-foreground font-bold flex items-center gap-1">
                                    <Clock className="w-3 h-3" /> {new Date(t.date).toLocaleTimeString()}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="p-4">
                              <p className="font-bold text-sm">{t.customerName}</p>
                              <div className="flex items-center gap-1 text-accent text-[10px] font-bold">
                                <Phone className="w-2.5 h-2.5" /> {t.phone || "No phone"}
                              </div>
                            </td>
                            <td className="p-4 max-w-[200px]">
                              <div className="flex items-start gap-2">
                                <MapPin className="w-3 h-3 text-destructive/70 mt-1 shrink-0" />
                                <p className="text-xs font-bold text-foreground/70 line-clamp-2 leading-relaxed">{t.address || "No address provided"}</p>
                              </div>
                            </td>
                            <td className="p-4 text-right font-black">{formatCurrency(t.total)}</td>
                            <td className="p-4 text-center">
                              <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                t.status === "completed" ? "bg-primary/10 text-primary" : "bg-accent/15 text-accent"
                              }`}>
                                {t.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="users">
              <Card className="border-0 shadow-sm overflow-hidden text-left">
                <CardHeader className="bg-card border-b border-border">
                  <CardTitle>User Authentication Directory</CardTitle>
                  <CardDescription>Review all registered profiles.</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <table className="w-full">
                    <thead className="bg-muted/40 border-b border-border">
                      <tr className="text-[10px] font-black text-muted-foreground uppercase">
                        <th className="p-4">User Identity</th>
                        <th className="p-4">Role</th>
                        <th className="p-4 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {users.map((u) => (
                        <tr key={u.id} className="hover:bg-muted/20">
                          <td className="p-4 font-bold">
                            {u.name} <span className="block text-xs font-medium text-muted-foreground">{u.email}</span>
                          </td>
                          <td className="p-4">
                            <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter ${
                              u.role === "admin" ? "bg-accent/15 text-accent" : "bg-secondary text-secondary-foreground"
                            }`}>{u.role}</span>
                          </td>
                          <td className="p-4 text-center">
                            <Button onClick={() => handleDeleteUser(u.id)} variant="ghost" size="icon" className="text-muted-foreground/50 hover:text-destructive">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Order Details Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 bg-foreground/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <Card className="w-full max-w-2xl border-0 shadow-2xl rounded-2xl overflow-hidden animate-in fade-in zoom-in duration-200 text-left">
              <div className="bg-primary px-8 py-6 text-primary-foreground flex justify-between items-center">
                <div>
                  <h3 className="text-2xl">{selectedOrder.orderId} Intelligence</h3>
                  <p className="text-primary-foreground/70 text-xs font-bold uppercase mt-1 tracking-widest">Order Status: {selectedOrder.status}</p>
                </div>
                <button onClick={() => setSelectedOrder(null)} className="p-2 bg-primary-foreground/10 rounded-full hover:bg-primary-foreground/20 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <CardContent className="p-8 space-y-8 bg-card max-h-[70vh] overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Customer Protocol</h4>
                    <div className="space-y-2">
                      <p className="text-xl font-bold">{selectedOrder.customerName}</p>
                      <p className="text-sm font-bold text-accent">{selectedOrder.customerEmail}</p>
                      <p className="text-sm font-bold text-foreground/70 flex items-center gap-2">
                        <Phone className="w-4 h-4 text-accent" /> {selectedOrder.phone}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Delivery Coordinates</h4>
                    <div className="p-4 bg-muted/30 border border-border rounded-xl flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-destructive/70 mt-1 shrink-0" />
                      <p className="text-sm font-bold text-foreground/80 leading-relaxed italic">{selectedOrder.address || "No address provided"}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Package Contents</h4>
                  <div className="space-y-3">
                    {selectedOrder.items.map((item, i) => (
                      <div key={i} className="flex items-center justify-between p-4 bg-muted/30 rounded-xl border border-border">
                        <div className="flex items-center gap-4">
                          <img src={item.image} className="w-12 h-12 rounded-lg object-cover shadow-sm" alt="" />
                          <div>
                            <p className="font-black text-sm">{item.name}</p>
                            <p className="text-[10px] text-muted-foreground font-black uppercase">{item.quantity} x {formatCurrency(item.price)}</p>
                          </div>
                        </div>
                        <p className="font-black">{formatCurrency(item.price * item.quantity)}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-[#14201a] rounded-2xl p-6 text-[#f3ede1] space-y-3">
                  <div className="flex justify-between text-[#f3ede1]/60 text-xs font-bold uppercase tracking-widest">
                    <span>Order Weight</span>
                    <span>{selectedOrder.subtotal > 0 ? "Standard" : "N/A"}</span>
                  </div>
                  <div className="flex justify-between text-[#f3ede1]/60 text-xs font-bold uppercase tracking-widest border-b border-[#f3ede1]/10 pb-3">
                    <span>Shipping Protocol</span>
                    <span>{selectedOrder.shipping === 0 ? "FREE" : formatCurrency(selectedOrder.shipping)}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-lg font-black uppercase tracking-tighter">Total Captured</span>
                    <span className="text-3xl font-black text-[#e08a4f]">{formatCurrency(selectedOrder.total)}</span>
                  </div>
                  <div className="pt-2 flex items-center gap-2 text-[10px] font-black text-[#f3ede1]/50 uppercase tracking-widest">
                    <CreditCard className="w-4 h-4" /> Paid via {selectedOrder.paymentMethod}
                  </div>
                </div>
              </CardContent>

              <CardHeader className="bg-muted/40 border-t border-border p-6 flex flex-row gap-4">
                {selectedOrder.status === "pending" ? (
                  <Button onClick={() => handleUpdateOrderStatus(selectedOrder.id, "completed")} disabled={isSubmitting} className="flex-1 h-14 font-black rounded-xl shadow-lg">
                    {isSubmitting ? <Loader2 className="animate-spin" /> : <><CheckCircle className="w-5 h-5 mr-2" /> MARK AS SHIPPED</>}
                  </Button>
                ) : (
                  <div className="flex-1 text-center py-4 bg-muted rounded-xl text-muted-foreground font-bold uppercase text-xs tracking-widest flex items-center justify-center gap-2">
                    <CheckCircle className="w-4 h-4 text-primary" /> ORDER DISPATCHED & COMPLETED
                  </div>
                )}
                <Button onClick={() => setSelectedOrder(null)} variant="outline" className="flex-1 h-14 font-black rounded-xl">DISMISS DETAILS</Button>
              </CardHeader>
            </Card>
          </div>
        )}

        {/* Product Detail/Edit Modal */}
        {selectedProduct && (
          <div className="fixed inset-0 bg-foreground/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <Card className="w-full max-w-2xl border-0 shadow-2xl rounded-2xl overflow-hidden animate-in fade-in zoom-in duration-200 text-left">
              <div className="bg-[#14201a] px-8 py-6 text-[#f3ede1] flex justify-between items-center">
                <div>
                  <h3 className="text-2xl tracking-tight">{isEditMode ? "Manage Listing" : "Listing Intelligence"}</h3>
                  <p className="text-[#f3ede1]/50 text-xs font-bold uppercase tracking-widest mt-1">PRODUCT ID: {selectedProduct.id.slice(0, 8)}</p>
                </div>
                <button onClick={() => { setSelectedProduct(null); setIsEditMode(false); }} className="bg-[#f3ede1]/10 p-2 rounded-full hover:bg-destructive transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <CardContent className="p-8 space-y-8 bg-card max-h-[70vh] overflow-y-auto">
                {isEditMode ? (
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-muted-foreground uppercase">Product Name</label>
                        <Input value={selectedProduct.title} onChange={(e) => setSelectedProduct({ ...selectedProduct, title: e.target.value })} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-muted-foreground uppercase">Category</label>
                        <select className="w-full h-10 border border-border rounded px-3 font-bold text-sm bg-input-background" value={selectedProduct.category} onChange={(e) => setSelectedProduct({ ...selectedProduct, category: e.target.value })}>
                          {categories.filter((c) => c !== "All").map((c) => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-muted-foreground uppercase">Price (₦)</label>
                        <Input type="number" value={selectedProduct.price} onChange={(e) => setSelectedProduct({ ...selectedProduct, price: parseFloat(e.target.value) })} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-muted-foreground uppercase">Stock Quantity</label>
                        <Input type="number" value={selectedProduct.stockQuantity} onChange={(e) => setSelectedProduct({ ...selectedProduct, stockQuantity: parseInt(e.target.value) })} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-muted-foreground uppercase">Description</label>
                      <textarea className="w-full p-4 border border-border rounded-xl text-sm italic font-medium h-32 bg-input-background" value={selectedProduct.description} onChange={(e) => setSelectedProduct({ ...selectedProduct, description: e.target.value })} />
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-6">
                      <div className="aspect-square bg-muted rounded-2xl overflow-hidden shadow-inner border border-border">
                        <img src={selectedProduct.image} className="w-full h-full object-cover" alt="" />
                      </div>
                      <div className="flex gap-4">
                        <div className="flex-1 bg-muted/30 p-4 rounded-xl border border-border text-center">
                          <p className="text-[10px] font-black text-muted-foreground uppercase mb-1">Stock</p>
                          <p className="text-xl font-black">{selectedProduct.stockQuantity} {selectedProduct.unit}</p>
                        </div>
                        <div className="flex-1 bg-muted/30 p-4 rounded-xl border border-border text-center">
                          <p className="text-[10px] font-black text-muted-foreground uppercase mb-1">Rating</p>
                          <div className="flex items-center justify-center gap-1">
                            <p className="text-xl font-black">{selectedProduct.rating}</p>
                            <CheckCircle className="w-4 h-4 text-primary" />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-6">
                      <div>
                        <p className="text-accent font-black text-xs uppercase tracking-widest">{selectedProduct.category}</p>
                        <h4 className="text-3xl mt-1">{selectedProduct.title}</h4>
                        <p className="text-2xl font-bold mt-2">{formatCurrency(selectedProduct.price)}</p>
                      </div>
                      <div className="h-px bg-border" />
                      <div>
                        <p className="text-[10px] font-black text-muted-foreground uppercase mb-3">Professional Description</p>
                        <p className="text-foreground/70 font-medium leading-relaxed italic">{selectedProduct.description}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        {selectedProduct.featured && (
                          <span className="px-3 py-1 bg-accent/15 text-accent text-[10px] font-black uppercase rounded-full">Featured Item</span>
                        )}
                        {selectedProduct.inStock ? (
                          <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-black uppercase rounded-full">Active Inventory</span>
                        ) : (
                          <span className="px-3 py-1 bg-destructive/10 text-destructive text-[10px] font-black uppercase rounded-full">Out of Stock</span>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
              <CardHeader className="bg-muted/40 border-t border-border p-6 flex flex-row gap-4">
                {isEditMode ? (
                  <>
                    <Button onClick={handleUpdateProduct} disabled={isSubmitting} className="flex-1 font-black h-12 shadow-lg">
                      {isSubmitting ? <Loader2 className="animate-spin" /> : "COMMIT CHANGES"}
                    </Button>
                    <Button onClick={() => setIsEditMode(false)} variant="outline" className="flex-1 font-black h-12">CANCEL</Button>
                  </>
                ) : (
                  <>
                    <Button onClick={() => setIsEditMode(true)} className="flex-1 font-black h-12">UPDATE LISTING DATA</Button>
                    <Button onClick={() => { setSelectedProduct(null); setIsEditMode(false); }} variant="outline" className="flex-1 font-black h-12">DISMISS INTEL</Button>
                  </>
                )}
              </CardHeader>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}
