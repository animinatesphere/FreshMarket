import { useState } from "react";
import { Link, useNavigate } from "react-router";
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  Tag,
  Loader2,
} from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useTransaction } from "../context/TransactionContext";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { formatCurrency } from "../utils/currency";

// Promo codes with discounts
const promoCodes: Record<
  string,
  { discount: number; type: "percentage" | "fixed" }
> = {
  FRESH10: { discount: 10, type: "percentage" },
  SAVE5000: { discount: 5000, type: "fixed" },
  ORGANIC15: { discount: 15, type: "percentage" },
  WELCOME20: { discount: 20, type: "percentage" },
};

export function Cart() {
  const { items, removeFromCart, updateQuantity, getTotalPrice, clearCart } =
    useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { addTransaction } = useTransaction();

  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [promoError, setPromoError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<
    "credit" | "debit" | "paypal"
  >("credit");

  const totalPrice = getTotalPrice();
  const shipping = totalPrice > 75000 ? 0 : 8900;

  // Calculate discount
  let discount = 0;
  if (appliedPromo && promoCodes[appliedPromo]) {
    const promo = promoCodes[appliedPromo];
    if (promo.type === "percentage") {
      discount = totalPrice * (promo.discount / 100);
    } else {
      discount = promo.discount;
    }
  }

  const subtotalAfterDiscount = totalPrice - discount;
  const tax = subtotalAfterDiscount * 0.08;
  const finalTotal = subtotalAfterDiscount + shipping + tax;

  const handleApplyPromo = () => {
    const code = promoCode.toUpperCase();
    if (promoCodes[code]) {
      setAppliedPromo(code);
      setPromoError("");
    } else {
      setPromoError("Invalid promo code");
      setAppliedPromo(null);
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

    setIsProcessing(true);
    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const transaction = addTransaction({
      orderId: `ORD-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      date: new Date().toISOString(),
      items: items.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        category: item.category,
        image: item.image,
        unit: item.unit,
      })),
      subtotal: totalPrice,
      discount: discount,
      discountCode: appliedPromo || undefined,
      shipping: shipping,
      tax: tax,
      total: finalTotal,
      paymentMethod: paymentMethod,
      status: "completed",
      customerName: user.name,
      customerEmail: user.email,
    });

    setIsProcessing(false);
    clearCart();
    setShowPaymentModal(false);
    navigate(`/receipt/${transaction.id}`);
  };
  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <ShoppingBag className="h-24 w-24 text-gray-300 mx-auto mb-4" />
          <h2 className="text-3xl mb-4">Your Cart is Empty</h2>
          <p className="text-gray-600 mb-8">
            Add some delicious products to your cart and they will appear here.
          </p>
          <Link to="/products">
            <Button size="lg" className="bg-orange-600 hover:bg-orange-700">
              Start Shopping
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="bg-gradient-to-br from-orange-600 via-orange-500 to-orange-700 text-white py-16 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-400 rounded-full blur-3xl opacity-20"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-orange-400 rounded-full blur-3xl opacity-20"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <ShoppingBag className="h-8 w-8" />
            <h1 className="text-5xl font-bold">Shopping Cart</h1>
          </div>
          <p className="text-orange-100 text-lg">
            {items.length} item{items.length !== 1 ? "s" : ""} ready for
            checkout
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <Card className="border border-gray-200 shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className="flex justify-between items-center mb-8 pb-6 border-b-2 border-gray-100">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900">
                      Your Items
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                      {items.length} product{items.length !== 1 ? "s" : ""}{" "}
                      selected
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearCart}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 font-medium"
                  >
                    Clear Cart
                  </Button>
                </div>

                <div className="space-y-6">
                  {items.map((item, index) => (
                    <div
                      key={item.id}
                      className="flex gap-4 p-5 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-100 hover:border-orange-200 hover:shadow-md transition-all"
                    >
                      <div className="relative flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-28 h-28 object-cover rounded-lg shadow-md"
                        />
                        <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                          {index + 1}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1">
                            <Link to={`/products/${item.id}`}>
                              <h3 className="text-lg font-semibold text-gray-900 hover:text-orange-600 transition-colors line-clamp-2">
                                {item.name}
                              </h3>
                            </Link>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                                {item.category}
                              </span>
                              <span className="text-sm text-gray-500 font-medium">
                                {formatCurrency(item.price)}/{item.unit}
                              </span>
                            </div>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="flex-shrink-0 p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                            title="Remove from cart"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                          <div className="flex items-center gap-2">
                            <div className="flex items-center border border-gray-300 rounded-lg bg-white">
                              <button
                                onClick={() =>
                                  updateQuantity(
                                    item.id,
                                    Math.max(1, item.quantity - 1),
                                  )
                                }
                                className="p-2 hover:bg-gray-100 text-gray-600 hover:text-gray-900"
                                title="Decrease quantity"
                              >
                                <Minus className="h-4 w-4" />
                              </button>
                              <span className="px-4 font-semibold text-gray-900 min-w-[2rem] text-center">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() =>
                                  updateQuantity(item.id, item.quantity + 1)
                                }
                                className="p-2 hover:bg-gray-100 text-gray-600 hover:text-gray-900"
                                title="Increase quantity"
                              >
                                <Plus className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-500 mb-1">
                              Subtotal
                            </p>
                            <p className="text-2xl font-bold text-orange-600">
                              {formatCurrency(item.price * item.quantity)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 pt-8 border-t-2 border-gray-100">
                  <Link to="/products">
                    <Button
                      variant="outline"
                      className="font-medium border-2 border-orange-200 text-orange-600 hover:bg-orange-50 hover:border-orange-300"
                    >
                      ← Continue Shopping
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24 border border-gray-200 shadow-lg">
              <CardContent className="p-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-8 pb-6 border-b-2 border-gray-100">
                  Order Summary
                </h2>

                {/* Promo Code Section */}
                <div className="mb-8 p-5 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border-2 border-dashed border-amber-200">
                  <label className="block text-sm font-semibold mb-3 text-gray-900 flex items-center gap-2">
                    <Tag className="h-5 w-5 text-amber-600" />
                    Have a promo code?
                  </label>
                  {appliedPromo ? (
                    <div className="flex items-center justify-between bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 px-4 py-3 rounded-lg border-2 border-green-300 font-semibold">
                      <span className="flex items-center gap-2">
                        ✓ {appliedPromo} Applied!
                      </span>
                      <button
                        onClick={handleRemovePromo}
                        className="text-green-700 hover:text-green-900 text-sm font-bold underline"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div>
                      <div className="flex gap-2 mb-3">
                        <input
                          type="text"
                          value={promoCode}
                          onChange={(e) => {
                            setPromoCode(e.target.value.toUpperCase());
                            setPromoError("");
                          }}
                          placeholder="Enter promo code"
                          className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                        />
                        <Button
                          onClick={handleApplyPromo}
                          className="bg-amber-500 hover:bg-amber-600 text-white font-medium"
                          size="sm"
                        >
                          Apply
                        </Button>
                      </div>
                      {promoError && (
                        <p className="text-sm text-red-600 font-medium">
                          ✗ {promoError}
                        </p>
                      )}
                      <p className="text-xs text-gray-600 mt-3 font-medium">
                        💡 Try: <span className="font-bold">FRESH10</span>,{" "}
                        <span className="font-bold">ORGANIC15</span>,{" "}
                        <span className="font-bold">SAVE5000</span>
                      </p>
                    </div>
                  )}
                </div>

                <div className="space-y-4 mb-8 pb-8 border-b-2 border-gray-100">
                  <div className="flex justify-between text-gray-700 font-medium">
                    <span>Subtotal</span>
                    <span className="font-semibold text-gray-900">
                      {formatCurrency(totalPrice)}
                    </span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-green-700 bg-green-50 p-3 rounded-lg font-medium">
                      <span>Discount ({appliedPromo})</span>
                      <span className="font-bold text-green-600">
                        -{formatCurrency(discount)}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between text-gray-700 font-medium">
                    <span>Shipping</span>
                    <span className="font-semibold">
                      {shipping === 0 ? (
                        <span className="text-green-600 font-bold">
                          FREE 🎉
                        </span>
                      ) : (
                        <span className="text-gray-900">
                          {formatCurrency(shipping)}
                        </span>
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-700 font-medium">
                    <span>Tax (8%)</span>
                    <span className="font-semibold text-gray-900">
                      {formatCurrency(tax)}
                    </span>
                  </div>
                  {totalPrice < 75000 && (
                    <div className="bg-orange-50 border-l-4 border-orange-500 p-3 rounded">
                      <p className="text-sm font-medium text-orange-700">
                        🎁 Add {formatCurrency(75000 - totalPrice)} more for
                        free shipping!
                      </p>
                    </div>
                  )}
                </div>

                <div className="mb-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white shadow-lg">
                  <p className="text-sm font-medium text-orange-50 mb-2">
                    Amount Due
                  </p>
                  <div className="flex justify-between items-baseline">
                    <span className="text-lg font-semibold">Total</span>
                    <span className="text-4xl font-bold">
                      {formatCurrency(finalTotal)}
                    </span>
                  </div>
                </div>

                <Button
                  size="lg"
                  className="w-full bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white font-bold text-lg mb-4 shadow-lg hover:shadow-xl transition-all"
                  onClick={() => setShowPaymentModal(true)}
                >
                  Proceed to Checkout
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>

                <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-5 rounded-xl border-2 border-blue-200">
                  <h3 className="text-sm font-bold text-blue-900 mb-3 flex items-center gap-2">
                    <span>🔒</span> Secure Payment Methods
                  </h3>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="bg-white px-3 py-2 rounded-lg text-xs font-bold text-center text-gray-900 border border-blue-200">
                      💳 Visa
                    </div>
                    <div className="bg-white px-3 py-2 rounded-lg text-xs font-bold text-center text-gray-900 border border-blue-200">
                      💳 Mastercard
                    </div>
                    <div className="bg-white px-3 py-2 rounded-lg text-xs font-bold text-center text-blue-600 border border-blue-200">
                      🅿️ PayPal
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Payment Modal */}
        {showPaymentModal && (
          <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-lg border-0 shadow-2xl rounded-2xl overflow-hidden">
              <div className="bg-gradient-to-r from-orange-600 to-orange-700 px-8 py-6 text-white">
                <h3 className="text-3xl font-bold">Select Payment Method</h3>
                <p className="text-orange-100 text-sm mt-1">
                  Choose how you'd like to pay for your order
                </p>
              </div>
              <CardContent className="p-8">
                <div className="space-y-4 mb-8">
                  {[
                    {
                      id: "credit",
                      label: "Credit Card",
                      icon: "💳",
                      desc: "Visa, Mastercard",
                    },
                    {
                      id: "debit",
                      label: "Debit Card",
                      icon: "🏧",
                      desc: "Direct bank account",
                    },
                    {
                      id: "paypal",
                      label: "PayPal",
                      icon: "🅿️",
                      desc: "Fast & secure",
                    },
                  ].map((method) => (
                    <button
                      key={method.id}
                      onClick={() =>
                        setPaymentMethod(
                          method.id as "credit" | "debit" | "paypal",
                        )
                      }
                      className={`w-full p-5 rounded-xl border-2 transition-all text-left font-medium flex items-start gap-4 ${
                        paymentMethod === method.id
                          ? "border-orange-600 bg-gradient-to-r from-orange-50 to-orange-100 shadow-md"
                          : "border-gray-200 bg-white hover:border-orange-300 hover:bg-orange-50"
                      }`}
                    >
                      <span className="text-3xl mt-1">{method.icon}</span>
                      <div className="flex-1">
                        <p className="text-gray-900 font-bold text-base">
                          {method.label}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          {method.desc}
                        </p>
                      </div>
                      {paymentMethod === method.id && (
                        <div className="text-orange-600 mt-2">
                          <svg
                            className="w-6 h-6"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      )}
                    </button>
                  ))}
                </div>

                <div className="mb-8 p-5 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border-2 border-blue-200">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl flex-shrink-0">ℹ️</span>
                    <div>
                      <p className="font-bold text-blue-900 mb-1">Demo Mode</p>
                      <p className="text-sm text-blue-800">
                        This is a demo environment. Your payment will be
                        processed instantly and you'll receive an order receipt.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 flex flex-col">
                  <Button
                    onClick={handlePayment}
                    className="w-full bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white font-bold text-base py-6 shadow-lg hover:shadow-xl transition-all"
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin mr-2" />
                        Processing Payment...
                      </>
                    ) : (
                      <>
                        <span className="text-lg">✓</span>
                        <span className="ml-2">
                          Pay {formatCurrency(finalTotal)}
                        </span>
                        <ArrowRight className="ml-auto h-5 w-5" />
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={() => setShowPaymentModal(false)}
                    variant="outline"
                    className="w-full border-2 border-gray-300 font-medium py-6 hover:bg-gray-50"
                    disabled={isProcessing}
                  >
                    Cancel Order
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
