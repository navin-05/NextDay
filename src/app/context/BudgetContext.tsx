import React, { createContext, useContext, useState, useEffect } from "react";

export interface BudgetDay {
  date: string; // Format: "YYYY-MM-DD"
  dailyBudget: number;
  spent: number;
  carryForward: number;
  lastUpdated: number; // timestamp
}

interface BudgetContextType {
  budgetHistory: BudgetDay[];
  addBudgetDay: (budgetDay: BudgetDay) => void;
  updateBudgetDay: (date: string, budgetDay: Partial<BudgetDay>) => void;
  getBudgetDayByDate: (date: string) => BudgetDay | undefined;
  getTodayBudget: () => BudgetDay | undefined;
  getBudgetHistoryForMonth: (year: number, month: number) => BudgetDay[];
  getBudgetHistoryForYear: (year: number) => BudgetDay[];
  clearBudgetHistory: () => void;
}

const BudgetContext = createContext<BudgetContextType | undefined>(undefined);

export function BudgetProvider({ children }: { children: React.ReactNode }) {
  const [budgetHistory, setBudgetHistory] = useState<BudgetDay[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("budgetHistory");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setBudgetHistory(parsed);
      } catch (e) {
        console.error("Failed to parse budget history from localStorage:", e);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage whenever budgetHistory changes
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("budgetHistory", JSON.stringify(budgetHistory));
    }
  }, [budgetHistory, isLoaded]);

  const getFormattedDate = (date?: Date): string => {
    const d = date || new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const addBudgetDay = (budgetDay: BudgetDay) => {
    setBudgetHistory((prev) => {
      // Check if entry for this date already exists
      const existingIndex = prev.findIndex((b) => b.date === budgetDay.date);
      if (existingIndex >= 0) {
        // Update existing entry
        const updated = [...prev];
        updated[existingIndex] = budgetDay;
        return updated;
      }
      // Add new entry
      return [...prev, budgetDay];
    });
  };

  const updateBudgetDay = (date: string, updates: Partial<BudgetDay>) => {
    setBudgetHistory((prev) =>
      prev.map((b) =>
        b.date === date ? { ...b, ...updates, lastUpdated: Date.now() } : b
      )
    );
  };

  const getBudgetDayByDate = (date: string): BudgetDay | undefined => {
    return budgetHistory.find((b) => b.date === date);
  };

  const getTodayBudget = (): BudgetDay | undefined => {
    return getBudgetDayByDate(getFormattedDate());
  };

  const getBudgetHistoryForMonth = (year: number, month: number): BudgetDay[] => {
    return budgetHistory.filter((b) => {
      const [bYear, bMonth] = b.date.split("-").map(Number);
      return bYear === year && bMonth === month;
    });
  };

  const getBudgetHistoryForYear = (year: number): BudgetDay[] => {
    return budgetHistory.filter((b) => {
      const [bYear] = b.date.split("-").map(Number);
      return bYear === year;
    });
  };

  const clearBudgetHistory = () => {
    setBudgetHistory([]);
  };

  if (!isLoaded) {
    return null;
  }

  return (
    <BudgetContext.Provider
      value={{
        budgetHistory,
        addBudgetDay,
        updateBudgetDay,
        getBudgetDayByDate,
        getTodayBudget,
        getBudgetHistoryForMonth,
        getBudgetHistoryForYear,
        clearBudgetHistory,
      }}
    >
      {children}
    </BudgetContext.Provider>
  );
}

export function useBudget() {
  const context = useContext(BudgetContext);
  if (context === undefined) {
    throw new Error("useBudget must be used within a BudgetProvider");
  }
  return context;
}
