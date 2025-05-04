import { FontAwesome5 } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Modal,
  ScrollView,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useBudget } from "../../context/BudgetContext";
import { useLocalization } from "../../context/LocalizationContext";
import { useTheme } from "../../context/ThemeContext";

interface SettingsCardProps {
  title: string;
  value: string;
  icon: string;
  onPress: () => void;
  bgColor?: string;
}

const SettingsCard = ({
  title,
  value,
  icon,
  onPress,
  bgColor = "bg-white",
}: SettingsCardProps) => (
  <TouchableOpacity onPress={onPress}>
    <View className={`${bgColor} p-4 rounded-xl shadow-sm m-2`}>
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center">
          <View className="bg-blue-500 w-10 h-10 rounded-full items-center justify-center mb-2">
            <FontAwesome5 name={icon} size={20} color="white" />
          </View>
          <View className="ml-3">
            <Text className="text-gray-700 font-medium">{title}</Text>
            <Text className="text-gray-900 font-bold mt-1">{value}</Text>
          </View>
        </View>
        <FontAwesome5 name="chevron-right" size={16} color="#9CA3AF" />
      </View>
    </View>
  </TouchableOpacity>
);

const Settings = () => {
  const { categories, addCategory, removeCategory } = useBudget();
  const { isDarkMode, toggleTheme, theme } = useTheme();
  const { language, setLanguage, t } = useLocalization();
  const [selectedCurrency, setSelectedCurrency] = useState("PKR");
  const [isCurrencyModalVisible, setIsCurrencyModalVisible] = useState(false);
  const [isLanguageModalVisible, setIsLanguageModalVisible] = useState(false);
  const [isCategoryModalVisible, setIsCategoryModalVisible] = useState(false);
  const [newCategoryTitle, setNewCategoryTitle] = useState("");

  const currencies = ["PKR", "USD", "EUR", "GBP", "AED"];
  const languages = [
    { code: "en", label: "English" },
    { code: "ur", label: "اردو" },
  ];

  return (
    <SafeAreaView className="flex-1 bg-gray-100" style={{ paddingBottom: 16 }}>
      <ScrollView
        showsVerticalScrollIndicator={true}
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        {/* Settings Title Card */}
        <View className="m-4">
          <View
            style={{
              backgroundColor: "#1d4ed8",
              borderRadius: 12,
              padding: 24,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 8,
            }}
          >
            {/* Large Centered Icon */}
            <View className="items-center mb-4">
              <View
                className="w-24 h-24 rounded-full items-center justify-center"
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                  borderWidth: 2,
                  borderColor: "rgba(255, 255, 255, 0.4)",
                }}
              >
                <FontAwesome5 name="cogs" size={40} color="white" />
              </View>
            </View>

            {/* Settings Title and Tagline */}
            <View className="items-center">
              <Text
                className="text-white text-4xl font-bold tracking-wider mb-2"
                style={{
                  textShadowColor: "rgba(0, 0, 0, 0.4)",
                  textShadowOffset: { width: 0, height: 2 },
                  textShadowRadius: 4,
                  letterSpacing: 2,
                  transform: [{ scale: 1.05 }],
                }}
              >
                {t("settings")}
              </Text>
              <View>
                <Text
                  className="text-white/90 text-lg text-center px-4 tracking-wide mb-4"
                  style={{
                    textShadowColor: "rgba(0, 0, 0, 0.2)",
                    textShadowOffset: { width: 0, height: 1 },
                    textShadowRadius: 2,
                    letterSpacing: 1,
                    fontStyle: "italic",
                  }}
                >
                  {t("customizePreferences")}
                </Text>
                <View
                  style={{
                    height: 2,
                    width: "40%",
                    backgroundColor: "rgba(255,255,255,0.3)",
                    alignSelf: "center",
                    borderRadius: 1,
                    marginTop: -2,
                    marginBottom: 16,
                  }}
                />
              </View>

              {/* Settings Features */}
              <View
                style={{
                  backgroundColor: "rgba(0, 0, 0, 0.2)",
                  borderRadius: 8,
                  padding: 16,
                  width: "100%",
                  marginBottom: 16,
                }}
              >
                <View className="flex-row items-center mb-3">
                  <FontAwesome5 name="check-circle" size={16} color="white" />
                  <Text className="text-white text-sm ml-2 font-medium">
                    Language & Currency Options
                  </Text>
                </View>
                <View className="flex-row items-center mb-3">
                  <FontAwesome5 name="check-circle" size={16} color="white" />
                  <Text className="text-white text-sm ml-2 font-medium">
                    Dark/Light Theme
                  </Text>
                </View>
                <View className="flex-row items-center">
                  <FontAwesome5 name="check-circle" size={16} color="white" />
                  <Text className="text-white text-sm ml-2 font-medium">
                    Category Management
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Preferences Section */}
        <View className="px-4 mt-4">
          <Text className="text-lg font-semibold text-gray-800 mb-2">
            {t("preferences")}
          </Text>

          <SettingsCard
            title={t("currency")}
            value={selectedCurrency}
            icon="money-bill-wave"
            onPress={() => setIsCurrencyModalVisible(true)}
            bgColor="bg-blue-50"
          />

          <SettingsCard
            title={t("language")}
            value={
              languages.find((l) => l.code === language)?.label || "English"
            }
            icon="language"
            onPress={() => setIsLanguageModalVisible(true)}
            bgColor="bg-purple-50"
          />

          <View className="bg-orange-50 p-4 rounded-xl shadow-sm m-2">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center">
                <View className="bg-orange-500 w-10 h-10 rounded-full items-center justify-center mb-2">
                  <FontAwesome5 name="moon" size={20} color="white" />
                </View>
                <View className="ml-3">
                  <Text className="text-gray-700 font-medium">
                    {t("darkMode")}
                  </Text>
                  <Text className="text-gray-900 font-bold mt-1">
                    {isDarkMode ? "Enabled" : "Disabled"}
                  </Text>
                </View>
              </View>
              <Switch
                value={isDarkMode}
                onValueChange={toggleTheme}
                trackColor={{ false: "#D1D5DB", true: "#93C5FD" }}
                thumbColor={isDarkMode ? "#2563EB" : "#F3F4F6"}
              />
            </View>
          </View>
        </View>

        {/* Categories Section */}
        <View className="px-4 mt-4">
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-lg font-semibold text-gray-800">
              {t("categories")}
            </Text>
            <TouchableOpacity
              onPress={() => setIsCategoryModalVisible(true)}
              className="bg-blue-600 px-4 py-2 rounded-lg"
            >
              <Text className="text-white">{t("addNew")}</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={true}
            contentContainerStyle={{ paddingRight: 16 }}
          >
            {categories.map((category) => (
              <View
                key={category.id}
                className={`${category.bgColor} p-4 rounded-xl m-2 w-32`}
                style={{
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.15,
                  shadowRadius: 4,
                  elevation: 3,
                  borderWidth: 1,
                  borderColor: "rgba(0,0,0,0.05)",
                }}
              >
                <View
                  className={`${category.iconColor} w-10 h-10 rounded-full items-center justify-center mb-2`}
                  style={{
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.1,
                    shadowRadius: 2,
                    elevation: 2,
                  }}
                >
                  <FontAwesome5 name={category.icon} size={16} color="white" />
                </View>
                <Text className="text-gray-700 font-medium mb-1">
                  {category.title}
                </Text>
                {!category.isDefault && (
                  <TouchableOpacity
                    onPress={() => removeCategory(category.id)}
                    className="mt-2"
                  >
                    <FontAwesome5 name="trash" size={16} color="#EF4444" />
                  </TouchableOpacity>
                )}
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Modals */}
        {/* Currency Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={isCurrencyModalVisible}
          onRequestClose={() => setIsCurrencyModalVisible(false)}
        >
          <View className="flex-1 justify-center items-center bg-black/50">
            <View
              style={{ backgroundColor: theme.cardBg }}
              className="w-[90%] rounded-3xl p-6 mx-4 shadow-lg"
            >
              <View className="border-b border-gray-200 pb-4 mb-4">
                <Text
                  style={{ color: theme.text }}
                  className="text-xl font-bold text-center"
                >
                  {t("selectCurrency")}
                </Text>
              </View>
              <ScrollView className="max-h-72">
                {currencies.map((currency) => (
                  <TouchableOpacity
                    key={currency}
                    onPress={() => {
                      setSelectedCurrency(currency);
                      setIsCurrencyModalVisible(false);
                    }}
                    className="py-4 border-b border-gray-100 active:bg-gray-50"
                  >
                    <Text
                      className={`text-lg text-center ${
                        selectedCurrency === currency
                          ? "text-blue-600 font-semibold"
                          : "text-gray-600"
                      }`}
                    >
                      {currency}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <TouchableOpacity
                onPress={() => setIsCurrencyModalVisible(false)}
                className="mt-4 bg-gray-100 p-4 rounded-xl active:bg-gray-200"
              >
                <Text className="text-center text-gray-600 font-semibold">
                  {t("cancel")}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Language Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={isLanguageModalVisible}
          onRequestClose={() => setIsLanguageModalVisible(false)}
        >
          <View className="flex-1 justify-center items-center bg-black/50">
            <View
              style={{ backgroundColor: theme.cardBg }}
              className="w-[90%] rounded-3xl p-6 mx-4 shadow-lg"
            >
              <View className="border-b border-gray-200 pb-4 mb-4">
                <Text
                  style={{ color: theme.text }}
                  className="text-xl font-bold text-center"
                >
                  {t("selectLanguage")}
                </Text>
              </View>
              {languages.map((lang) => (
                <TouchableOpacity
                  key={lang.code}
                  onPress={() => {
                    setLanguage(lang.code);
                    setIsLanguageModalVisible(false);
                  }}
                  className="py-4 border-b border-gray-100 active:bg-gray-50"
                >
                  <Text
                    className={`text-lg text-center ${
                      language === lang.code
                        ? "text-blue-600 font-semibold"
                        : "text-gray-600"
                    }`}
                  >
                    {lang.label}
                  </Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity
                onPress={() => setIsLanguageModalVisible(false)}
                className="mt-4 bg-gray-100 p-4 rounded-xl active:bg-gray-200"
              >
                <Text className="text-center text-gray-600 font-semibold">
                  {t("cancel")}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Add Category Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={isCategoryModalVisible}
          onRequestClose={() => setIsCategoryModalVisible(false)}
        >
          <View className="flex-1 justify-center items-center bg-black/50">
            <View
              style={{ backgroundColor: theme.cardBg }}
              className="w-[90%] rounded-3xl p-6 mx-4"
            >
              <Text
                style={{ color: theme.text }}
                className="text-xl font-bold mb-4 text-center"
              >
                {t("addCategory")}
              </Text>
              <TextInput
                className="bg-gray-50 p-4 rounded-xl mb-4"
                placeholder={t("categoryName")}
                value={newCategoryTitle}
                onChangeText={setNewCategoryTitle}
              />
              <TouchableOpacity
                onPress={() => {
                  if (newCategoryTitle.trim()) {
                    addCategory({
                      id: Date.now().toString(),
                      title: newCategoryTitle,
                      icon: "shopping-bag",
                      iconColor: "bg-blue-500",
                      bgColor: "bg-blue-50",
                      budget: 0,
                      spent: 0,
                    });
                    setNewCategoryTitle("");
                    setIsCategoryModalVisible(false);
                  }
                }}
                className="bg-blue-600 p-4 rounded-xl mb-2"
              >
                <Text className="text-center text-white font-semibold">
                  {t("addCategory")}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setIsCategoryModalVisible(false)}
                className="bg-gray-100 p-4 rounded-xl"
              >
                <Text className="text-center text-gray-600 font-semibold">
                  {t("cancel")}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Settings;
