import { FontAwesome5 } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Modal,
  Pressable,
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

interface Category {
  id: number; // Unique identifier for the category
  name: string;
  icon: string;
  color: string;
  bgColor: string;
  amount: number;
  budget: number;
}

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const {
    totalBudget,
    spentAmount,
    categorySpending,
    categoryTransactions,
    currencySymbol,
    deleteTransaction,
  } = useBudget();

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const remainingBudget = totalBudget - spentAmount;
  const spentPercentage = (spentAmount / totalBudget) * 100;

  useEffect(() => {
    const today = new Date();
    const options: Intl.DateTimeFormatOptions = {
      month: "long",
      day: "numeric",
      year: "numeric",
    };
    today.toLocaleDateString("en-US", options);
  }, []);

  const getBudgetStatus = () => {
    if (spentPercentage < 50) return { color: "#22c55e", text: "On Track" };
    if (spentPercentage < 80)
      return { color: "#f59e0b", text: "Watch Spending" };
    return { color: "#ef4444", text: "Over Budget" };
  };

  const budgetStatus = getBudgetStatus();

  const handleCategoryPress = (category: Category) => {
    setSelectedCategory(category);
    setModalVisible(true);
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
          {/* App Title Card */}
          <Animated.View
            entering={FadeInUp.delay(50).duration(500)}
            className="mx-5 -mt-2 bg-white/80 backdrop-blur-sm rounded-3xl p-5"
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
                  name="book-open"
                  size={36}
                  color="#C5A3F8"
                  solid
                />
              </View>
              <Text className="text-3xl font-bold text-gray-800 text-center">
                HisabKitab
              </Text>
              <View className="w-16 h-1 bg-purple-300 rounded-full my-2" />
              <Text className="text-lg text-gray-600 text-center italic">
                Clear hisaab, happy ghar
              </Text>
            </View>
          </Animated.View>

          {/* Budget Overview Card */}
          <Animated.View
            entering={FadeInUp.delay(100).duration(500)}
            className="mx-5 mt-6 bg-white/80 backdrop-blur-sm rounded-3xl p-5"
            style={{
              shadowColor: "#C5A3F8",
              shadowOffset: { width: 0, height: 3 },
              shadowOpacity: 0.2,
              shadowRadius: 8,
              elevation: 5,
            }}
          >
            <View className="flex-row justify-between items-center mb-5">
              <View>
                <Text className="text-lg font-bold text-gray-800">
                  Total Budget
                </Text>
                <View className="flex-row items-center mt-1">
                  <View
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: budgetStatus.color }}
                  />
                  <Text
                    className="ml-1 text-sm"
                    style={{ color: budgetStatus.color }}
                  >
                    {budgetStatus.text}
                  </Text>
                </View>
              </View>
              <View className="items-center">
                <View className="w-16 h-16 justify-center items-center">
                  <View
                    className="absolute w-16 h-16 rounded-full border-4 border-purple-100"
                    style={{ borderWidth: 4 }}
                  />
                  <View
                    className="absolute w-16 h-16 rounded-full border-4"
                    style={{
                      borderLeftColor: budgetStatus.color,
                      borderTopColor: budgetStatus.color,
                      borderRightColor: "transparent",
                      borderBottomColor: "transparent",
                      transform: [{ rotate: `${spentPercentage * 3.6}deg` }],
                    }}
                  />
                  <Text className="text-sm font-bold text-gray-800">
                    {spentPercentage.toFixed(0)}%
                  </Text>
                </View>
                <Text className="text-xs text-gray-500 mt-1">Spent</Text>
              </View>
            </View>

            <View className="bg-purple-50/70 rounded-full h-4 mb-4">
              <LinearGradient
                colors={
                  spentPercentage > 80
                    ? ["#ef4444", "#f97316"]
                    : ["#E2D4F8", "#C5A3F8"]
                }
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                className="rounded-full h-4"
                style={{ width: `${spentPercentage}%` }}
              />
            </View>

            <View className="flex-row justify-between">
              <View className="bg-purple-50/50 p-3 rounded-xl flex-1 mr-2">
                <Text className="text-gray-500 text-sm">Spent</Text>
                <Text className="text-lg font-semibold text-red-500">
                  {currencySymbol} {spentAmount.toFixed(2)}
                </Text>
                <Text className="text-xs text-gray-500 mt-1">
                  {((spentAmount / totalBudget) * 100).toFixed(1)}% used
                </Text>
              </View>
              <View className="bg-purple-50/50 p-3 rounded-xl flex-1 mr-2">
                <Text className="text-gray-500 text-sm">Remaining</Text>
                <Text
                  className="text-lg font-semibold"
                  style={{ color: budgetStatus.color }}
                >
                  {currencySymbol} {remainingBudget.toFixed(2)}
                </Text>
                <Text className="text-xs text-gray-500 mt-1">
                  {((remainingBudget / totalBudget) * 100).toFixed(1)}% left
                </Text>
              </View>
              <View className="bg-purple-50/50 p-3 rounded-xl flex-1">
                <Text className="text-gray-500 text-sm">Total</Text>
                <Text className="text-lg font-semibold text-gray-800">
                  {currencySymbol} {totalBudget.toFixed(2)}
                </Text>
                <Text className="text-xs text-gray-500 mt-1">Budget</Text>
              </View>
            </View>
          </Animated.View>

          {/* Categories Card */}
          <Animated.View
            entering={FadeInUp.delay(300).duration(500)}
            className="mx-5 mt-6 mb-20 bg-white/80 backdrop-blur-sm rounded-3xl p-5"
            style={{
              shadowColor: "#C5A3F8",
              shadowOffset: { width: 0, height: 3 },
              shadowOpacity: 0.2,
              shadowRadius: 8,
              elevation: 5,
            }}
          >
            <View className="mb-5">
              <Text className="text-lg font-bold text-gray-800">
                Categories
              </Text>
            </View>

            <View className="flex-row flex-wrap justify-between">
              {categorySpending.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  className="items-center mb-4 bg-white/50 p-3 rounded-2xl active:scale-95 transform transition-transform"
                  style={{
                    width: "30%",
                    shadowColor: "#C5A3F8",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                    elevation: 2,
                  }}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    handleCategoryPress(category);
                  }}
                  activeOpacity={0.7}
                >
                  <View
                    className={`${category.bgColor} w-16 h-16 rounded-full items-center justify-center mb-1`}
                  >
                    <FontAwesome5
                      name={category.icon}
                      size={22}
                      color={category.color}
                    />
                  </View>
                  <Text className="text-gray-700 text-xs font-medium">
                    {category.name}
                  </Text>
                  <Text className="text-purple-600 text-xs font-bold mt-1">
                    {currencySymbol} {category.amount}
                  </Text>
                  <View className="w-full h-1 bg-purple-100 rounded-full mt-1">
                    <View
                      className="h-1 rounded-full bg-purple-600"
                      style={{
                        width: `${Math.min(
                          (category.amount / totalBudget) * 100,
                          100
                        )}%`,
                        backgroundColor: category.color,
                      }}
                    />
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </Animated.View>
        </ScrollView>

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View className="flex-1 justify-center items-center">
            <Pressable
              className="absolute top-0 left-0 right-0 bottom-0 bg-black/50"
              onPress={() => setModalVisible(false)}
            />
            <Animated.View
              entering={FadeInUp.duration(300)}
              className="bg-white rounded-3xl p-5 mx-4 w-full max-w-lg"
              style={{
                maxHeight: "80%",
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 8,
                elevation: 8,
              }}
            >
              {selectedCategory && (
                <ScrollView showsVerticalScrollIndicator={false}>
                  <View className="flex-row items-center mb-6">
                    <View
                      className={`${selectedCategory.bgColor} w-14 h-14 rounded-full items-center justify-center mr-3`}
                    >
                      <FontAwesome5
                        name={selectedCategory.icon}
                        size={22}
                        color={selectedCategory.color}
                      />
                    </View>
                    <View className="flex-1">
                      <Text className="text-xl font-bold text-gray-800">
                        {selectedCategory.name}
                      </Text>
                      <Text className="text-purple-600 font-bold text-lg">
                        {currencySymbol} {selectedCategory.amount}
                      </Text>
                    </View>
                    <TouchableOpacity
                      className="bg-gray-200 p-2 rounded-full"
                      onPress={() => setModalVisible(false)}
                    >
                      <FontAwesome5 name="times" size={18} color="#6b7280" />
                    </TouchableOpacity>
                  </View>

                  <Text className="text-lg font-semibold text-gray-800 mb-4">
                    Recent Transactions
                  </Text>

                  {categoryTransactions[selectedCategory.name]?.map(
                    (transaction, index) => (
                      <View
                        key={index}
                        className="bg-gray-50 p-4 rounded-xl mb-3"
                        style={{
                          borderLeftWidth: 4,
                          borderLeftColor: selectedCategory.color,
                        }}
                      >
                        <View className="flex-row justify-between mb-1">
                          <Text className="text-gray-800 font-medium">
                            {transaction.description}
                          </Text>
                          <View className="flex-row items-center">
                            <Text className="text-purple-600 font-bold mr-3">
                              {currencySymbol} {transaction.amount}
                            </Text>
                            <TouchableOpacity
                              onPress={() => {
                                Haptics.impactAsync(
                                  Haptics.ImpactFeedbackStyle.Medium
                                );
                                Alert.alert(
                                  "Delete Transaction",
                                  "Are you sure you want to delete this transaction?",
                                  [
                                    {
                                      text: "Cancel",
                                      style: "cancel",
                                    },
                                    {
                                      text: "Delete",
                                      style: "destructive",
                                      onPress: () => {
                                        deleteTransaction(
                                          selectedCategory.name,
                                          transaction.date,
                                          transaction.amount
                                        );
                                        Haptics.notificationAsync(
                                          Haptics.NotificationFeedbackType
                                            .Success
                                        );
                                      },
                                    },
                                  ]
                                );
                              }}
                              hitSlop={{
                                top: 10,
                                bottom: 10,
                                left: 10,
                                right: 10,
                              }}
                            >
                              <FontAwesome5
                                name="trash-alt"
                                size={16}
                                color="#EF4444"
                              />
                            </TouchableOpacity>
                          </View>
                        </View>
                        <Text className="text-gray-500 text-sm">
                          {transaction.date}
                        </Text>
                      </View>
                    )
                  )}

                  <View className="bg-gray-100 p-4 rounded-xl mt-2">
                    <View className="flex-row justify-between">
                      <Text className="text-gray-800 font-semibold">
                        Total Spending
                      </Text>
                      <Text className="text-purple-600 font-bold">
                        {currencySymbol} {selectedCategory.amount}
                      </Text>
                    </View>
                    <View className="h-2 bg-white rounded-full mt-3 mb-1">
                      <View
                        className="h-2 rounded-full"
                        style={{
                          width: `${
                            (selectedCategory.amount / totalBudget) * 100
                          }%`,
                          backgroundColor: selectedCategory.color,
                        }}
                      />
                    </View>
                    <Text className="text-gray-500 text-xs">
                      {((selectedCategory.amount / totalBudget) * 100).toFixed(
                        1
                      )}
                      % of total budget
                    </Text>
                  </View>
                </ScrollView>
              )}
            </Animated.View>
          </View>
        </Modal>
      </LinearGradient>
    </SafeAreaView>
  );
}
