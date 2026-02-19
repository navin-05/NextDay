import React, { createContext, useContext, useState, useEffect } from "react";

interface UserContextType {
  displayName: string;
  setDisplayName: (name: string) => void;
  dailyBudget: number;
  setDailyBudget: (budget: number) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [displayName, setDisplayNameState] = useState("User");
  const [dailyBudget, setDailyBudgetState] = useState(500);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const savedName = localStorage.getItem("displayName");
    const savedBudget = localStorage.getItem("dailyBudget");

    if (savedName) setDisplayNameState(savedName);
    if (savedBudget) setDailyBudgetState(parseInt(savedBudget, 10));

    setIsLoaded(true);
  }, []);

  const setDisplayName = (name: string) => {
    setDisplayNameState(name);
    localStorage.setItem("displayName", name);
  };

  const setDailyBudget = (budget: number) => {
    setDailyBudgetState(budget);
    localStorage.setItem("dailyBudget", budget.toString());
  };

  if (!isLoaded) return <>{children}</>;

  return (
    <UserContext.Provider value={{ displayName, setDisplayName, dailyBudget, setDailyBudget }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within UserProvider");
  }
  return context;
}
