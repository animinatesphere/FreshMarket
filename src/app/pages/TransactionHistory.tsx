import { Link } from "react-router";
import { useTransaction } from "../context/TransactionContext";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { formatCurrency } from "../utils/currency";
import { Eye, Trash2 } from "lucide-react";

export function TransactionHistory() {
  const { transactions, deleteTransaction } = useTransaction();
  const { user } = useAuth();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-600 to-orange-700 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl mb-2">Transaction History</h1>
          <p className="text-orange-100">
            View and manage all your orders and receipts
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {transactions.length === 0 ? (
          <Card className="border-0 shadow-lg">
            <CardContent className="p-12 text-center">
              <div className="mb-4">
                <div className="text-5xl mb-4">📦</div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                  No Transactions Yet
                </h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  You haven't made any purchases yet. Start shopping to see your
                  transaction history here.
                </p>
              </div>
              <Link to="/products">
                <Button className="mt-6 bg-orange-600 hover:bg-orange-700">
                  Start Shopping
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-0 shadow-lg overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b">
              <CardTitle>All Transactions</CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                {transactions.length} transaction
                {transactions.length !== 1 ? "s" : ""}
              </p>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                        Order ID
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                        Items
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                        Total
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {transactions.map((transaction) => (
                      <tr
                        key={transaction.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <span className="font-medium text-gray-900">
                            {transaction.orderId}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-600">
                            {formatDate(transaction.date)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-600">
                            {transaction.items.length} item
                            {transaction.items.length !== 1 ? "s" : ""}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-semibold text-gray-900">
                            {formatCurrency(transaction.total)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                              transaction.status === "completed"
                                ? "bg-green-100 text-green-700"
                                : transaction.status === "pending"
                                  ? "bg-yellow-100 text-yellow-700"
                                  : "bg-red-100 text-red-700"
                            }`}
                          >
                            {transaction.status.charAt(0).toUpperCase() +
                              transaction.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <Link to={`/receipt/${transaction.id}`}>
                              <button
                                className="inline-flex items-center justify-center h-9 w-9 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors"
                                title="View Receipt"
                              >
                                <Eye className="h-4 w-4" />
                              </button>
                            </Link>
                            <button
                              onClick={() => deleteTransaction(transaction.id)}
                              className="inline-flex items-center justify-center h-9 w-9 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
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
              <div className="mt-8 pt-8 border-t grid sm:grid-cols-3 gap-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-orange-600">
                    {transactions.length}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Total Orders</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-green-600">
                    {
                      transactions.filter((t) => t.status === "completed")
                        .length
                    }
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Completed</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-orange-600">
                    {formatCurrency(
                      transactions.reduce((sum, t) => sum + t.total, 0),
                    )}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Total Spent</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
