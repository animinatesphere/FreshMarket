import { Transaction } from "../context/TransactionContext";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader } from "./ui/card";
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
      <div className="relative bg-primary px-8 sm:px-12 py-12 text-primary-foreground overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-accent rounded-full blur-3xl opacity-20" />
        <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-primary-foreground rounded-full blur-3xl opacity-10" />
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-5xl mb-2">✓ Order Confirmed</h1>
              <p className="text-primary-foreground/80 text-lg">Thank you for your purchase!</p>
            </div>
            <div className="text-6xl">🎉</div>
          </div>
          <div className="grid sm:grid-cols-2 gap-6 mt-8">
            <div className="bg-primary-foreground/15 backdrop-blur-sm rounded-lg p-4">
              <p className="text-primary-foreground/70 text-sm font-medium">Order ID</p>
              <p className="text-xl font-bold mt-1">{transaction.orderId}</p>
            </div>
            <div className="bg-primary-foreground/15 backdrop-blur-sm rounded-lg p-4">
              <p className="text-primary-foreground/70 text-sm font-medium">Date & Time</p>
              <p className="text-xl font-bold mt-1">{formatDate(transaction.date)}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-card">
        {/* Status Badge */}
        <div className="px-8 sm:px-12 py-6 bg-muted/40 border-b-2 border-border">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold">Order Status</h2>
            <span
              className={`px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 ${
                transaction.status === "completed"
                  ? "bg-primary/10 text-primary"
                  : transaction.status === "pending"
                    ? "bg-accent/15 text-accent"
                    : "bg-destructive/10 text-destructive"
              }`}
            >
              {transaction.status === "completed" && "✓"}
              {transaction.status === "pending" && "⏳"}
              {transaction.status === "failed" && "✗"}
              {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
            </span>
          </div>
        </div>
      </div>
      <CardHeader className="hidden" />

      <CardContent className="p-8 sm:p-12 bg-card">
        {/* Store Info */}
        <div className="mb-10 pb-10 border-b-2 border-border">
          <div className="flex items-center gap-3 mb-6">
            <div className="text-4xl">🥬</div>
            <div>
              <h2 className="text-3xl">FreshMarket</h2>
              <p className="text-sm text-muted-foreground font-medium">Organic Fresh & Natural Foods</p>
            </div>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-secondary p-3 rounded-lg">
                <MapPin className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-bold">Address</p>
                <p className="font-medium text-sm">123 Fresh Street, Lagos</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-secondary p-3 rounded-lg">
                <Phone className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-bold">Phone</p>
                <p className="font-medium text-sm">+234 (0) 700 000 0000</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-secondary p-3 rounded-lg">
                <Mail className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-bold">Email</p>
                <p className="font-medium text-sm">support@freshmarket.com</p>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Info */}
        {transaction.customerName && (
          <div className="mb-10 pb-10 border-b-2 border-border">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <span className="bg-secondary text-primary w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">👤</span>
              Customer Information
            </h3>
            <div className="bg-secondary/60 rounded-lg p-6 border-2 border-border space-y-3">
              {transaction.customerName && (
                <div>
                  <p className="text-xs font-bold text-muted-foreground mb-1">FULL NAME</p>
                  <p className="text-lg font-semibold">{transaction.customerName}</p>
                </div>
              )}
              {transaction.customerEmail && (
                <div>
                  <p className="text-xs font-bold text-muted-foreground mb-1">EMAIL ADDRESS</p>
                  <p className="text-base font-medium">{transaction.customerEmail}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Order Items */}
        <div className="mb-10 pb-10 border-b-2 border-border">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
            <span className="bg-secondary text-primary w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">🛍️</span>
            Order Items ({transaction.items.length})
          </h3>
          <div className="space-y-4">
            {transaction.items.map((item, idx) => (
              <div
                key={idx}
                className="flex gap-4 p-5 bg-muted/30 rounded-lg border-2 border-border hover:border-accent/40 transition-colors"
              >
                <img src={item.image} alt={item.name} className="h-20 w-20 rounded-lg object-cover shadow-md flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-bold line-clamp-2">{item.name}</p>
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    <span className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded font-bold">
                      {item.category}
                    </span>
                    <span className="text-sm text-muted-foreground font-medium">
                      {formatCurrency(item.price)}/{item.unit}
                    </span>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="inline-flex items-center gap-2 bg-muted px-3 py-1 rounded-lg mb-2">
                    <span className="text-sm font-bold">×{item.quantity}</span>
                  </div>
                  <p className="text-lg font-bold">{formatCurrency(item.price * item.quantity)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div className="mb-10 pb-10 border-b-2 border-border">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
            <span className="bg-secondary text-primary w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">📊</span>
            Pricing Breakdown
          </h3>
          <div className="space-y-4 bg-muted/30 p-6 rounded-lg border-2 border-border">
            <div className="flex justify-between items-center pb-3 border-b border-border">
              <span className="font-medium">Subtotal</span>
              <span className="font-bold text-lg">{formatCurrency(transaction.subtotal)}</span>
            </div>
            {transaction.discount > 0 && (
              <div className="flex justify-between items-center pb-3 border-b border-primary/20 bg-primary/10 px-4 py-3 rounded-lg">
                <span className="text-primary font-bold">
                  Discount {transaction.discountCode && `(${transaction.discountCode})`}
                </span>
                <span className="font-bold text-primary text-lg">-{formatCurrency(transaction.discount)}</span>
              </div>
            )}
            <div className="flex justify-between items-center pb-3 border-b border-border">
              <span className="font-medium">Shipping</span>
              <span className="font-bold text-lg">
                {transaction.shipping === 0 ? <span className="text-primary">FREE 🎁</span> : formatCurrency(transaction.shipping)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium">Tax (8%)</span>
              <span className="font-bold text-lg">{formatCurrency(transaction.tax)}</span>
            </div>
          </div>
        </div>

        {/* Total */}
        <div className="mb-10 pb-10 bg-primary p-8 rounded-xl text-primary-foreground shadow-lg">
          <p className="text-primary-foreground/70 text-sm font-bold mb-2 tracking-wide">AMOUNT PAID</p>
          <div className="flex justify-between items-baseline">
            <span className="text-2xl font-bold">Total Due</span>
            <span className="text-5xl font-bold">{formatCurrency(transaction.total)}</span>
          </div>
        </div>

        {/* Payment Info */}
        <div className="mb-10 pb-10 border-b-2 border-border">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
            <span className="bg-secondary text-primary w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">💳</span>
            Payment Details
          </h3>
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="bg-secondary/60 p-6 rounded-lg border-2 border-border">
              <p className="text-xs font-bold text-muted-foreground mb-2 tracking-wide">PAYMENT METHOD</p>
              <p className="text-2xl font-bold flex items-center gap-2">
                {transaction.paymentMethod === "credit"
                  ? "💳 Credit Card"
                  : transaction.paymentMethod === "debit"
                    ? "🏧 Debit Card"
                    : "🅿️ PayPal"}
              </p>
              <p className="text-xs text-primary font-medium mt-2">✓ Secure & Encrypted</p>
            </div>
            <div className="bg-muted/40 p-6 rounded-lg border-2 border-border">
              <p className="text-xs font-bold text-muted-foreground mb-2 tracking-wide">TRANSACTION DATE</p>
              <p className="text-2xl font-bold">
                {new Date(transaction.date).toLocaleDateString("en-US", { weekday: "short", year: "numeric", month: "short", day: "numeric" })}
              </p>
              <p className="text-xs text-muted-foreground font-medium mt-2">
                📅 {new Date(transaction.date).toLocaleTimeString()}
              </p>
            </div>
          </div>
        </div>

        {/* Footer Message */}
        <div className="text-center mb-8 p-6 bg-secondary/60 rounded-lg border-2 border-border">
          <p className="text-lg font-bold text-primary mb-2">✓ Order Confirmed!</p>
          <p className="text-foreground/80 font-medium">
            Thank you for your purchase! Your order has been confirmed and will
            be processed shortly. You'll receive a tracking number via email.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          {onDownload && (
            <Button onClick={onDownload} className="flex-1 py-6 gap-2 shadow-lg text-base">
              <Download className="h-5 w-5" />
              Download Receipt
            </Button>
          )}
          {onShare && (
            <Button onClick={onShare} variant="secondary" className="flex-1 py-6 gap-2 shadow-lg text-base">
              <Share2 className="h-5 w-5" />
              Share Receipt
            </Button>
          )}
        </div>

        {/* Receipt Footer */}
        <div className="mt-8 pt-8 border-t-2 border-border text-center text-sm text-muted-foreground space-y-2">
          <p className="font-medium">Questions? Contact us anytime</p>
          <p>support@freshmarket.com | +234 (0) 700 000 0000</p>
        </div>
      </CardContent>
    </Card>
  );
}
