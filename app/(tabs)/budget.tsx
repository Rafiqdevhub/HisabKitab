import { FontAwesome5 } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { CategoryType, useBudget } from "../../context/BudgetContext";

// Function to format numbers with commas
const formatNumber = (num: number) => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

// Function to format input as user types
const formatNumberInput = (text: string) => {
  // Remove any non-digit characters
  const cleanNumber = text.replace(/[^0-9]/g, "");
  // Convert to number and format with commas
  if (cleanNumber) {
    return formatNumber(parseInt(cleanNumber, 10));
  }
  return "";
};

// Function to parse formatted number back to plain number
const parseFormattedNumber = (formatted: string) => {
  return formatted.replace(/,/g, "");
};

interface ResetConfirmationModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

const ResetConfirmationModal: React.FC<ResetConfirmationModalProps> = ({
  visible,
  onClose,
  onConfirm,
  title,
  message,
}) => {
  const handleConfirm = () => {
    // Close the modal first
    onClose();

    // Execute the confirmation callback after modal animation
    setTimeout(() => {
      if (onConfirm) {
        onConfirm();
      }
    }, 300);
  };

  if (!visible) return null;

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onClose();
      }}
    >
      <View className="flex-1 justify-center items-center px-4">
        <Pressable
          className="absolute top-0 left-0 right-0 bottom-0 bg-black/50"
          onPress={onClose}
        />
        <Animated.View
          entering={FadeInUp.duration(300)}
          className="bg-white rounded-3xl p-6 w-full max-w-[320px]"
        >
          <View className="items-center mb-6">
            <View className="w-16 h-16 bg-red-100 rounded-full items-center justify-center mb-4">
              <FontAwesome5 name="sync" size={32} color="#EF4444" />
            </View>
            <Text className="text-xl font-bold text-gray-800 text-center mb-2">
              {title}
            </Text>
            <Text className="text-gray-600 text-center">{message}</Text>
          </View>

          <View className="flex-row space-x-3">
            <TouchableOpacity
              className="flex-1 bg-gray-100 rounded-xl p-4"
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                onClose();
              }}
            >
              <Text className="font-semibold text-gray-700 text-center">
                Cancel
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-1 bg-red-500 rounded-xl p-4"
              onPress={handleConfirm}
            >
              <Text className="font-semibold text-white text-center">
                Reset
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const Budget = () => {
  const insets = useSafeAreaInsets();
  const {
    totalBudget,
    setTotalBudget,
    categorySpending,
    setCategorySpending,
    currencySymbol,
    currentMonth,
    getMonthName,
    spentAmount,
    addTransaction,
  } = useBudget();

  const remainingBudget = totalBudget - spentAmount;
  const [editingCategory, setEditingCategory] = useState<CategoryType | null>(
    null
  );
  const [modalVisible, setModalVisible] = useState(false);
  const [inputError, setInputError] = useState("");
  const [showResetConfirmation, setShowResetConfirmation] = useState(false);
  const [resetConfirmationData, setResetConfirmationData] = useState({
    title: "",
    message: "",
    onConfirm: () => {},
  });
  const [transactionAmount, setTransactionAmount] = useState("");
  const [transactionDescription, setTransactionDescription] = useState("");
  const handleTotalBudgetPress = () => {
    setEditingCategory(null);
    setModalVisible(true);
  };
  const handleCategoryPress = (category: CategoryType) => {
    setEditingCategory(category);
    setModalVisible(true);
  }; // Categories are now managed directly without interim budget state

  const handleResetBudget = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    setResetConfirmationData({
      title: "Reset Budget? 🔄",
      message: "This will set all budgets to zero. Ready for a fresh start?",
      onConfirm: () => {
        setTotalBudget(0);
        setCategorySpending(
          categorySpending.map((cat) => ({
            ...cat,
            budget: 0,
            amount: 0,
          }))
        );
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      },
    });
    setShowResetConfirmation(true);
  };

  const handleResetCategoryBudget = (category: CategoryType) => {
    if (!category) return;

    // First hide the reset confirmation to prevent multiple modals
    setShowResetConfirmation(false);

    // Close the budget edit modal first
    setModalVisible(false);

    // Clear temporary states
    setTransactionAmount("");
    setInputError("");
    setEditingCategory(null);

    // Show the reset confirmation after a short delay
    setTimeout(() => {
      setResetConfirmationData({
        title: `Reset ${category.name}? 🔄`,
        message: `Clear ${category.name}'s spent amount?`,
        onConfirm: () => {
          // Update the category spending
          const updatedSpending = categorySpending.map((cat) =>
            cat.id === category.id ? { ...cat, amount: 0 } : cat
          );
          setCategorySpending(updatedSpending);

          // Provide success feedback after state update
          requestAnimationFrame(() => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          });
        },
      });
      setShowResetConfirmation(true);
    }, 300);
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
            paddingTop: insets.top,
            paddingBottom: 20,
          }}
        >
          {/* Budget Quote Card */}
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
            <View className="items-center">
              <View className="bg-purple-50 p-4 rounded-full mb-4">
                <FontAwesome5
                  name="money-bill-wave"
                  size={36}
                  color="#C5A3F8"
                  solid
                />
              </View>
              <Text className="text-xl font-bold text-gray-800 text-center mb-2">
                Budget Wisdom
              </Text>
              <View className="w-16 h-1 bg-purple-300 rounded-full mb-3" />
              <Text className="text-lg text-gray-600 text-center italic">
                Control your money before it controls you
              </Text>
            </View>
          </Animated.View>
          {/* Combined Month Title and Total Budget Card */}
          <Animated.View
            entering={FadeInUp.delay(50).duration(500)}
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
              <View className="flex-1">
                <Text className="text-2xl font-bold text-gray-800">
                  {getMonthName(currentMonth)}
                </Text>
                <Text className="text-gray-600 mt-1">Budget Management</Text>
              </View>
              <View className="bg-purple-50 p-3 rounded-full">
                <FontAwesome5
                  name="calendar-alt"
                  size={24}
                  color="#C5A3F8"
                  solid
                />
              </View>
            </View>

            <View className="h-px bg-gray-200 my-4" />

            <TouchableOpacity
              className="flex-row items-center justify-between bg-purple-50 rounded-2xl p-4 mb-3"
              onPress={handleTotalBudgetPress}
            >
              <View>
                <Text className="text-base text-gray-600">Total Budget</Text>
                <Text className="text-2xl font-bold text-purple-600 mt-1">
                  {currencySymbol} {formatNumber(totalBudget)}{" "}
                </Text>
                <View className="flex-row mt-2">
                  <Text className="text-sm text-gray-500">Spent: </Text>
                  <Text className="text-sm font-semibold text-red-500">
                    {currencySymbol} {formatNumber(spentAmount)}
                  </Text>
                  <Text className="text-sm text-gray-500 ml-2">Remaining</Text>
                  <Text className="text-sm font-semibold text-green-500 ml-1">
                    {currencySymbol} {formatNumber(remainingBudget)}
                  </Text>
                </View>
              </View>
              <View className="bg-white p-3 rounded-xl">
                <FontAwesome5 name="edit" size={18} color="#C5A3F8" />
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-row items-center justify-center bg-red-50 rounded-2xl p-4"
              onPress={handleResetBudget}
            >
              <View className="bg-white p-3 rounded-full">
                <FontAwesome5 name="sync" size={18} color="#EF4444" />
              </View>
              <Text className="ml-2 font-semibold text-red-500">
                Reset All Budgets
              </Text>
            </TouchableOpacity>
          </Animated.View>
          {/* Category Budgets */}
          <Animated.View
            entering={FadeInUp.delay(150).duration(500)}
            className="mx-5 bg-white/80 backdrop-blur-sm rounded-3xl p-5 mb-20"
            style={{
              shadowColor: "#C5A3F8",
              shadowOffset: { width: 0, height: 3 },
              shadowOpacity: 0.2,
              shadowRadius: 8,
              elevation: 5,
            }}
          >
            <Text className="text-lg font-bold text-gray-800 mb-4">
              Category Budgets
            </Text>
            {categorySpending.map((category) => (
              <TouchableOpacity
                key={category.id}
                className="flex-row items-center bg-gray-50 rounded-xl p-4 mb-3"
                onPress={() => handleCategoryPress(category)}
                style={{
                  borderLeftWidth: 4,
                  borderLeftColor: category.color,
                }}
              >
                <View
                  className={`${category.bgColor} w-12 h-12 rounded-full items-center justify-center mr-4`}
                >
                  <FontAwesome5
                    name={category.icon}
                    size={20}
                    color={category.color}
                  />
                </View>
                <View className="flex-1">
                  <Text className="font-semibold text-gray-800">
                    {category.name}
                  </Text>
                  <View className="flex-row items-center mt-1">
                    <Text className="text-sm text-gray-500 ml-2">Spent: </Text>
                    <Text className="text-sm font-semibold text-red-500">
                      {currencySymbol} {formatNumber(category.amount)}
                    </Text>
                  </View>
                  <View className="h-1 bg-gray-200 rounded-full mt-2">
                    <View
                      className="h-1 rounded-full"
                      style={{
                        width: `${Math.min(
                          (category.amount / category.budget) * 100,
                          100
                        )}%`,
                        backgroundColor: category.color,
                      }}
                    />
                  </View>
                </View>
                <FontAwesome5
                  name="chevron-right"
                  size={16}
                  color="#9CA3AF"
                  style={{ marginLeft: 8 }}
                />
              </TouchableOpacity>
            ))}
          </Animated.View>
        </ScrollView>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            className="flex-1 justify-end md:justify-center"
          >
            <View className="flex-1 justify-end md:justify-center px-4">
              <Pressable
                className="absolute top-0 left-0 right-0 bottom-0 bg-black/50"
                onPress={() => setModalVisible(false)}
              />
              <Animated.View
                entering={FadeInUp.duration(300)}
                className="bg-white rounded-t-3xl md:rounded-3xl w-full"
                style={{
                  maxWidth: 400,
                  maxHeight: Platform.OS === "ios" ? "85%" : "90%",
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.25,
                  shadowRadius: 12,
                  elevation: 10,
                }}
              >
                <ScrollView bounces={false} className="max-h-[85vh]">
                  <View className="p-6">
                    {/* Category Header */}
                    <View className="items-center mb-6">
                      <View
                        className={`${
                          editingCategory?.bgColor || "bg-purple-50"
                        } p-3 rounded-full mb-3`}
                      >
                        <FontAwesome5
                          name={editingCategory?.icon || "wallet"}
                          size={24}
                          color={editingCategory?.color || "#C5A3F8"}
                          solid
                        />
                      </View>
                      <Text className="text-xl font-bold text-gray-800 text-center">
                        {editingCategory?.name || "Total Budget"}
                      </Text>
                    </View>

                    {editingCategory ? (
                      <>
                        {/* Category Overview */}
                        <View className="bg-gray-50 rounded-2xl p-4 mb-4">
                          <View className="flex-row justify-between items-center">
                            <View>
                              <Text className="text-sm text-gray-500">
                                Amount Spent
                              </Text>
                              <Text className="text-lg font-bold text-red-500">
                                {currencySymbol}{" "}
                                {formatNumber(editingCategory.amount)}
                              </Text>
                              <Text className="text-xs text-gray-500 mt-1">
                                Last updated: {new Date().toLocaleDateString()}
                              </Text>
                            </View>
                            <TouchableOpacity
                              className="bg-red-50 p-3 rounded-xl"
                              onPress={() =>
                                handleResetCategoryBudget(editingCategory)
                              }
                            >
                              <View className="items-center">
                                <FontAwesome5
                                  name="sync"
                                  size={16}
                                  color="#EF4444"
                                />
                                <Text className="text-xs text-red-500 mt-1">
                                  Reset
                                </Text>
                              </View>
                            </TouchableOpacity>
                          </View>

                          {/* Spending Progress Bar */}
                          <View className="h-2 bg-white rounded-full mt-3">
                            <View
                              className="h-2 rounded-full"
                              style={{
                                width: `${Math.min(
                                  (editingCategory.amount /
                                    editingCategory.budget) *
                                    100,
                                  100
                                )}%`,
                                backgroundColor: editingCategory.color,
                              }}
                            />
                          </View>
                        </View>
                        {/* Add Amount Section */}
                        <View className="bg-gray-50 rounded-2xl p-5 mb-3">
                          <Text className="text-sm text-gray-500 mb-2">
                            Add New Amount
                          </Text>
                          <View className="flex-row items-center mb-4">
                            <View className="flex-row items-center flex-1">
                              <Text className="text-2xl font-semibold text-gray-800 mr-2">
                                {currencySymbol}
                              </Text>
                              <TextInput
                                className="flex-1 text-2xl font-semibold text-gray-800"
                                keyboardType="decimal-pad"
                                value={transactionAmount}
                                onChangeText={(text) =>
                                  setTransactionAmount(formatNumberInput(text))
                                }
                                placeholder="0.00"
                                placeholderTextColor="#9CA3AF"
                                autoFocus
                                selectionColor="#C5A3F8"
                              />
                            </View>
                          </View>
                          <Text className="text-sm text-gray-500 mb-2">
                            Description
                          </Text>
                          <TextInput
                            className="w-full bg-white rounded-xl p-3 text-gray-800"
                            value={transactionDescription}
                            onChangeText={setTransactionDescription}
                            placeholder="What did you spend on?"
                            placeholderTextColor="#9CA3AF"
                          />
                        </View>
                        {/* Error Message */}
                        {inputError ? (
                          <Text className="text-red-500 text-sm mb-4 px-1">
                            {inputError}
                          </Text>
                        ) : (
                          <Text className="text-gray-500 text-sm mb-4 px-1">
                            Enter the amount spent
                          </Text>
                        )}
                      </>
                    ) : (
                      <>
                        {/* Total Budget Input Section */}
                        <View className="bg-gray-50 rounded-2xl p-5 mb-3">
                          <Text className="text-sm text-gray-500 mb-2">
                            Set Total Budget
                          </Text>
                          <View className="flex-row items-center mb-4">
                            <View className="flex-row items-center flex-1">
                              <Text className="text-2xl font-semibold text-gray-800 mr-2">
                                {currencySymbol}
                              </Text>
                              <TextInput
                                className="flex-1 text-2xl font-semibold text-gray-800"
                                keyboardType="decimal-pad"
                                value={transactionAmount}
                                onChangeText={(text) =>
                                  setTransactionAmount(formatNumberInput(text))
                                }
                                placeholder={formatNumber(totalBudget)}
                                placeholderTextColor="#9CA3AF"
                                autoFocus
                                selectionColor="#C5A3F8"
                              />
                            </View>
                          </View>
                        </View>
                        {inputError ? (
                          <Text className="text-red-500 text-sm mb-4 px-1">
                            {inputError}
                          </Text>
                        ) : (
                          <Text className="text-gray-500 text-sm mb-4 px-1">
                            Enter the total budget for this month
                          </Text>
                        )}
                      </>
                    )}
                  </View>
                </ScrollView>
                {/* Action Buttons - Fixed at bottom */}
                <View className="px-6 pb-6 pt-2 border-t border-gray-100">
                  <View className="flex-row justify-end space-x-3">
                    <TouchableOpacity
                      className="bg-gray-100 rounded-xl px-6 py-4 flex-1"
                      onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        setModalVisible(false);
                        setTransactionAmount("");
                        setTransactionDescription("");
                        setInputError("");
                      }}
                    >
                      <Text className="font-semibold text-gray-700 text-center">
                        Cancel
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      className={`rounded-xl px-6 py-4 flex-1 ${
                        inputError || !transactionAmount
                          ? "bg-purple-300"
                          : "bg-purple-600"
                      }`}
                      onPress={() => {
                        const amount = parseFloat(
                          parseFormattedNumber(transactionAmount)
                        );
                        if (isNaN(amount) || amount <= 0) {
                          Haptics.notificationAsync(
                            Haptics.NotificationFeedbackType.Error
                          );
                          setInputError("Please enter a valid amount");
                          return;
                        }

                        if (!editingCategory) {
                          // Set total budget
                          setTotalBudget(amount);
                        } else {
                          // Add transaction with current date and description
                          const transaction = {
                            date: new Date().toISOString(),
                            description:
                              transactionDescription.trim() ||
                              `Spent on ${editingCategory.name}`,
                            amount,
                          };
                          addTransaction(editingCategory.name, transaction);
                        }

                        Haptics.notificationAsync(
                          Haptics.NotificationFeedbackType.Success
                        );
                        setModalVisible(false);
                        setTransactionAmount("");
                        setTransactionDescription("");
                        setInputError("");
                      }}
                      disabled={!!inputError || !transactionAmount}
                    >
                      <Text className="font-semibold text-white text-center">
                        Save
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Animated.View>
            </View>
          </KeyboardAvoidingView>
        </Modal>
        <ResetConfirmationModal
          visible={showResetConfirmation}
          onClose={() => setShowResetConfirmation(false)}
          onConfirm={resetConfirmationData.onConfirm}
          title={resetConfirmationData.title}
          message={resetConfirmationData.message}
        />
      </LinearGradient>
    </SafeAreaView>
  );
};

export default Budget;
