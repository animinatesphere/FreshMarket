import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { supabase } from "../utils/supabase";
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
  Loader2,
  Upload,
  Image as ImageIcon,
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
  const { updateTransactionStatus } = useTransaction();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [allTransactions, setAllTransactions] = useState<Transaction[]>([]);
  
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
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      setProducts(data.map((p: any) => ({
        id: p.id,
        title: p.name,
        description: p.description,
        price: p.price,
        category: p.category,
        image: p.image,
        unit: p.unit,
        inStock: p.in_stock,
        stockQuantity: p.stock_quantity,
        featured: p.featured,
        rating: p.rating,
      })));
    } catch (err) { console.error(err); }
  };

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase.from("profiles").select("*");
      if (error) throw error;
      setUsers(data.map((u: any) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.role,
        createdAt: u.created_at,
      })));
    } catch (err) { console.error(err); }
  };

  const fetchAllTransactions = async () => {
    try {
      const { data: orders, error } = await supabase
        .from("orders")
        .select("*, order_items(*)")
        .order("created_at", { ascending: false });

      if (error) throw error;

      setAllTransactions((orders || []).map((order: any) => ({
        id: order.id,
        orderId: order.order_id,
        date: order.created_at,
        items: (order.order_items || []).map((item: any) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          category: item.category || "",
          image: item.image || "",
          unit: item.unit || "",
        })),
        subtotal: order.subtotal,
        discount: order.discount,
        discountCode: order.discount_code,
        shipping: order.shipping,
        tax: order.tax,
        total: order.total,
        paymentMethod: order.payment_method,
        status: order.status,
        customerName: order.customer_name,
        customerEmail: order.customer_email,
        address: order.address,
        phone: order.phone_number,
      })));
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    const loadAll = async () => {
      setIsLoading(true);
      await Promise.all([fetchProducts(), fetchUsers(), fetchAllTransactions()]);
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

  const uploadToStorage = async (file: File): Promise<string | null> => {
    const fileExt = file.name.split(".").pop();
    const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
    const filePath = `product-thumbnails/${fileName}`;
    const { error: uploadError } = await supabase.storage.from("product-images").upload(filePath, file);
    if (uploadError) return null;
    const { data } = supabase.storage.from("product-images").getPublicUrl(filePath);
    return data.publicUrl;
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
        const uploadedUrl = await uploadToStorage(imageFile);
        if (!uploadedUrl) throw new Error("Upload failed");
        finalImageUrl = uploadedUrl;
      }
      const { error } = await supabase.from("products").insert({
        name: newProduct.title,
        description: newProduct.description,
        price: parseFloat(newProduct.price),
        category: newProduct.category,
        image: finalImageUrl,
        unit: newProduct.unit,
        in_stock: newProduct.inStock,
        stock_quantity: parseInt(newProduct.stockQuantity) || 0,
        featured: newProduct.featured,
        rating: newProduct.rating ? parseFloat(newProduct.rating) : 0,
      });
      if (error) throw error;
      await fetchProducts();
      setNewProduct({ title: "", description: "", price: "", category: categories[1], image: "", unit: "", inStock: true, stockQuantity: "", featured: false, rating: "" });
      setImageFile(null); setImagePreview(null);
    } catch (err: any) { alert(err.message); } finally { setIsSubmitting(false); setIsUploading(false); }
  };

  const handleUpdateProduct = async () => {
    if (!selectedProduct) return;
    setIsSubmitting(true);
    try {
        const { error } = await supabase
            .from("products")
            .update({
                name: selectedProduct.title,
                description: selectedProduct.description,
                price: selectedProduct.price,
                category: selectedProduct.category,
                unit: selectedProduct.unit,
                in_stock: selectedProduct.inStock,
                stock_quantity: selectedProduct.stockQuantity,
                featured: selectedProduct.featured,
            })
            .eq("id", selectedProduct.id);
        
        if (error) throw error;
        await fetchProducts();
        setSelectedProduct(null);
        setIsEditMode(false);
    } catch (err: any) { alert(err.message); } finally { setIsSubmitting(false); }
  };

  const handleUpdateOrderStatus = async (id: string, newStatus: Transaction["status"]) => {
    setIsSubmitting(true);
    try {
        await updateTransactionStatus(id, newStatus);
        setAllTransactions(prev => prev.map(t => t.id === id ? { ...t, status: newStatus } : t));
        if (selectedOrder && selectedOrder.id === id) {
            setSelectedOrder({ ...selectedOrder, status: newStatus });
        }
    } catch (err: any) { alert(err.message); } finally { setIsSubmitting(false); }
  };

  const handleDeleteProduct = async (id: number) => {
    if (!confirm("Are you sure?")) return;
    await supabase.from("products").delete().eq("id", id);
    setProducts(products.filter(p => p.id !== id));
  };

  const handleDeleteUser = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    await supabase.from("profiles").delete().eq("id", id);
    setUsers(users.filter(u => u.id !== id));
  };

  const stats = [
    { label: "Orders", value: allTransactions.length, icon: Receipt, bgColor: "bg-purple-50", textColor: "text-purple-600" },
    { label: "Revenue", value: formatCurrency(allTransactions.reduce((sum, t) => sum + t.total, 0)), icon: DollarSign, bgColor: "bg-orange-50", textColor: "text-orange-600" },
    { label: "Products", value: products.length, icon: Package, bgColor: "bg-green-50", textColor: "text-green-600" },
    { label: "Customers", value: users.length, icon: Users, bgColor: "bg-blue-50", textColor: "text-blue-600" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Navbar */}
      <header className="bg-white border-b h-16 flex items-center shrink-0 px-8 justify-between sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-200">
            <BarChart3 className="text-white w-6 h-6" />
          </div>
          <h1 className="text-xl font-black text-gray-900 tracking-tight">FRESHMARKET <span className="text-orange-600">ADMIN</span></h1>
        </div>
        <div className="flex items-center gap-4 text-sm">
            <div className="text-right mr-2 hidden sm:block">
                <p className="font-bold text-gray-900 leading-none">{user?.name}</p>
                <p className="text-gray-400 text-xs text-right">Super Administrator</p>
            </div>
            <Button onClick={() => { logout(); navigate("/"); }} variant="ghost" className="text-red-500 hover:bg-red-50 font-bold">
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
                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest">{stat.label}</p>
                        <p className="text-3xl font-black text-gray-900">{stat.value}</p>
                    </div>
                    <div className={`absolute top-4 right-4 p-3 rounded-2xl ${stat.bgColor} transition-transform group-hover:scale-110`}>
                        <stat.icon className={`w-6 h-6 ${stat.textColor}`} />
                    </div>
                </CardContent>
              </Card>
            ))}
          </section>

          <Tabs defaultValue="products" className="space-y-6">
            <TabsList className="bg-white p-1 border shadow-sm w-fit rounded-xl">
                <TabsTrigger value="products" className="rounded-lg data-[state=active]:bg-orange-600 data-[state=active]:text-white">Products</TabsTrigger>
                <TabsTrigger value="transactions" className="rounded-lg data-[state=active]:bg-orange-600 data-[state=active]:text-white">Live Orders</TabsTrigger>
                <TabsTrigger value="users" className="rounded-lg data-[state=active]:bg-orange-600 data-[state=active]:text-white">User Base</TabsTrigger>
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
                                <label className="text-[10px] font-black text-gray-400 uppercase">Product Name</label>
                                <Input placeholder="e.g. Red Apples" value={newProduct.title} onChange={e => setNewProduct({...newProduct, title: e.target.value})} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase">Category</label>
                                <select 
                                    className="w-full h-10 px-3 bg-white border rounded-md font-bold text-sm focus:ring-2 focus:ring-orange-500 outline-none"
                                    value={newProduct.category}
                                    onChange={e => setNewProduct({...newProduct, category: e.target.value})}
                                >
                                    {categories.filter(c => c !== "All").map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase">Price (₦)</label>
                                    <Input type="number" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase">Unit</label>
                                    <Input placeholder="per kg" value={newProduct.unit} onChange={e => setNewProduct({...newProduct, unit: e.target.value})} />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase">Description</label>
                                <textarea 
                                    className="w-full text-sm p-3 border rounded-md h-24 focus:ring-2 focus:ring-orange-500 outline-none"
                                    value={newProduct.description}
                                    onChange={e => setNewProduct({...newProduct, description: e.target.value})}
                                />
                            </div>

                            {/* Image Upload Area */}
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-gray-400 uppercase block">Visual Identity</label>
                                <div 
                                    onClick={() => fileInputRef.current?.click()}
                                    className="border-2 border-dashed rounded-xl p-4 flex flex-col items-center justify-center min-h-[140px] cursor-pointer hover:bg-orange-50 transition-colors group relative overflow-hidden"
                                >
                                    {imagePreview ? (
                                        <img src={imagePreview} className="absolute inset-0 w-full h-full object-cover" alt="Preview" />
                                    ) : (
                                        <>
                                            <Upload className="w-8 h-8 text-gray-300 group-hover:text-orange-500 mb-2" />
                                            <p className="text-xs font-bold text-gray-400 group-hover:text-orange-600">Click to Upload</p>
                                        </>
                                    )}
                                    <input type="file" ref={fileInputRef} className="hidden" onChange={handleImageChange} />
                                </div>
                            </div>

                            <Button onClick={handleAddProduct} disabled={isSubmitting || isUploading} className="w-full bg-orange-600 hover:bg-orange-700 font-bold h-12 rounded-xl">
                                {isSubmitting ? <Loader2 className="animate-spin" /> : "PUBLISH TO MARKET"}
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Inventory Table */}
                    <Card className="lg:col-span-2 border-0 shadow-sm overflow-hidden">
                        <CardHeader className="flex flex-row justify-between items-center bg-white">
                            <CardTitle>Market Inventory</CardTitle>
                            <Button variant="outline" size="sm" onClick={fetchProducts}>Refresh Data</Button>
                        </CardHeader>
                        <CardContent className="p-0">
                            {isLoading ? <SkeletonTable /> : (
                                <table className="w-full text-left">
                                    <thead className="bg-slate-50 border-y border-slate-100">
                                        <tr className="text-[10px] font-black text-gray-400 p-4">
                                            <th className="p-4 uppercase">Product Details</th>
                                            <th className="p-4 uppercase">Category</th>
                                            <th className="p-4 uppercase text-right">Pricing</th>
                                            <th className="p-4 uppercase text-center">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {products.map(p => (
                                            <tr key={p.id} className="hover:bg-slate-50/50 group">
                                                <td className="p-4">
                                                    <div className="flex items-center gap-4">
                                                        <img src={p.image} className="w-12 h-12 rounded-lg object-cover bg-slate-100" alt="" />
                                                        <div>
                                                            <p className="font-bold text-gray-900 leading-tight">{p.title}</p>
                                                            <p className="text-xs text-gray-400 mt-1">{p.stockQuantity} in stock</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-4">
                                                    <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-black rounded-full uppercase tracking-tighter">{p.category}</span>
                                                </td>
                                                <td className="p-4 text-right">
                                                    <p className="font-bold text-gray-900">{formatCurrency(p.price)}</p>
                                                    <p className="text-[10px] text-gray-400 font-bold uppercase">{p.unit}</p>
                                                </td>
                                                <td className="p-4 text-center">
                                                    <div className="flex items-center justify-center gap-2">
                                                        <Button onClick={() => { setSelectedProduct(p); setIsEditMode(false); }} variant="secondary" size="icon" className="h-8 w-8 hover:bg-orange-100 hover:text-orange-600">
                                                            <Eye className="w-4 h-4" />
                                                        </Button>
                                                        <Button onClick={() => handleDeleteProduct(p.id)} variant="ghost" size="icon" className="h-8 w-8 text-red-400 hover:text-red-600">
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
                    <CardHeader className="bg-white border-b flex flex-row justify-between items-center">
                        <div>
                            <CardTitle>Live Sales Stream</CardTitle>
                            <CardDescription>Tracking orders and delivery locations.</CardDescription>
                        </div>
                        <Button variant="outline" size="sm" onClick={fetchAllTransactions}>Sync Pipeline</Button>
                    </CardHeader>
                    <CardContent className="p-0">
                        {isLoading ? <SkeletonTable /> : (
                            <table className="w-full text-left">
                                <thead className="bg-slate-100/50">
                                    <tr className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                        <th className="p-4">Order & Time</th>
                                        <th className="p-4">Customer</th>
                                        <th className="p-4">Delivery Info</th>
                                        <th className="p-4 text-right">Total</th>
                                        <th className="p-4 text-center">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {allTransactions.map(t => (
                                        <tr key={t.id} className="hover:bg-slate-50/50 group cursor-pointer" onClick={() => setSelectedOrder(t)}>
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center">
                                                        <Receipt className="w-4 h-4 text-orange-500" />
                                                    </div>
                                                    <div>
                                                        <p className="font-black text-gray-900 text-sm">{t.orderId}</p>
                                                        <p className="text-[10px] text-gray-400 font-bold flex items-center gap-1">
                                                            <Clock className="w-3 h-3" /> {new Date(t.date).toLocaleTimeString()}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <p className="font-bold text-gray-900 text-sm">{t.customerName}</p>
                                                <div className="flex items-center gap-1 text-blue-500 text-[10px] font-bold">
                                                    <Phone className="w-2.5 h-2.5" /> {t.phone || "No phone"}
                                                </div>
                                            </td>
                                            <td className="p-4 max-w-[200px]">
                                                <div className="flex items-start gap-2">
                                                    <MapPin className="w-3 h-3 text-red-400 mt-1 shrink-0" />
                                                    <p className="text-xs font-bold text-gray-600 line-clamp-2 leading-relaxed">{t.address || "No address provided"}</p>
                                                </div>
                                            </td>
                                            <td className="p-4 text-right font-black text-gray-900">{formatCurrency(t.total)}</td>
                                            <td className="p-4 text-center">
                                                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                                    t.status === "completed" ? "bg-green-100 text-green-600" : "bg-amber-100 text-amber-600"
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
                    <CardHeader className="bg-white border-b">
                        <CardTitle>User Authentication Directory</CardTitle>
                        <CardDescription>Review all registered profiles.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                        <table className="w-full">
                            <thead className="bg-slate-50 border-b">
                                <tr className="text-[10px] font-black text-gray-400 uppercase">
                                    <th className="p-4">User Identity</th>
                                    <th className="p-4">Role</th>
                                    <th className="p-4 text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {users.map(u => (
                                    <tr key={u.id} className="hover:bg-slate-50/50">
                                        <td className="p-4 font-bold text-gray-900">
                                            {u.name} <span className="block text-xs font-medium text-gray-400">{u.email}</span>
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter ${
                                                u.role === "admin" ? "bg-orange-100 text-orange-600" : "bg-blue-100 text-blue-600"
                                            }`}>{u.role}</span>
                                        </td>
                                        <td className="p-4 text-center">
                                            <Button onClick={() => handleDeleteUser(u.id)} variant="ghost" size="icon" className="text-gray-300 hover:text-red-500">
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
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                <Card className="w-full max-w-2xl border-0 shadow-2xl rounded-2xl overflow-hidden animate-in fade-in zoom-in duration-200 text-left">
                    <div className="bg-orange-600 px-8 py-6 text-white flex justify-between items-center">
                        <div>
                            <h3 className="text-2xl font-black">{selectedOrder.orderId} Intelligence</h3>
                            <p className="text-orange-100 text-xs font-bold uppercase mt-1 tracking-widest">Order Status: {selectedOrder.status}</p>
                        </div>
                        <button onClick={() => setSelectedOrder(null)} className="p-2 bg-orange-700 rounded-full hover:bg-black transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                    <CardContent className="p-8 space-y-8 bg-white max-h-[70vh] overflow-y-auto">
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                             <div className="space-y-4">
                                 <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Customer Protocol</h4>
                                 <div className="space-y-2">
                                     <p className="text-xl font-black text-slate-900">{selectedOrder.customerName}</p>
                                     <p className="text-sm font-bold text-blue-600">{selectedOrder.customerEmail}</p>
                                     <p className="text-sm font-bold text-slate-600 flex items-center gap-2">
                                         <Phone className="w-4 h-4 text-orange-400" /> {selectedOrder.phone}
                                     </p>
                                 </div>
                             </div>
                             <div className="space-y-4">
                                 <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Delivery Coordinates</h4>
                                 <div className="p-4 bg-slate-50 border rounded-xl flex items-start gap-2">
                                     <MapPin className="w-4 h-4 text-red-500 mt-1 shrink-0" />
                                     <p className="text-sm font-bold text-slate-700 leading-relaxed italic">{selectedOrder.address || "No address provided"}</p>
                                 </div>
                             </div>
                         </div>

                         <div className="space-y-4">
                            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Package Contents</h4>
                            <div className="space-y-3">
                                {selectedOrder.items.map((item, i) => (
                                    <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                                        <div className="flex items-center gap-4">
                                            <img src={item.image} className="w-12 h-12 rounded-lg object-cover shadow-sm" alt="" />
                                            <div>
                                                <p className="font-black text-slate-900 text-sm">{item.name}</p>
                                                <p className="text-[10px] text-gray-400 font-black uppercase">{item.quantity} x {formatCurrency(item.price)}</p>
                                            </div>
                                        </div>
                                        <p className="font-black text-slate-900">{formatCurrency(item.price * item.quantity)}</p>
                                    </div>
                                ))}
                            </div>
                         </div>

                         <div className="bg-slate-900 rounded-2xl p-6 text-white space-y-3">
                             <div className="flex justify-between text-slate-400 text-xs font-bold uppercase tracking-widest">
                                <span>Order Weight</span>
                                <span>{selectedOrder.subtotal > 0 ? "Standard" : "N/A"}</span>
                             </div>
                             <div className="flex justify-between text-slate-400 text-xs font-bold uppercase tracking-widest border-b border-slate-800 pb-3">
                                <span>Shipping Protocol</span>
                                <span>{selectedOrder.shipping === 0 ? "FREE" : formatCurrency(selectedOrder.shipping)}</span>
                             </div>
                             <div className="flex justify-between items-center pt-2">
                                 <span className="text-lg font-black uppercase tracking-tighter">Total Captured</span>
                                 <span className="text-3xl font-black text-orange-500">{formatCurrency(selectedOrder.total)}</span>
                             </div>
                             <div className="pt-2 flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                <CreditCard className="w-4 h-4" /> Paid via {selectedOrder.paymentMethod}
                             </div>
                         </div>
                    </CardContent>

                    <CardHeader className="bg-slate-50 border-t p-6 flex flex-row gap-4">
                        {selectedOrder.status === "pending" ? (
                            <Button onClick={() => handleUpdateOrderStatus(selectedOrder.id, "completed")} disabled={isSubmitting} className="flex-1 bg-green-600 hover:bg-green-700 h-14 font-black rounded-xl text-white shadow-lg shadow-green-100">
                                {isSubmitting ? <Loader2 className="animate-spin" /> : <><CheckCircle className="w-5 h-5 mr-2" /> MARK AS SHIPPED</>}
                            </Button>
                        ) : (
                            <div className="flex-1 text-center py-4 bg-slate-100 rounded-xl text-slate-500 font-bold uppercase text-xs tracking-widest flex items-center justify-center gap-2">
                                <CheckCircle className="w-4 h-4 text-green-500" /> ORDER DISPATCHED & COMPLETED
                            </div>
                        )}
                        <Button onClick={() => setSelectedOrder(null)} variant="outline" className="flex-1 h-14 font-black rounded-xl">DISMISS DETAILS</Button>
                    </CardHeader>
                </Card>
            </div>
        )}

        {/* Product Detail/Edit Modal */}
        {selectedProduct && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <Card className="w-full max-w-2xl border-0 shadow-2xl rounded-2xl overflow-hidden animate-in fade-in zoom-in duration-200 text-left">
                <div className="bg-slate-900 px-8 py-6 text-white flex justify-between items-center">
                    <div>
                        <h3 className="text-2xl font-black tracking-tight">{isEditMode ? "Manage Listing" : "Listing Intelligence"}</h3>
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">PRODUCT ID: #{selectedProduct.id}</p>
                    </div>
                    <button onClick={() => { setSelectedProduct(null); setIsEditMode(false); }} className="bg-slate-800 p-2 rounded-full hover:bg-red-500 transition-colors">
                        <X className="w-5 h-5 text-white" />
                    </button>
                </div>
                <CardContent className="p-8 space-y-8 bg-white max-h-[70vh] overflow-y-auto">
                    
                    {isEditMode ? (
                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase">Product Name</label>
                                    <Input value={selectedProduct.title} onChange={e => setSelectedProduct({...selectedProduct, title: e.target.value})} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase">Category</label>
                                    <select className="w-full h-10 border rounded px-3 font-bold text-sm" value={selectedProduct.category} onChange={e => setSelectedProduct({...selectedProduct, category: e.target.value})}>
                                        {categories.filter(c => c !== "All").map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase">Price (₦)</label>
                                    <Input type="number" value={selectedProduct.price} onChange={e => setSelectedProduct({...selectedProduct, price: parseFloat(e.target.value)})} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase">Stock Quantity</label>
                                    <Input type="number" value={selectedProduct.stockQuantity} onChange={e => setSelectedProduct({...selectedProduct, stockQuantity: parseInt(e.target.value)})} />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase">Description</label>
                                <textarea className="w-full p-4 border rounded-xl text-sm italic font-medium h-32" value={selectedProduct.description} onChange={e => setSelectedProduct({...selectedProduct, description: e.target.value})} />
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div className="space-y-6">
                                <div className="aspect-square bg-slate-50 rounded-2xl overflow-hidden shadow-inner border border-slate-100">
                                    <img src={selectedProduct.image} className="w-full h-full object-cover" alt="" />
                                </div>
                                <div className="flex gap-4">
                                     <div className="flex-1 bg-slate-50 p-4 rounded-xl border border-slate-100 text-center">
                                        <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Stock</p>
                                        <p className="text-xl font-black text-slate-900">{selectedProduct.stockQuantity} {selectedProduct.unit}</p>
                                     </div>
                                     <div className="flex-1 bg-slate-50 p-4 rounded-xl border border-slate-100 text-center">
                                        <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Rating</p>
                                        <div className="flex items-center justify-center gap-1">
                                            <p className="text-xl font-black text-slate-900">{selectedProduct.rating}</p>
                                            <CheckCircle className="w-4 h-4 text-green-500" />
                                        </div>
                                     </div>
                                </div>
                            </div>
                            <div className="space-y-6">
                                <div>
                                    <p className="text-orange-500 font-black text-xs uppercase tracking-widest">{selectedProduct.category}</p>
                                    <h4 className="text-3xl font-black text-slate-900 mt-1">{selectedProduct.title}</h4>
                                    <p className="text-2xl font-black text-slate-900 mt-2">{formatCurrency(selectedProduct.price)}</p>
                                </div>
                                <div className="h-[1px] bg-slate-100" />
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase mb-3">Professional Description</p>
                                    <p className="text-slate-600 font-medium leading-relaxed italic">{selectedProduct.description}</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    {selectedProduct.featured && (
                                        <span className="px-3 py-1 bg-amber-50 text-amber-600 text-[10px] font-black uppercase rounded-full">Featured Item</span>
                                    )}
                                    {selectedProduct.inStock ? (
                                        <span className="px-3 py-1 bg-green-50 text-green-600 text-[10px] font-black uppercase rounded-full">Active Inventory</span>
                                    ) : (
                                        <span className="px-3 py-1 bg-red-50 text-red-600 text-[10px] font-black uppercase rounded-full">Out of Stock</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </CardContent>
                <CardHeader className="bg-slate-50 border-t p-6 flex flex-row gap-4">
                    {isEditMode ? (
                        <>
                            <Button onClick={handleUpdateProduct} disabled={isSubmitting} className="flex-1 bg-orange-600 hover:bg-orange-700 font-black h-12 shadow-lg shadow-orange-100">
                                {isSubmitting ? <Loader2 className="animate-spin" /> : "COMMIT CHANGES"}
                            </Button>
                            <Button onClick={() => setIsEditMode(false)} variant="outline" className="flex-1 font-black h-12">CANCEL</Button>
                        </>
                    ) : (
                        <>
                            <Button onClick={() => setIsEditMode(true)} className="flex-1 bg-slate-900 hover:bg-slate-800 font-black h-12 text-white">UPGRADE LISTING DATA</Button>
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
