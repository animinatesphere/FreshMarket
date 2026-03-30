import React, { createContext, useContext, useState, useEffect } from "react";

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
}

interface TransactionContextType {
  transactions: Transaction[];
  addTransaction: (transaction: Omit<Transaction, "id">) => Transaction;
  getTransaction: (id: string) => Transaction | undefined;
  deleteTransaction: (id: string) => void;
}

const TransactionContext = createContext<TransactionContextType | undefined>(
  undefined,
);

export function TransactionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // Load transactions from localStorage on mount
  useEffect(() => {
    try {
      const storedTransactions = localStorage.getItem(
        "freshmarket_transactions",
      );
      if (storedTransactions) {
        setTransactions(JSON.parse(storedTransactions));
      }
    } catch (err) {
      console.error("Error loading transactions:", err);
    }
  }, []);

  // Save transactions to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(
      "freshmarket_transactions",
      JSON.stringify(transactions),
    );
  }, [transactions]);

  const addTransaction = (
    transaction: Omit<Transaction, "id">,
  ): Transaction => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Math.random().toString(36).substr(2, 9),
    };
    setTransactions([newTransaction, ...transactions]);
    return newTransaction;
  };

  const getTransaction = (id: string): Transaction | undefined => {
    return transactions.find((t) => t.id === id);
  };

  const deleteTransaction = (id: string) => {
    setTransactions(transactions.filter((t) => t.id !== id));
  };

  return (
    <TransactionContext.Provider
      value={{
        transactions,
        addTransaction,
        getTransaction,
        deleteTransaction,
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
