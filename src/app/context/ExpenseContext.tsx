import React, { createContext, useContext, useState, useEffect } from "react";

export interface Expense {
  id: string;
  amount: number;
  merchant: string;
  category: string;
  note: string;
  timestamp: number;
  date: string; // YYYY-MM-DD format
}

interface ExpenseContextType {
  expenses: Expense[];
  addExpense: (expense: Omit<Expense, "id" | "timestamp">) => void;
  deleteExpense: (id: string) => void;
  updateExpense: (id: string, expense: Omit<Expense, "id" | "timestamp" | "date">) => void;
  getExpensesByDate: (date: string) => Expense[];
}

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

// (Removed daily reset helpers that cleared all expenses on a new day)

export function ExpenseProvider({ children }: { children: React.ReactNode }) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const savedExpenses = localStorage.getItem("expenses");
    if (savedExpenses) {
      try {
        setExpenses(JSON.parse(savedExpenses));
      } catch (error) {
        console.error("Failed to parse expenses from localStorage", error);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage whenever expenses change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("expenses", JSON.stringify(expenses));
    }
  }, [expenses, isLoaded]);

  const addExpense = (expense: Omit<Expense, "id" | "timestamp">) => {
    const newExpense: Expense = {
      ...expense,
      id: Date.now().toString(),
      timestamp: Date.now(),
    };
    setExpenses((prev) => [newExpense, ...prev]);
  };

  const deleteExpense = (id: string) => {
    setExpenses((prev) => prev.filter((exp) => exp.id !== id));
  };

  const updateExpense = (id: string, expense: Omit<Expense, "id" | "timestamp" | "date">) => {
    setExpenses((prev) =>
      prev.map((exp) =>
        exp.id === id
          ? {
              ...exp,
              ...expense,
            }
          : exp
      )
    );
  };

  const getExpensesByDate = (date: string): Expense[] => {
    return expenses.filter((exp) => exp.date === date);
  };

  if (!isLoaded) return <>{children}</>;

  return (
    <ExpenseContext.Provider value={{ expenses, addExpense, deleteExpense, updateExpense, getExpensesByDate }}>
      {children}
    </ExpenseContext.Provider>
  );
}

export function useExpense() {
  const context = useContext(ExpenseContext);
  if (!context) {
    throw new Error("useExpense must be used within ExpenseProvider");
  }
  return context;
}
