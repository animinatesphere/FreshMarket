import { Transaction } from "../context/TransactionContext";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { formatCurrency } from "../utils/currency";
import { Download, Share2, MapPin, Phone, Mail } from "lucide-react";

interface ReceiptProps {
  transaction: Transaction;
  onDownload?: () => void;
  onShare?: () => void;
}

export function Receipt({ transaction, onDownload, onShare }: ReceiptProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Card className="max-w-3xl mx-auto border-0 shadow-2xl rounded-2xl overflow-hidden">
      <div className="relative bg-gradient-to-br from-orange-600 via-orange-500 to-amber-600 px-8 sm:px-12 py-12 text-white overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-orange-400 rounded-full blur-3xl opacity-20"></div>
        <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-amber-400 rounded-full blur-3xl opacity-20"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-5xl font-black mb-2">✓ Order Confirmed</h1>
              <p className="text-orange-100 text-lg">
                Thank you for your purchase!
              </p>
            </div>
            <div className="text-6xl">🎉</div>
          </div>
          <div className="grid sm:grid-cols-2 gap-6 mt-8">
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
              <p className="text-orange-100 text-sm font-medium">Order ID</p>
              <p className="text-white text-xl font-bold mt-1">
                {transaction.orderId}
              </p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
              <p className="text-orange-100 text-sm font-medium">Date & Time</p>
              <p className="text-white text-xl font-bold mt-1">
                {formatDate(transaction.date)}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white">
        {/* Status Badge */}
        <div className="px-8 sm:px-12 py-6 bg-gray-50 border-b-2 border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">Order Status</h2>
            <span
              className={`px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 ${
                transaction.status === "completed"
                  ? "bg-green-100 text-green-700"
                  : transaction.status === "pending"
                    ? "bg-amber-100 text-amber-700"
                    : "bg-red-100 text-red-700"
              }`}
            >
              {transaction.status === "completed" && "✓"}
              {transaction.status === "pending" && "⏳"}
              {transaction.status === "failed" && "✗"}
              {transaction.status.charAt(0).toUpperCase() +
                transaction.status.slice(1)}
            </span>
          </div>
        </div>
      </div>
      <CardHeader className="hidden"></CardHeader>

      <CardContent className="p-8 sm:p-12">
        {/* Store Info */}
        <div className="mb-10 pb-10 border-b-2 border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="text-4xl">🥬</div>
            <div>
              <h2 className="text-3xl font-black text-gray-900">FreshMarket</h2>
              <p className="text-sm text-gray-600 font-medium">
                Organic Fresh & Natural Foods
              </p>
            </div>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 text-gray-700">
              <div className="bg-orange-100 p-3 rounded-lg">
                <MapPin className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-xs text-gray-600 font-bold">Address</p>
                <p className="font-medium text-sm">123 Fresh Street</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-gray-700">
              <div className="bg-orange-100 p-3 rounded-lg">
                <Phone className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-xs text-gray-600 font-bold">Phone</p>
                <p className="font-medium text-sm">+234 (0) 700 000 0000</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-gray-700">
              <div className="bg-orange-100 p-3 rounded-lg">
                <Mail className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-xs text-gray-600 font-bold">Email</p>
                <p className="font-medium text-sm">support@freshmarket.com</p>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Info */}
        {transaction.customerName && (
          <div className="mb-10 pb-10 border-b-2 border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="bg-blue-100 text-blue-600 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">
                👤
              </span>
              Customer Information
            </h3>
            <div className="bg-blue-50 rounded-lg p-6 border-2 border-blue-100 space-y-3">
              {transaction.customerName && (
                <div>
                  <p className="text-xs font-bold text-gray-600 mb-1">
                    FULL NAME
                  </p>
                  <p className="text-lg font-semibold text-gray-900">
                    {transaction.customerName}
                  </p>
                </div>
              )}
              {transaction.customerEmail && (
                <div>
                  <p className="text-xs font-bold text-gray-600 mb-1">
                    EMAIL ADDRESS
                  </p>
                  <p className="text-base font-medium text-gray-700">
                    {transaction.customerEmail}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Order Items */}
        <div className="mb-10 pb-10 border-b-2 border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
            <span className="bg-purple-100 text-purple-600 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">
              🛍️
            </span>
            Order Items ({transaction.items.length})
          </h3>
          <div className="space-y-4">
            {transaction.items.map((item, idx) => (
              <div
                key={idx}
                className="flex gap-4 p-5 bg-gradient-to-r from-gray-50 to-white rounded-lg border-2 border-gray-100 hover:border-purple-200 transition-colors"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-20 w-20 rounded-lg object-cover shadow-md flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-900 line-clamp-2">
                    {item.name}
                  </p>
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded font-bold">
                      {item.category}
                    </span>
                    <span className="text-sm text-gray-600 font-medium">
                      {formatCurrency(item.price)}/{item.unit}
                    </span>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="inline-flex items-center gap-2 bg-gray-200 px-3 py-1 rounded-lg mb-2">
                    <span className="text-sm font-bold text-gray-900">
                      ×{item.quantity}
                    </span>
                  </div>
                  <p className="text-lg font-bold text-gray-900">
                    {formatCurrency(item.price * item.quantity)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div className="mb-10 pb-10 border-b-2 border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
            <span className="bg-green-100 text-green-600 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">
              📊
            </span>
            Pricing Breakdown
          </h3>
          <div className="space-y-4 bg-gray-50 p-6 rounded-lg border-2 border-gray-100">
            <div className="flex justify-between items-center pb-3 border-b border-gray-200">
              <span className="text-gray-700 font-medium">Subtotal</span>
              <span className="font-bold text-gray-900 text-lg">
                {formatCurrency(transaction.subtotal)}
              </span>
            </div>
            {transaction.discount > 0 && (
              <div className="flex justify-between items-center pb-3 border-b border-green-200 bg-green-50 px-4 py-3 rounded-lg">
                <span className="text-green-700 font-bold">
                  Discount{" "}
                  {transaction.discountCode && `(${transaction.discountCode})`}
                </span>
                <span className="font-bold text-green-600 text-lg">
                  -{formatCurrency(transaction.discount)}
                </span>
              </div>
            )}
            <div className="flex justify-between items-center pb-3 border-b border-gray-200">
              <span className="text-gray-700 font-medium">Shipping</span>
              <span className="font-bold text-lg">
                {transaction.shipping === 0 ? (
                  <span className="text-green-600">FREE 🎁</span>
                ) : (
                  <span className="text-gray-900">
                    {formatCurrency(transaction.shipping)}
                  </span>
                )}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-700 font-medium">Tax (8%)</span>
              <span className="font-bold text-gray-900 text-lg">
                {formatCurrency(transaction.tax)}
              </span>
            </div>
          </div>
        </div>

        {/* Total */}
        <div className="mb-10 pb-10 bg-gradient-to-br from-orange-600 to-orange-700 p-8 rounded-xl text-white shadow-lg">
          <p className="text-orange-100 text-sm font-bold mb-2 tracking-wide">
            AMOUNT PAID
          </p>
          <div className="flex justify-between items-baseline">
            <span className="text-2xl font-bold">Total Due</span>
            <span className="text-5xl font-black">
              {formatCurrency(transaction.total)}
            </span>
          </div>
        </div>

        {/* Payment Info */}
        <div className="mb-10 pb-10 border-b-2 border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
            <span className="bg-indigo-100 text-indigo-600 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">
              💳
            </span>
            Payment Details
          </h3>
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="bg-indigo-50 p-6 rounded-lg border-2 border-indigo-100">
              <p className="text-xs font-bold text-indigo-600 mb-2 tracking-wide">
                PAYMENT METHOD
              </p>
              <p className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                {transaction.paymentMethod === "credit"
                  ? "💳 Credit Card"
                  : transaction.paymentMethod === "debit"
                    ? "🏧 Debit Card"
                    : "🅿️ PayPal"}
              </p>
              <p className="text-xs text-indigo-700 font-medium mt-2">
                ✓ Secure & Encrypted
              </p>
            </div>
            <div className="bg-slate-50 p-6 rounded-lg border-2 border-slate-100">
              <p className="text-xs font-bold text-slate-600 mb-2 tracking-wide">
                TRANSACTION DATE
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {new Date(transaction.date).toLocaleDateString("en-US", {
                  weekday: "short",
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </p>
              <p className="text-xs text-slate-700 font-medium mt-2">
                📅 {new Date(transaction.date).toLocaleTimeString()}
              </p>
            </div>
          </div>
        </div>

        {/* Footer Message */}
        <div className="text-center mb-8 p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border-2 border-green-200">
          <p className="text-lg font-bold text-green-900 mb-2">
            ✓ Order Confirmed!
          </p>
          <p className="text-green-700 font-medium">
            Thank you for your purchase! Your order has been confirmed and will
            be processed shortly. You'll receive a tracking number via email.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          {onDownload && (
            <Button
              onClick={onDownload}
              className="flex-1 bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white font-bold py-6 gap-2 shadow-lg hover:shadow-xl transition-all text-base"
            >
              <Download className="h-5 w-5" />
              Download Receipt
            </Button>
          )}
          {onShare && (
            <Button
              onClick={onShare}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-6 gap-2 shadow-lg hover:shadow-xl transition-all text-base"
            >
              <Share2 className="h-5 w-5" />
              Share Receipt
            </Button>
          )}
        </div>

        {/* Receipt Footer */}
        <div className="mt-8 pt-8 border-t-2 border-gray-100 text-center text-sm text-gray-600 space-y-2">
          <p className="font-medium">Questions? Contact us anytime</p>
          <p>support@freshmarket.com | +234 (0) 700 000 0000</p>
        </div>
      </CardContent>
    </Card>
  );
}
