import { FontAwesome5 } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import React, { useState } from "react";
import {
  Alert,
  Linking,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import { useBudget } from "../../context/BudgetContext";

const currencies = [
  { symbol: "PKR", label: "Pakistani Rupee" },
  { symbol: "$", label: "US Dollar" },
  { symbol: "€", label: "Euro" },
  { symbol: "£", label: "British Pound" },
  { symbol: "¥", label: "Japanese Yen" },
  { symbol: "₹", label: "Indian Rupee" },
];

interface Transaction {
  date: string;
  description: string;
  amount: number;
}

const generatePDFContent = (data: {
  totalBudget: number;
  spentAmount: number;
  currencySymbol: string;
  categorySpending: any[];
  categoryTransactions: Record<string, Transaction[]>;
  currentMonth: string;
  getMonthName: (month: string) => string;
}) => {
  const {
    totalBudget,
    spentAmount,
    currencySymbol,
    categorySpending,
    categoryTransactions,
    currentMonth,
    getMonthName,
  } = data;
  const remainingBudget = totalBudget - spentAmount;
  const spentPercentage = ((spentAmount / totalBudget) * 100).toFixed(1);

  return `
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
        <style>
          body { font-family: 'Helvetica', sans-serif; color: #1F2937; padding: 40px; }
          .header { text-align: center; margin-bottom: 30px; }
          .title { font-size: 24px; font-weight: bold; color: #7C3AED; margin: 0; }
          .subtitle { color: #6B7280; margin-top: 8px; }
          .overview-card { background: #F3F4F6; border-radius: 12px; padding: 20px; margin-bottom: 30px; }
          .overview-title { font-size: 18px; font-weight: bold; margin-bottom: 15px; }
          .stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; }
          .stat-item { background: white; padding: 15px; border-radius: 8px; }
          .stat-label { color: #6B7280; font-size: 14px; margin-bottom: 5px; }
          .stat-value { font-size: 18px; font-weight: bold; }
          .category-section { margin-top: 30px; }
          .category-title { font-size: 18px; font-weight: bold; margin-bottom: 15px; }
          .category-card { background: #F3F4F6; border-radius: 8px; padding: 15px; margin-bottom: 15px; }
          .category-header { display: flex; justify-content: space-between; margin-bottom: 10px; }
          .category-name { font-weight: bold; }
          .transaction-list { background: white; border-radius: 8px; padding: 10px; }
          .transaction-item { padding: 8px; border-bottom: 1px solid #E5E7EB; }
          .transaction-item:last-child { border-bottom: none; }
          .text-purple { color: #7C3AED; }
          .text-red { color: #EF4444; }
          .text-green { color: #10B981; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1 class="title">HisabKitab Budget Report</h1>
          <p class="subtitle">${getMonthName(currentMonth)}</p>
        </div>

        <div class="overview-card">
          <h2 class="overview-title">Budget Overview</h2>
          <div class="stats-grid">
            <div class="stat-item">
              <div class="stat-label">Total Budget</div>
              <div class="stat-value">${currencySymbol} ${totalBudget}</div>
            </div>
            <div class="stat-item">
              <div class="stat-label">Spent Amount</div>
              <div class="stat-value text-red">${currencySymbol} ${spentAmount}</div>
            </div>
            <div class="stat-item">
              <div class="stat-label">Remaining</div>
              <div class="stat-value text-green">${currencySymbol} ${remainingBudget}</div>
            </div>
          </div>
          <p style="text-align: center; margin-top: 15px; color: #6B7280;">
            Budget utilized: ${spentPercentage}%
          </p>
        </div>

        <div class="category-section">
          <h2 class="category-title">Category Details</h2>
          ${categorySpending
            .map((category) => {
              const transactions = categoryTransactions[category.name] || [];
              const categoryPercentage = (
                (category.amount / totalBudget) *
                100
              ).toFixed(1);

              return `
              <div class="category-card">
                <div class="category-header">
                  <div class="category-name">${category.name}</div>
                  <div class="text-purple">${currencySymbol} ${
                category.amount
              }</div>
                </div>
                <p style="margin: 5px 0; color: #6B7280;">
                  ${categoryPercentage}% of total budget
                </p>
                ${
                  transactions.length > 0
                    ? `
                  <div class="transaction-list">
                    ${transactions
                      .map(
                        (transaction: Transaction) => `
                      <div class="transaction-item">
                        <div style="display: flex; justify-content: space-between;">
                          <span>${transaction.description}</span>
                          <span class="text-purple">${currencySymbol} ${
                          transaction.amount
                        }</span>
                        </div>
                        <div style="color: #6B7280; font-size: 12px; margin-top: 4px;">
                          ${new Date(transaction.date).toLocaleDateString()}
                        </div>
                      </div>
                    `
                      )
                      .join("")}
                  </div>
                `
                    : '<p style="color: #6B7280; text-align: center;">No transactions</p>'
                }
              </div>
            `;
            })
            .join("")}
        </div>

        <div style="text-align: center; margin-top: 30px; color: #6B7280; font-size: 12px;">
          Generated on ${new Date().toLocaleDateString()} using HisabKitab
        </div>
      </body>
    </html>
  `;
};

const Setting = () => {
  const insets = useSafeAreaInsets();
  const {
    currencySymbol,
    setCurrencySymbol,
    getMonthName,
    resetAllBudgets,
    totalBudget,
    spentAmount,
    categorySpending,
    categoryTransactions,
    currentMonth,
  } = useBudget();
  const [showCurrencyModal, setShowCurrencyModal] = useState(false);

  const handleResetData = () => {
    Alert.alert(
      "Reset All Data",
      "This will permanently delete all your budget data. This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Reset",
          style: "destructive",
          onPress: () => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            resetAllBudgets();
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          },
        },
      ]
    );
  };

  const handleExportPDF = async () => {
    try {
      // Generate the HTML content
      const html = generatePDFContent({
        totalBudget,
        spentAmount,
        currencySymbol,
        categorySpending,
        categoryTransactions,
        currentMonth,
        getMonthName,
      });

      // Create the PDF file
      const { uri } = await Print.printToFileAsync({
        html,
        base64: false,
      });

      // Share the PDF file
      await Sharing.shareAsync(uri, {
        mimeType: "application/pdf",
        dialogTitle: "Export Budget Report",
        UTI: "com.adobe.pdf", // iOS only
      });

      // Show success feedback
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (err) {
      console.error("Error generating PDF:", err);
      Alert.alert(
        "Error",
        "Could not generate the PDF report. Please try again."
      );
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }} edges={["right", "left"]}>
      <LinearGradient
        colors={["#E2D4F8", "#D1B6F8", "#C5A3F8"]}
        style={{ flex: 1 }}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      >
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingTop: insets.top - 20,
            paddingBottom: 20 + insets.bottom,
          }}
          contentInsetAdjustmentBehavior="automatic"
        >
          {/* Settings Header */}
          <Animated.View
            entering={FadeInUp.delay(50).duration(500)}
            className="mx-5 mb-6 bg-white/80 backdrop-blur-sm rounded-3xl px-7 py-6"
            style={{
              shadowColor: "#C5A3F8",
              shadowOffset: { width: 0, height: 3 },
              shadowOpacity: 0.2,
              shadowRadius: 8,
              elevation: 5,
            }}
          >
            <View className="items-center">
              <View className="bg-purple-50 p-4 rounded-full mb-4">
                <FontAwesome5 name="cogs" size={36} color="#C5A3F8" solid />
              </View>
              <Text className="text-2xl font-bold text-gray-800 text-center">
                Settings
              </Text>
              <View className="w-16 h-1 bg-purple-300 rounded-full my-2" />
              <Text className="text-lg text-gray-600 text-center italic">
                Customize your experience
              </Text>
            </View>
          </Animated.View>
          {/* Currency Settings */}
          <Animated.View
            entering={FadeInUp.delay(100).duration(500)}
            className="mx-5 mb-6 bg-white/80 backdrop-blur-sm rounded-3xl p-5"
            style={{
              shadowColor: "#C5A3F8",
              shadowOffset: { width: 0, height: 3 },
              shadowOpacity: 0.2,
              shadowRadius: 8,
              elevation: 5,
            }}
          >
            <View className="flex-row items-center justify-between mb-4">
              <View>
                <Text className="text-lg font-bold text-gray-800">
                  Currency
                </Text>
                <Text className="text-sm text-gray-600">
                  Select your preferred currency
                </Text>
              </View>
              <View className="bg-purple-50 p-3 rounded-full">
                <FontAwesome5
                  name="dollar-sign"
                  size={24}
                  color="#C5A3F8"
                  solid
                />
              </View>
            </View>
            <TouchableOpacity
              className="flex-row items-center justify-between bg-purple-50 rounded-xl p-4"
              onPress={() => setShowCurrencyModal(true)}
            >
              <Text className="text-gray-700 font-medium">
                Current:{" "}
                {currencies.find((c) => c.symbol === currencySymbol)?.label ||
                  currencySymbol}
              </Text>
              <FontAwesome5 name="chevron-right" size={16} color="#C5A3F8" />
            </TouchableOpacity>
          </Animated.View>
          {/* Data Management */}
          <Animated.View
            entering={FadeInUp.delay(150).duration(500)}
            className="mx-5 mb-6 bg-white/80 backdrop-blur-sm rounded-3xl p-5"
            style={{
              shadowColor: "#C5A3F8",
              shadowOffset: { width: 0, height: 3 },
              shadowOpacity: 0.2,
              shadowRadius: 8,
              elevation: 5,
            }}
          >
            <View className="flex-row items-center mb-4">
              <View className="bg-purple-50 p-2 rounded-full mr-3">
                <FontAwesome5 name="database" size={20} color="#C5A3F8" />
              </View>
              <Text className="text-lg font-bold text-gray-800">
                Data Management
              </Text>
            </View>
            <View className="space-y-3">
              <TouchableOpacity
                className="bg-purple-50 rounded-xl p-4"
                onPress={handleExportPDF}
              >
                <View className="flex-row items-center">
                  <FontAwesome5 name="file-pdf" size={16} color="#7C3AED" />
                  <Text className="ml-3 text-purple-600 font-semibold">
                    Export as PDF
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                className="bg-red-50 rounded-xl p-4"
                onPress={handleResetData}
              >
                <View className="flex-row items-center">
                  <FontAwesome5 name="trash-alt" size={16} color="#EF4444" />
                  <Text className="ml-3 text-red-500 font-semibold">
                    Reset All Data
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </Animated.View>
          {/* About & Support */}
          <Animated.View
            entering={FadeInUp.delay(250).duration(500)}
            className="mx-5 mb-6 bg-white/80 backdrop-blur-sm rounded-3xl p-5"
            style={{
              shadowColor: "#C5A3F8",
              shadowOffset: { width: 0, height: 3 },
              shadowOpacity: 0.2,
              shadowRadius: 8,
              elevation: 5,
            }}
          >
            <View className="flex-row items-center mb-4">
              <View className="bg-purple-50 p-2 rounded-full mr-3">
                <FontAwesome5 name="info-circle" size={20} color="#C5A3F8" />
              </View>
              <Text className="text-lg font-bold text-gray-800">
                About & Support
              </Text>
            </View>
            <View className="space-y-3">
              <TouchableOpacity
                className="bg-purple-50 rounded-xl p-4"
                onPress={() => {
                  // TODO: Implement account settings
                  Alert.alert(
                    "Coming Soon",
                    "Account settings will be available in the next update."
                  );
                }}
              >
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center">
                    <FontAwesome5
                      name="user-circle"
                      size={16}
                      color="#7C3AED"
                    />
                    <Text className="ml-3 text-purple-600 font-semibold">
                      Account
                    </Text>
                  </View>
                  <FontAwesome5
                    name="chevron-right"
                    size={16}
                    color="#C5A3F8"
                  />
                </View>
              </TouchableOpacity>

              <View className="bg-purple-50 rounded-xl p-4">
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center">
                    <FontAwesome5
                      name="code-branch"
                      size={16}
                      color="#7C3AED"
                    />
                    <Text className="ml-3 text-purple-600 font-semibold">
                      App Version
                    </Text>
                  </View>
                  <Text className="text-gray-600">1.0.0</Text>
                </View>
              </View>

              <TouchableOpacity
                className="bg-purple-50 rounded-xl p-4"
                onPress={() => {
                  Alert.alert(
                    "Help & Support",
                    "Need help? Contact us at support@hisabkitab.app"
                  );
                }}
              >
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center">
                    <FontAwesome5
                      name="question-circle"
                      size={16}
                      color="#7C3AED"
                    />
                    <Text className="ml-3 text-purple-600 font-semibold">
                      Help & Support
                    </Text>
                  </View>
                  <FontAwesome5
                    name="chevron-right"
                    size={16}
                    color="#C5A3F8"
                  />
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                className="bg-purple-50 rounded-xl p-4"
                onPress={() => {
                  // TODO: Link to privacy policy
                  Alert.alert(
                    "Privacy Policy",
                    "Opens privacy policy in browser"
                  );
                }}
              >
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center">
                    <FontAwesome5 name="shield-alt" size={16} color="#7C3AED" />
                    <Text className="ml-3 text-purple-600 font-semibold">
                      Privacy Policy
                    </Text>
                  </View>
                  <FontAwesome5
                    name="chevron-right"
                    size={16}
                    color="#C5A3F8"
                  />
                </View>
              </TouchableOpacity>
            </View>
          </Animated.View>

          {/* Creator Card */}
          <Animated.View
            entering={FadeInUp.delay(300).duration(500)}
            className="mx-5 mb-6 bg-white/80 backdrop-blur-sm rounded-3xl p-5"
            style={{
              shadowColor: "#C5A3F8",
              shadowOffset: { width: 0, height: 3 },
              shadowOpacity: 0.2,
              shadowRadius: 8,
              elevation: 5,
            }}
          >
            <View className="flex-row items-center mb-4">
              <View className="bg-purple-50 p-2 rounded-full mr-3">
                <FontAwesome5 name="code" size={20} color="#C5A3F8" />
              </View>
              <Text className="text-lg font-bold text-gray-800">Developer</Text>
            </View>

            <View className="items-center p-4 bg-purple-50 rounded-xl">
              <View className="bg-white p-4 rounded-full mb-4 shadow-sm">
                <FontAwesome5 name="user-circle" size={48} color="#7C3AED" />
              </View>
              <Text className="text-xl font-bold text-purple-600 mb-1">
                Muhammad Rafiq
              </Text>
              <Text className="text-gray-600 font-medium mb-2">
                Full Stack & Mobile Developer
              </Text>
              <Text className="text-gray-600 text-center text-sm mb-4">
                A passionate mobile and web developer from Pakistan, focused on
                building simple yet powerful tools that solve real-life
                problems.
              </Text>
              <View className="flex-row space-x-4 mb-4">
                <TouchableOpacity
                  className="bg-purple-100 p-3 rounded-full"
                  onPress={async () => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    try {
                      await Linking.openURL("https://github.com/Rafiqdevhub");
                    } catch (_) {
                      Alert.alert("Error", "Could not open GitHub profile");
                    }
                  }}
                >
                  <FontAwesome5 name="github" size={20} color="#7C3AED" />
                </TouchableOpacity>
                <TouchableOpacity
                  className="bg-purple-100 p-3 rounded-full"
                  onPress={async () => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    try {
                      await Linking.openURL(
                        "https://www.linkedin.com/in/rafiqdevhub/"
                      );
                    } catch (_) {
                      Alert.alert("Error", "Could not open LinkedIn profile");
                    }
                  }}
                >
                  <FontAwesome5 name="linkedin" size={20} color="#7C3AED" />
                </TouchableOpacity>
                <TouchableOpacity
                  className="bg-purple-100 p-3 rounded-full"
                  onPress={async () => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    try {
                      await Linking.openURL("https://rafiqdev.vercel.app/");
                    } catch (_) {
                      Alert.alert("Error", "Could not open portfolio website");
                    }
                  }}
                >
                  <FontAwesome5 name="globe" size={20} color="#7C3AED" />
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                className="bg-purple-600 px-6 py-3 rounded-xl w-full"
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  Alert.alert(
                    "Contact",
                    "rafkhan9323@gmail.com\n\nEmail copied to clipboard!"
                  );
                }}
              >
                <View className="flex-row items-center justify-center">
                  <FontAwesome5 name="envelope" size={16} color="white" />
                  <Text className="ml-2 text-white font-semibold">
                    Get in Touch
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </ScrollView>
        {/* Currency Selection Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={showCurrencyModal}
          onRequestClose={() => setShowCurrencyModal(false)}
        >
          <View className="flex-1 items-center justify-center px-4 bg-black/50">
            <Animated.View
              entering={FadeInUp.duration(300)}
              className="bg-white rounded-3xl w-full overflow-hidden"
              style={{
                maxWidth: 360,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.25,
                shadowRadius: 12,
                elevation: 10,
              }}
            >
              {/* Modal Header */}
              <View className="items-center pt-6 px-6 border-b border-gray-100">
                <View className="bg-purple-50 p-4 rounded-full mb-4">
                  <FontAwesome5
                    name="dollar-sign"
                    size={24}
                    color="#C5A3F8"
                    solid
                  />
                </View>
                <Text className="text-xl font-bold text-gray-800 mb-6">
                  Select Currency
                </Text>
              </View>

              {/* Currency List */}
              <ScrollView
                className="px-4 pt-4 max-h-[400px]"
                showsVerticalScrollIndicator={false}
              >
                <View className="space-y-2 pb-4">
                  {currencies.map((currency) => (
                    <TouchableOpacity
                      key={currency.symbol}
                      className={`p-4 rounded-xl active:opacity-90 ${
                        currencySymbol === currency.symbol
                          ? "bg-purple-100 border-2 border-purple-200"
                          : "bg-gray-50"
                      }`}
                      onPress={() => {
                        setCurrencySymbol(currency.symbol);
                        setShowCurrencyModal(false);
                        Haptics.notificationAsync(
                          Haptics.NotificationFeedbackType.Success
                        );
                      }}
                    >
                      <View className="flex-row items-center">
                        <View
                          className={`w-10 h-10 rounded-full ${
                            currencySymbol === currency.symbol
                              ? "bg-purple-200"
                              : "bg-white"
                          } items-center justify-center mr-3`}
                        >
                          <Text
                            className={`text-lg font-bold ${
                              currencySymbol === currency.symbol
                                ? "text-purple-600"
                                : "text-gray-700"
                            }`}
                          >
                            {currency.symbol}
                          </Text>
                        </View>
                        <Text
                          className={`flex-1 ${
                            currencySymbol === currency.symbol
                              ? "text-purple-600 font-medium"
                              : "text-gray-600"
                          }`}
                        >
                          {currency.label}
                        </Text>
                        {currencySymbol === currency.symbol && (
                          <FontAwesome5
                            name="check-circle"
                            size={20}
                            color="#C5A3F8"
                            solid
                          />
                        )}
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>

              {/* Bottom Actions */}
              <View className="p-4 border-t border-gray-100">
                <TouchableOpacity
                  className="w-full bg-gray-100 rounded-xl p-4"
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setShowCurrencyModal(false);
                  }}
                >
                  <Text className="text-center font-semibold text-gray-700">
                    Cancel
                  </Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </View>
        </Modal>
      </LinearGradient>
    </SafeAreaView>
  );
};

export default Setting;
