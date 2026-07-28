import { Link } from "react-router";
import { useTransaction } from "../context/TransactionContext";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { formatCurrency } from "../utils/currency";
import { Eye, Trash2, Package } from "lucide-react";

export function TransactionHistory() {
  const { transactions, deleteTransaction } = useTransaction();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const statusClasses = (status: string) =>
    status === "completed"
      ? "bg-primary/10 text-primary"
      : status === "pending"
        ? "bg-accent/15 text-accent"
        : "bg-destructive/10 text-destructive";

  return (
    <div className="bg-background min-h-screen">
      {/* Header */}
      <div className="bg-primary text-primary-foreground py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl mb-2">Transaction History</h1>
          <p className="text-primary-foreground/80">
            View and manage all your orders and receipts
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {transactions.length === 0 ? (
          <Card className="border-0 shadow-md">
            <CardContent className="p-12 text-center">
              <div className="mb-4">
                <Package className="h-14 w-14 text-muted-foreground/30 mx-auto mb-4" />
                <h3 className="text-2xl mb-2">No Transactions Yet</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  You haven't made any purchases yet. Start shopping to see your
                  transaction history here.
                </p>
              </div>
              <Link to="/products">
                <Button className="mt-6">Start Shopping</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-0 shadow-md overflow-hidden">
            <CardHeader className="bg-muted/40 border-b border-border">
              <CardTitle>All Transactions</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {transactions.length} transaction
                {transactions.length !== 1 ? "s" : ""}
              </p>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/40 border-b border-border">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold">Order ID</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold">Date</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold">Items</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold">Total</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {transactions.map((transaction) => (
                      <tr key={transaction.id} className="hover:bg-muted/30 transition-colors">
                        <td className="px-6 py-4">
                          <span className="font-medium">{transaction.orderId}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-muted-foreground">{formatDate(transaction.date)}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-muted-foreground">
                            {transaction.items.length} item{transaction.items.length !== 1 ? "s" : ""}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-semibold">{formatCurrency(transaction.total)}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${statusClasses(transaction.status)}`}>
                            {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <Link to={`/receipt/${transaction.id}`}>
                              <button
                                className="inline-flex items-center justify-center h-9 w-9 rounded-lg bg-secondary text-secondary-foreground hover:bg-accent/20 transition-colors"
                                title="View Receipt"
                              >
                                <Eye className="h-4 w-4" />
                              </button>
                            </Link>
                            <button
                              onClick={() => deleteTransaction(transaction.id)}
                              className="inline-flex items-center justify-center h-9 w-9 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors"
                              title="Delete Transaction"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Summary Stats */}
              <div className="mt-8 pt-8 border-t border-border grid sm:grid-cols-3 gap-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-primary">{transactions.length}</p>
                  <p className="text-sm text-muted-foreground mt-1">Total Orders</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-primary">
                    {transactions.filter((t) => t.status === "completed").length}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">Completed</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-accent">
                    {formatCurrency(transactions.reduce((sum, t) => sum + t.total, 0))}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">Total Spent</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
