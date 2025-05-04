import React, { createContext, useContext, useState } from "react";

interface Category {
  id: string;
  title: string;
  icon: string;
  iconColor: string;
  bgColor: string;
  budget: number;
  spent: number;
  isDefault?: boolean; // New property to mark default categories
}

interface BudgetContextType {
  totalBudget: number;
  setTotalBudget: (amount: number) => void;
  categories: Category[];
  updateCategoryBudget: (id: string, amount: number) => void;
  addCategory: (category: Category) => void;
  removeCategory: (id: string) => void;
}

const defaultCategories: Category[] = [
  {
    id: "food",
    title: "Food",
    icon: "utensils",
    iconColor: "bg-green-500",
    bgColor: "bg-green-50",
    budget: 20000,
    spent: 0,
    isDefault: true,
  },
  {
    id: "bills",
    title: "Bills",
    icon: "file-invoice",
    iconColor: "bg-blue-500",
    bgColor: "bg-blue-50",
    budget: 15000,
    spent: 0,
    isDefault: true,
  },
  {
    id: "transport",
    title: "Transport",
    icon: "car",
    iconColor: "bg-yellow-500",
    bgColor: "bg-yellow-50", // Changed from bg-yellow-100 to bg-yellow-50 to match icon style
    budget: 10000,
    spent: 0,
    isDefault: true,
  },
  {
    id: "doctor",
    title: "Doctor",
    icon: "user-md",
    iconColor: "bg-red-500",
    bgColor: "bg-red-50", // Changed from bg-red-100 to bg-red-50 to match icon style
    budget: 5000,
    spent: 0,
    isDefault: true,
  },
  {
    id: "shopping",
    title: "Shopping",
    icon: "shopping-bag",
    iconColor: "bg-purple-500",
    bgColor: "bg-purple-50",
    budget: 10000,
    spent: 0,
    isDefault: true,
  },
];

const BudgetContext = createContext<BudgetContextType | undefined>(undefined);

export const BudgetProvider = ({ children }: { children: React.ReactNode }) => {
  const [totalBudget, setTotalBudget] = useState(0);
  const [categories, setCategories] = useState<Category[]>(defaultCategories);

  const updateCategoryBudget = (id: string, amount: number) => {
    setCategories((prev) =>
      prev.map((cat) => (cat.id === id ? { ...cat, budget: amount } : cat))
    );
  };

  const addCategory = (category: Category) => {
    setCategories((prev) => [...prev, { ...category, isDefault: false }]);
  };

  const removeCategory = (id: string) => {
    setCategories((prev) =>
      prev.filter((cat) => cat.isDefault || cat.id !== id)
    );
  };

  return (
    <BudgetContext.Provider
      value={{
        totalBudget,
        setTotalBudget,
        categories,
        updateCategoryBudget,
        addCategory,
        removeCategory,
      }}
    >
      {children}
    </BudgetContext.Provider>
  );
};

export const useBudget = () => {
  const context = useContext(BudgetContext);
  if (context === undefined) {
    throw new Error("useBudget must be used within a BudgetProvider");
  }
  return context;
};
