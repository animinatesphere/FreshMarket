import { useParams, useNavigate, Link } from "react-router";
import { useTransaction } from "../context/TransactionContext";
import { Receipt } from "../components/Receipt";
import { Button } from "../components/ui/button";
import { ArrowLeft, Download } from "lucide-react";

export function ReceiptPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getTransaction } = useTransaction();

  const transaction = id ? getTransaction(id) : null;

  if (!transaction) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h2 className="text-3xl mb-4">Receipt Not Found</h2>
          <p className="text-gray-600 mb-8">
            The receipt you're looking for doesn't exist.
          </p>
          <Link to="/transaction-history">
            <Button className="bg-orange-600 hover:bg-orange-700 gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Transaction History
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleDownloadPDF = () => {
    // Simple PDF generation simulation
    const element = document.getElementById("receipt-content");
    if (element) {
      const printWindow = window.open("", "", "width=800,height=600");
      if (printWindow) {
        printWindow.document.write(element.innerHTML);
        printWindow.document.close();
        printWindow.print();
      }
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-orange-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl mb-2">Order Receipt</h1>
          <p className="text-orange-100">Order ID: {transaction.orderId}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-6">
          <Button
            onClick={() => navigate("/transaction-history")}
            variant="outline"
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Transactions
          </Button>
        </div>

        <div id="receipt-content">
          <Receipt transaction={transaction} onDownload={handleDownloadPDF} />
        </div>

        <div className="mt-12 text-center">
          <Link to="/products">
            <Button className="bg-orange-600 hover:bg-orange-700">
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
