import React, { createContext, useContext, useState, useEffect } from "react";
import { api } from "../lib/api";
import { useAuth } from "./AuthContext";

export interface TransactionItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  category: string;
  image: string;
  unit: string;
}

export interface Transaction {
  id: string;
  orderId: string;
  date: string;
  items: TransactionItem[];
  subtotal: number;
  discount: number;
  discountCode?: string;
  shipping: number;
  tax: number;
  total: number;
  paymentMethod: "credit" | "debit" | "paypal";
  status: "completed" | "pending" | "failed";
  customerName?: string;
  customerEmail?: string;
  address?: string;
  phone?: string;
}

interface TransactionContextType {
  transactions: Transaction[];
  addTransaction: (transaction: Omit<Transaction, "id">) => Promise<Transaction>;
  getTransaction: (id: string) => Transaction | undefined;
  deleteTransaction: (id: string) => Promise<void>;
  updateTransactionStatus: (id: string, status: Transaction["status"]) => Promise<void>;
  isLoading: boolean;
}

const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

export function TransactionProvider({ children }: { children: React.ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user, isAdmin } = useAuth();

  useEffect(() => {
    if (!user) {
      setTransactions([]);
      return;
    }
    loadTransactions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, isAdmin]);

  const loadTransactions = async () => {
    setIsLoading(true);
    try {
      const path = isAdmin ? "/orders/admin/all" : "/orders";
      const data = await api.get<Transaction[]>(path);
      setTransactions(data);
    } catch (err) {
      console.error("Error loading transactions:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const addTransaction = async (transaction: Omit<Transaction, "id">): Promise<Transaction> => {
    const created = await api.post<Transaction>("/orders", transaction);
    setTransactions((prev) => [created, ...prev]);
    return created;
  };

  const updateTransactionStatus = async (id: string, status: Transaction["status"]) => {
    await api.patch(`/orders/${id}/status`, { status });
    setTransactions((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t)));
  };

  const getTransaction = (id: string): Transaction | undefined => {
    return transactions.find((t) => t.id === id);
  };

  const deleteTransaction = async (id: string): Promise<void> => {
    await api.delete(`/orders/${id}`);
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <TransactionContext.Provider
      value={{
        transactions,
        addTransaction,
        getTransaction,
        deleteTransaction,
        updateTransactionStatus,
        isLoading,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
}

export function useTransaction() {
  const context = useContext(TransactionContext);
  if (!context) {
    throw new Error("useTransaction must be used within a TransactionProvider");
  }
  return context;
}
