import { useState } from "react";
import { Link, useNavigate } from "react-router";
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  Loader2,
  MapPin,
  Phone,
} from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useTransaction } from "../context/TransactionContext";
import { api, ApiError } from "../lib/api";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { formatCurrency } from "../utils/currency";

interface PromoResult {
  code: string;
  discount: number;
}

export function Cart() {
  const { items, removeFromCart, updateQuantity, getTotalPrice, clearCart } =
    useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { addTransaction } = useTransaction();

  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<PromoResult | null>(null);
  const [promoError, setPromoError] = useState("");
  const [isApplyingPromo, setIsApplyingPromo] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const [address, setAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const [paymentMethod, setPaymentMethod] = useState<
    "credit" | "debit" | "paypal"
  >("credit");

  const totalPrice = getTotalPrice();
  const shipping = totalPrice > 75000 ? 0 : 8900;
  const discount = appliedPromo?.discount || 0;

  const subtotalAfterDiscount = totalPrice - discount;
  const tax = subtotalAfterDiscount * 0.08;
  const finalTotal = subtotalAfterDiscount + shipping + tax;

  const handleApplyPromo = async () => {
    if (!promoCode.trim()) return;
    setIsApplyingPromo(true);
    setPromoError("");
    try {
      const result = await api.post<{ code: string; discount: number }>("/promo/validate", {
        code: promoCode.trim(),
        subtotal: totalPrice,
      });
      setAppliedPromo(result);
    } catch (err) {
      setPromoError(err instanceof ApiError ? err.message : "Invalid promo code");
      setAppliedPromo(null);
    } finally {
      setIsApplyingPromo(false);
    }
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    setPromoCode("");
    setPromoError("");
  };

  const handlePayment = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (!address || !phoneNumber) {
      alert("Please provide a delivery address and phone number.");
      return;
    }

    setIsProcessing(true);
    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000));

    try {
      const transaction = await addTransaction({
        items: items.map((item) => ({
          id: item.id,
          productId: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          category: item.category,
          image: item.image,
          unit: item.unit,
        })) as any,
        subtotal: totalPrice,
        discount: discount,
        discountCode: appliedPromo?.code,
        shipping: shipping,
        tax: tax,
        total: finalTotal,
        paymentMethod: paymentMethod,
        status: "pending",
        customerName: user.name,
        customerEmail: user.email,
        address: address,
        phone: phoneNumber,
      } as any);

      setIsProcessing(false);
      clearCart();
      setShowPaymentModal(false);
      navigate(`/receipt/${transaction.id}`);
    } catch (err: any) {
      alert("Checkout failed: " + err.message);
      setIsProcessing(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <ShoppingBag className="h-24 w-24 text-muted-foreground/30 mx-auto mb-4" />
          <h2 className="text-3xl mb-4">Your Cart is Empty</h2>
          <p className="text-muted-foreground mb-8">
            Add some delicious products to your cart and they will appear here.
          </p>
          <Link to="/products">
            <Button size="lg">
              Start Shopping
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen">
      <div className="bg-primary text-primary-foreground py-8 sm:py-12 lg:py-16 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 sm:w-96 sm:h-96 bg-accent rounded-full blur-3xl opacity-15" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex items-center gap-2 sm:gap-3 mb-2">
            <ShoppingBag className="h-6 w-6 sm:h-8 sm:w-8" />
            <h1 className="text-3xl sm:text-4xl lg:text-5xl">Shopping Cart</h1>
          </div>
          <p className="text-primary-foreground/80 text-sm sm:text-base lg:text-lg">
            {items.length} item{items.length !== 1 ? "s" : ""} ready for checkout
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-sm">
              <CardContent className="p-4 sm:p-6 lg:p-8">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 sm:mb-8 pb-4 sm:pb-6 border-b border-border">
                  <div>
                    <h2 className="text-2xl sm:text-3xl">Your Items</h2>
                    <p className="text-sm text-muted-foreground mt-1">
                      {items.length} product{items.length !== 1 ? "s" : ""} selected
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearCart}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10 font-medium"
                  >
                    Clear Cart
                  </Button>
                </div>

                <div className="space-y-4 sm:space-y-5 lg:space-y-6">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex flex-col sm:flex-row gap-3 sm:gap-4 p-3 sm:p-4 lg:p-5 bg-muted/40 rounded-xl border border-border hover:border-accent/40 transition-all"
                    >
                      <div className="relative flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 object-cover rounded-lg shadow-md"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-3">
                          <div className="flex-1">
                            <Link to={`/products/${item.id}`}>
                              <h3 className="text-base sm:text-lg font-semibold hover:text-accent line-clamp-2 font-sans">
                                {item.name}
                              </h3>
                            </Link>
                            <div className="flex flex-wrap items-center gap-2 mt-1">
                              <span className="inline-block px-2 py-1 bg-secondary text-secondary-foreground text-xs font-medium rounded-full">
                                {item.category}
                              </span>
                              <span className="text-xs sm:text-sm text-muted-foreground font-medium">
                                {formatCurrency(item.price)}/{item.unit}
                              </span>
                            </div>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="flex-shrink-0 ml-auto sm:ml-3 p-2 text-destructive hover:text-destructive/80"
                          >
                            <Trash2 className="h-4 w-4 sm:h-5 sm:w-5" />
                          </button>
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t border-border">
                          <div className="flex items-center border border-border rounded-lg bg-card">
                            <button
                              onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                              className="p-2 hover:bg-muted"
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                            <span className="px-4 font-semibold">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="p-2 hover:bg-muted"
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>
                          <p className="text-xl font-bold text-primary">
                            {formatCurrency(item.price * item.quantity)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-20 border-0 shadow-md">
              <CardContent className="p-6">
                <h2 className="text-2xl mb-6">Order Summary</h2>

                {/* Promo Code */}
                <div className="mb-6 p-4 bg-secondary border-2 border-dashed border-accent/30 rounded-xl">
                  <label className="block text-sm font-bold mb-2">Promo Code</label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter code"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      disabled={!!appliedPromo}
                    />
                    <Button onClick={handleApplyPromo} disabled={isApplyingPromo || !!appliedPromo}>
                      {isApplyingPromo ? <Loader2 className="h-4 w-4 animate-spin" /> : "Apply"}
                    </Button>
                  </div>
                  {promoError && <p className="mt-2 text-destructive text-sm font-bold">{promoError}</p>}
                  {appliedPromo && (
                    <div className="mt-2 text-primary text-sm font-bold flex justify-between">
                      <span>✓ {appliedPromo.code} applied</span>
                      <button onClick={handleRemovePromo} className="underline text-xs">Remove</button>
                    </div>
                  )}
                </div>

                <div className="space-y-4 mb-6 pb-6 border-b border-border">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-bold">{formatCurrency(totalPrice)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-primary">
                      <span>Discount</span>
                      <span>-{formatCurrency(discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="font-bold">{shipping === 0 ? "FREE" : formatCurrency(shipping)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax (8%)</span>
                    <span>{formatCurrency(tax)}</span>
                  </div>
                </div>

                <div className="flex justify-between text-2xl font-bold mb-8">
                  <span>Total</span>
                  <span>{formatCurrency(finalTotal)}</span>
                </div>

                <Button
                  size="lg"
                  className="w-full font-bold text-lg h-14 rounded-xl"
                  onClick={() => setShowPaymentModal(true)}
                >
                  Checkout Delivery
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Delivery & Payment Modal */}
        {showPaymentModal && (
          <div className="fixed inset-0 bg-foreground/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-xl border-0 shadow-2xl rounded-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
              <div className="bg-primary px-8 py-6 text-primary-foreground">
                <h3 className="text-2xl">Delivery & Payment</h3>
                <p className="text-primary-foreground/80 text-sm">Where should we deliver your fresh products?</p>
              </div>
              <CardContent className="p-8 space-y-6">
                {/* Delivery Fields */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                      <MapPin className="w-3 h-3" /> Delivery Address
                    </label>
                    <textarea
                      required
                      placeholder="Street Name, House Number, City"
                      className="w-full p-4 border border-border rounded-xl bg-input-background focus:ring-2 focus:ring-ring outline-none min-h-[80px]"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                      <Phone className="w-3 h-3" /> Contact Phone
                    </label>
                    <Input
                      required
                      placeholder="0800 123 4567"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                    />
                  </div>
                </div>

                <div className="h-px bg-border w-full" />

                <div className="space-y-3">
                  <label className="text-xs font-black text-muted-foreground uppercase tracking-widest">Select Payment</label>
                  <div className="grid grid-cols-3 gap-3">
                    {(["credit", "debit", "paypal"] as const).map((m) => (
                      <button
                        key={m}
                        onClick={() => setPaymentMethod(m)}
                        className={`p-3 rounded-xl border-2 font-bold text-xs uppercase ${
                          paymentMethod === m ? "border-accent bg-accent/10 text-accent" : "border-border"
                        }`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-4 space-y-3">
                  <Button
                    onClick={handlePayment}
                    disabled={isProcessing || !address || !phoneNumber}
                    className="w-full h-14 rounded-xl text-lg font-bold shadow-lg"
                  >
                    {isProcessing ? <Loader2 className="animate-spin w-6 h-6" /> : `Complete Order • ${formatCurrency(finalTotal)}`}
                  </Button>
                  <Button
                    onClick={() => setShowPaymentModal(false)}
                    variant="ghost"
                    className="w-full text-muted-foreground font-bold"
                  >
                    Go Back
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
