import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../utils/supabase";
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
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setTransactions([]);
      return;
    }
    loadTransactions();
  }, [user]);

  const loadTransactions = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const { data: orders, error } = await supabase
        .from("orders")
        .select("*, order_items(*)")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      const mapped: Transaction[] = (orders || []).map((order: any) => ({
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
      }));

      setTransactions(mapped);
    } catch (err) {
      console.error("Error loading transactions:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const addTransaction = async (transaction: Omit<Transaction, "id">): Promise<Transaction> => {
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        order_id: transaction.orderId,
        user_id: user?.id,
        customer_name: transaction.customerName,
        customer_email: transaction.customerEmail,
        subtotal: transaction.subtotal,
        discount: transaction.discount,
        discount_code: transaction.discountCode,
        shipping: transaction.shipping,
        tax: transaction.tax,
        total: transaction.total,
        payment_method: transaction.paymentMethod,
        status: transaction.status,
        address: transaction.address,
        phone_number: transaction.phone,
      })
      .select()
      .single();

    if (orderError) throw new Error(orderError.message);

    if (transaction.items.length > 0) {
      const { error: itemsError } = await supabase.from("order_items").insert(
        transaction.items.map((item) => ({
          order_id: order.id,
          product_id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          category: item.category,
          image: item.image,
          unit: item.unit,
        }))
      );
      if (itemsError) throw new Error(itemsError.message);
    }

    const newTransaction: Transaction = {
      ...transaction,
      id: order.id,
      date: order.created_at,
    };

    setTransactions((prev) => [newTransaction, ...prev]);
    return newTransaction;
  };

  const updateTransactionStatus = async (id: string, status: Transaction["status"]) => {
    const { error } = await supabase
      .from("orders")
      .update({ status })
      .eq("id", id);
    if (error) throw new Error(error.message);
    setTransactions(prev => prev.map(t => t.id === id ? { ...t, status } : t));
  };

  const getTransaction = (id: string): Transaction | undefined => {
    return transactions.find((t) => t.id === id);
  };

  const deleteTransaction = async (id: string): Promise<void> => {
    const { error } = await supabase.from("orders").delete().eq("id", id);
    if (error) throw new Error(error.message);
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
