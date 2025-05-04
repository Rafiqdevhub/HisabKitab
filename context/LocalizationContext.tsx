import React, { createContext, useContext, useState } from "react";

interface Translations {
  [key: string]: {
    [key: string]: string;
  };
}

const translations: Translations = {
  en: {
    settings: "Settings",
    preferences: "Preferences",
    currency: "Currency",
    language: "Language",
    darkMode: "Dark Mode",
    categories: "Expense Categories",
    addNew: "Add New",
    categoryName: "Category Name",
    cancel: "Cancel",
    selectCurrency: "Select Currency",
    selectLanguage: "Select Language",
    addCategory: "Add Category",
    customizePreferences: "Customize your app preferences",
  },
  ur: {
    settings: "ترتیبات",
    preferences: "ترجیحات",
    currency: "کرنسی",
    language: "زبان",
    darkMode: "ڈارک موڈ",
    categories: "اخراجات کی اقسام",
    addNew: "نیا شامل کریں",
    categoryName: "قسم کا نام",
    cancel: "منسوخ کریں",
    selectCurrency: "کرنسی منتخب کریں",
    selectLanguage: "زبان منتخب کریں",
    addCategory: "قسم شامل کریں",
    customizePreferences: "اپنی ایپ کی ترجیحات کو اپنی مرضی کے مطابق بنائیں",
  },
};

interface LocalizationContextType {
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: string) => string;
}

const LocalizationContext = createContext<LocalizationContextType | undefined>(
  undefined
);

export const LocalizationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [language, setLanguage] = useState("en");

  const t = (key: string): string => {
    return translations[language]?.[key] || translations["en"][key] || key;
  };

  return (
    <LocalizationContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LocalizationContext.Provider>
  );
};

export const useLocalization = () => {
  const context = useContext(LocalizationContext);
  if (context === undefined) {
    throw new Error(
      "useLocalization must be used within a LocalizationProvider"
    );
  }
  return context;
};
