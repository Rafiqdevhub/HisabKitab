import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

// Define types for our context
export type CategoryType = {
  id: number;
  name: string;
  icon: string;
  amount: number;
  budget: number;
  color: string;
  bgColor: string;
};

export type TransactionType = {
  date: string;
  description: string;
  amount: number;
};

export type CategoryTransactionsType = {
  [key: string]: TransactionType[];
};

// Get current month and year
const getCurrentMonth = (): string => {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    "0"
  )}`;
};

// Array of all months for dropdown
export const months = [
  { value: "01", label: "January" },
  { value: "02", label: "February" },
  { value: "03", label: "March" },
  { value: "04", label: "April" },
  { value: "05", label: "May" },
  { value: "06", label: "June" },
  { value: "07", label: "July" },
  { value: "08", label: "August" },
  { value: "09", label: "September" },
  { value: "10", label: "October" },
  { value: "11", label: "November" },
  { value: "12", label: "December" },
];

export const getMonthName = (monthKey: string): string => {
  const [year, month] = monthKey.split("-");
  const monthObj = months.find((m) => m.value === month);
  return `${monthObj?.label || "Unknown"} ${year}`;
};

type BudgetContextType = {
  totalBudget: number;
  setTotalBudget: (budget: number) => void;
  spentAmount: number;
  categorySpending: CategoryType[];
  setCategorySpending: (categories: CategoryType[]) => void;
  categoryTransactions: CategoryTransactionsType;
  setCategoryTransactions: (transactions: CategoryTransactionsType) => void;
  addTransaction: (categoryName: string, transaction: TransactionType) => void;
  deleteTransaction: (
    categoryName: string,
    transactionDate: string,
    transactionAmount: number
  ) => void;
  saveBudgetData: () => Promise<void>;
  loadBudgetData: () => Promise<void>;
  currencySymbol: string;
  setCurrencySymbol: (symbol: string) => void;
  resetAllBudgets: () => void;
  resetCategoryBudget: (categoryId: number) => void;
  currentMonth: string;
  setCurrentMonth: (month: string) => void;
  availableMonths: string[];
  getMonthName: (monthKey: string) => string;
};

const BudgetContext = createContext<BudgetContextType | undefined>(undefined);

export const useBudget = () => {
  const context = useContext(BudgetContext);
  if (!context) {
    throw new Error("useBudget must be used within a BudgetProvider");
  }
  return context;
};

type BudgetProviderProps = {
  children: ReactNode;
};

// Initial categories data structure
const initialCategories: CategoryType[] = [
  {
    id: 1,
    name: "Food",
    icon: "utensils",
    amount: 0,
    budget: 0,
    color: "#ef4444",
    bgColor: "bg-red-100",
  },
  {
    id: 2,
    name: "Education",
    icon: "graduation-cap",
    amount: 0,
    budget: 0,
    color: "#3b82f6",
    bgColor: "bg-blue-100",
  },
  {
    id: 3,
    name: "Bills",
    icon: "file-invoice",
    amount: 0,
    budget: 0,
    color: "#f59e0b",
    bgColor: "bg-yellow-100",
  },
  {
    id: 4,
    name: "Doctor",
    icon: "user-md",
    amount: 0,
    budget: 0,
    color: "#10b981",
    bgColor: "bg-green-100",
  },
  {
    id: 5,
    name: "Transport",
    icon: "bus",
    amount: 0,
    budget: 0,
    color: "#8b5cf6",
    bgColor: "bg-purple-100",
  },
  {
    id: 6,
    name: "Grocery",
    icon: "shopping-basket",
    amount: 0,
    budget: 0,
    color: "#10b981",
    bgColor: "bg-emerald-100",
  },
  {
    id: 7,
    name: "Others",
    icon: "ellipsis-h",
    amount: 0,
    budget: 0,
    color: "#6b7280",
    bgColor: "bg-gray-100",
  },
];

// Initial transactions structure
const initialTransactions: CategoryTransactionsType = {
  Food: [],
  Education: [],
  Bills: [],
  Doctor: [],
  Transport: [],
  Grocery: [],
  Others: [],
};

export const BudgetProvider = ({ children }: BudgetProviderProps) => {
  const [currentMonth, setCurrentMonth] = useState(getCurrentMonth());
  const [availableMonths, setAvailableMonths] = useState<string[]>([
    currentMonth,
  ]);
  const [totalBudget, setTotalBudget] = useState(0);
  const [spentAmount, setSpentAmount] = useState(0);
  const [currencySymbol, setCurrencySymbol] = useState("PKR");

  const [categorySpending, setCategorySpending] = useState<CategoryType[]>([
    ...initialCategories,
  ]);
  const [categoryTransactions, setCategoryTransactions] =
    useState<CategoryTransactionsType>({ ...initialTransactions });
  const loadBudgetData = React.useCallback(async () => {
    try {
      const storedBudgetData = await AsyncStorage.getItem(
        `budgetData_${currentMonth}`
      );
      if (storedBudgetData) {
        const data = JSON.parse(storedBudgetData);
        setTotalBudget(data.totalBudget || 0);
        setCategorySpending(data.categorySpending || [...initialCategories]);
        setCategoryTransactions(
          data.categoryTransactions || { ...initialTransactions }
        );
      }

      // Load available months
      const storedMonths = await AsyncStorage.getItem("availableMonths");
      if (storedMonths) {
        const months = JSON.parse(storedMonths);
        setAvailableMonths(months);
      }
    } catch (error) {
      console.error("Error loading budget data:", error);
    }
  }, [currentMonth]);

  const saveBudgetData = React.useCallback(
    async (force = false) => {
      try {
        const budgetData = {
          totalBudget,
          categorySpending,
          categoryTransactions,
        };
        await AsyncStorage.setItem(
          `budgetData_${currentMonth}`,
          JSON.stringify(budgetData)
        );

        // Save available months
        if (force || !availableMonths.includes(currentMonth)) {
          const updatedMonths = [
            ...new Set([...availableMonths, currentMonth]),
          ];
          setAvailableMonths(updatedMonths);
          await AsyncStorage.setItem(
            "availableMonths",
            JSON.stringify(updatedMonths)
          );
        }
      } catch (error) {
        console.error("Error saving budget data:", error);
      }
    },
    [
      totalBudget,
      categorySpending,
      categoryTransactions,
      currentMonth,
      availableMonths,
    ]
  );

  // Calculate spent amount whenever category spending changes
  useEffect(() => {
    const totalSpent = categorySpending.reduce(
      (sum, category) => sum + category.amount,
      0
    );
    setSpentAmount(totalSpent);
  }, [categorySpending]);
  // Load budget data when month changes
  useEffect(() => {
    loadBudgetData();
  }, [loadBudgetData]);
  // Save budget data when relevant states change
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      saveBudgetData();
    }, 1000); // Debounce saves to prevent too many writes

    return () => clearTimeout(timeoutId);
  }, [
    totalBudget,
    categorySpending,
    categoryTransactions,
    currentMonth,
    saveBudgetData,
  ]);

  // Load the currency symbol
  useEffect(() => {
    const loadCurrencySymbol = async () => {
      try {
        const storedSymbol = await AsyncStorage.getItem("currencySymbol");
        if (storedSymbol) {
          setCurrencySymbol(storedSymbol);
        }
      } catch (error) {
        console.error("Error loading currency symbol:", error);
      }
    };
    loadCurrencySymbol();
  }, []);

  // Save currency symbol when it changes
  useEffect(() => {
    const saveCurrencySymbol = async () => {
      try {
        await AsyncStorage.setItem("currencySymbol", currencySymbol);
      } catch (error) {
        console.error("Error saving currency symbol:", error);
      }
    };
    saveCurrencySymbol();
  }, [currencySymbol]);

  const addTransaction = (
    categoryName: string,
    transaction: TransactionType
  ) => {
    // Add transaction to the category's transaction list
    setCategoryTransactions((prev) => ({
      ...prev,
      [categoryName]: [transaction, ...(prev[categoryName] || [])],
    }));

    // Update the category's total spent amount
    setCategorySpending((prev) =>
      prev.map((cat) =>
        cat.name === categoryName
          ? { ...cat, amount: cat.amount + transaction.amount }
          : cat
      )
    );
  };

  const deleteTransaction = (
    categoryName: string,
    transactionDate: string,
    transactionAmount: number
  ) => {
    // Update category transactions by filtering out the transaction to delete
    setCategoryTransactions((prev) => {
      const categoryTxns = prev[categoryName] || [];
      return {
        ...prev,
        [categoryName]: categoryTxns.filter(
          (txn) => txn.date !== transactionDate
        ),
      };
    });

    // Update the category spent amount by subtracting the deleted transaction amount
    setCategorySpending((prev) =>
      prev.map((cat) =>
        cat.name === categoryName
          ? { ...cat, amount: Math.max(0, cat.amount - transactionAmount) }
          : cat
      )
    );
  };

  const resetAllBudgets = () => {
    setTotalBudget(0);
    setCategorySpending(
      categorySpending.map((cat) => ({
        ...cat,
        budget: 0,
        amount: 0,
      }))
    );
    setCategoryTransactions({ ...initialTransactions });
  };

  const resetCategoryBudget = (categoryId: number) => {
    setCategorySpending((prev) =>
      prev.map((cat) =>
        cat.id === categoryId ? { ...cat, budget: 0, amount: 0 } : cat
      )
    );
    const category = categorySpending.find((cat) => cat.id === categoryId);
    if (category) {
      setCategoryTransactions((prev) => ({
        ...prev,
        [category.name]: [],
      }));
    }
  };
  const value = {
    totalBudget,
    setTotalBudget,
    spentAmount,
    categorySpending,
    setCategorySpending,
    categoryTransactions,
    setCategoryTransactions,
    addTransaction,
    deleteTransaction,
    saveBudgetData,
    loadBudgetData,
    currencySymbol,
    setCurrencySymbol,
    resetAllBudgets,
    resetCategoryBudget,
    currentMonth,
    setCurrentMonth,
    availableMonths,
    getMonthName,
  };

  return (
    <BudgetContext.Provider value={value}>{children}</BudgetContext.Provider>
  );
};
