import { FontAwesome5 } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useBudget } from "../../context/BudgetContext";

const formatCurrency = (amount: number) => {
  return `PKR ${amount.toLocaleString()}`;
};

const Budget = () => {
  const { totalBudget, setTotalBudget, categories, updateCategoryBudget } =
    useBudget();
  const [newTotalBudget, setNewTotalBudget] = useState("");
  const [categoryBudgets, setCategoryBudgets] = useState<{
    [key: string]: string;
  }>({});
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isCategoryModalVisible, setIsCategoryModalVisible] = useState(false);

  // Initialize category budgets when component mounts
  useEffect(() => {
    const initialBudgets = categories.reduce((acc, category) => {
      acc[category.id] = category.budget > 0 ? category.budget.toString() : "";
      return acc;
    }, {} as { [key: string]: string });
    setCategoryBudgets(initialBudgets);
  }, [categories]);

  // Update newTotalBudget when totalBudget changes
  useEffect(() => {
    setNewTotalBudget(totalBudget > 0 ? totalBudget.toString() : "");
  }, [totalBudget]);

  const handleSaveTotalBudget = () => {
    const amount = parseFloat(newTotalBudget || "0");
    if (isNaN(amount) || amount < 0) {
      Alert.alert("Invalid Amount", "Please enter a valid budget amount");
      return;
    }
    setTotalBudget(amount);
    Alert.alert("Success", "Total budget updated successfully");
  };

  const handleSaveCategoryBudget = (id: string) => {
    const amount = parseFloat(categoryBudgets[id] || "0");
    if (isNaN(amount) || amount < 0) {
      Alert.alert("Invalid Amount", "Please enter a valid budget amount");
      return;
    }
    updateCategoryBudget(id, amount);
    setIsCategoryModalVisible(false);
    Alert.alert("Success", "Category budget updated successfully");
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100" style={{ paddingBottom: 16 }}>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        {/* Header Card */}
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
            <View className="items-center mb-4">
              <View
                className="w-20 h-20 rounded-full items-center justify-center"
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                  borderWidth: 2,
                  borderColor: "rgba(255, 255, 255, 0.4)",
                }}
              >
                <FontAwesome5 name="money-bill-wave" size={32} color="white" />
              </View>
            </View>

            <View className="items-center">
              <Text
                className="text-white text-3xl font-bold tracking-wider mb-2"
                style={{
                  textShadowColor: "rgba(0, 0, 0, 0.4)",
                  textShadowOffset: { width: 0, height: 2 },
                  textShadowRadius: 4,
                }}
              >
                Budget Manager
              </Text>
              <Text className="text-white/90 text-base text-center mb-4">
                Manage your kharchay, secure your future.
              </Text>
            </View>
          </View>
        </View>

        {/* Total Budget Section */}
        <View className="mx-4 mb-6">
          <View
            className="bg-white p-6 rounded-xl"
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 4,
            }}
          >
            <Text className="text-xl font-bold text-gray-800 mb-4">
              Total Monthly Budget
            </Text>
            <View className="bg-gray-50 p-4 rounded-lg mb-4">
              <Text className="text-gray-600 text-sm mb-1">
                Current Budget:
              </Text>
              <Text className="text-2xl font-bold text-blue-600">
                {formatCurrency(totalBudget)}
              </Text>
            </View>
            <View className="flex-row items-center">
              <Text className="text-gray-600 mr-2 font-medium">PKR</Text>
              <TextInput
                className="flex-1 bg-gray-50 p-3 rounded-lg border border-gray-200"
                keyboardType="numeric"
                value={newTotalBudget}
                onChangeText={setNewTotalBudget}
                placeholder="Enter new budget amount"
                placeholderTextColor="#9CA3AF"
              />
              <TouchableOpacity
                onPress={handleSaveTotalBudget}
                className="ml-3 bg-blue-600 px-6 py-3 rounded-lg"
                style={{
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 3,
                  elevation: 2,
                }}
              >
                <Text className="text-white font-semibold">Update</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Category Budgets */}
        <View className="mx-4">
          <Text className="text-xl font-bold text-gray-800 mb-4 px-1">
            Category Budgets
          </Text>
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              onPress={() => {
                setSelectedCategory(category.id);
                setCategoryBudgets((prev) => ({
                  ...prev,
                  [category.id]:
                    category.budget > 0 ? category.budget.toString() : "",
                }));
                setIsCategoryModalVisible(true);
              }}
            >
              <View
                className="bg-white p-5 rounded-xl mb-4"
                style={{
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                  elevation: 3,
                }}
              >
                <View className="flex-row items-center justify-between mb-3">
                  <View className="flex-row items-center">
                    <View
                      className={`${category.iconColor} w-10 h-10 rounded-full items-center justify-center mr-3`}
                    >
                      <FontAwesome5
                        name={category.icon}
                        size={20}
                        color="white"
                        solid
                      />
                    </View>
                    <Text className="text-lg font-semibold text-gray-800">
                      {category.title}
                    </Text>
                  </View>
                  <FontAwesome5
                    name="chevron-right"
                    size={16}
                    color="#9CA3AF"
                  />
                </View>

                <View className="bg-gray-50 p-3 rounded-lg">
                  <View className="flex-row justify-between mb-2">
                    <Text className="text-gray-600">Current Budget:</Text>
                    <Text className="font-semibold text-gray-800">
                      {formatCurrency(category.budget)}
                    </Text>
                  </View>
                  <View className="flex-row justify-between mb-2">
                    <Text className="text-gray-600">Spent:</Text>
                    <Text className="font-semibold text-gray-800">
                      {formatCurrency(category.spent)}
                    </Text>
                  </View>
                  <View className="flex-row justify-between">
                    <Text className="text-gray-600">Remaining:</Text>
                    <Text
                      className={`font-semibold ${
                        category.budget - category.spent > 0
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {formatCurrency(category.budget - category.spent)}
                    </Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Category Budget Update Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={isCategoryModalVisible}
          onRequestClose={() => setIsCategoryModalVisible(false)}
        >
          <View className="flex-1 justify-center items-center bg-black/50">
            <View className="bg-white w-[90%] rounded-3xl p-6">
              {selectedCategory && (
                <>
                  <View className="flex-row items-center justify-center mb-4">
                    <View
                      className={`${
                        categories.find((c) => c.id === selectedCategory)
                          ?.iconColor
                      } w-12 h-12 rounded-full items-center justify-center mr-3`}
                    >
                      <FontAwesome5
                        name={
                          categories.find((c) => c.id === selectedCategory)
                            ?.icon || ""
                        }
                        size={24}
                        color="white"
                        solid
                      />
                    </View>
                    <Text className="text-xl font-bold text-gray-800 text-center">
                      Update{" "}
                      {categories.find((c) => c.id === selectedCategory)?.title}{" "}
                      Budget
                    </Text>
                  </View>

                  <View className="bg-gray-50 p-4 rounded-lg mb-4">
                    <Text className="text-gray-600 text-sm mb-1">
                      Current Budget:
                    </Text>
                    <Text className="text-2xl font-bold text-blue-600">
                      {formatCurrency(
                        categories.find((c) => c.id === selectedCategory)
                          ?.budget || 0
                      )}
                    </Text>
                  </View>

                  <View className="flex-row items-center mb-4">
                    <Text className="text-gray-600 mr-2 font-medium">PKR</Text>
                    <TextInput
                      className="flex-1 bg-gray-50 p-4 rounded-lg border border-gray-200"
                      keyboardType="numeric"
                      value={categoryBudgets[selectedCategory]}
                      onChangeText={(text) =>
                        setCategoryBudgets((prev) => ({
                          ...prev,
                          [selectedCategory]: text,
                        }))
                      }
                      placeholder="Enter new budget amount"
                      placeholderTextColor="#9CA3AF"
                    />
                  </View>

                  <TouchableOpacity
                    onPress={() => handleSaveCategoryBudget(selectedCategory)}
                    className="bg-blue-600 p-4 rounded-xl mb-2"
                  >
                    <Text className="text-center text-white font-semibold">
                      Update Budget
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => setIsCategoryModalVisible(false)}
                    className="bg-gray-100 p-4 rounded-xl"
                  >
                    <Text className="text-center text-gray-600 font-semibold">
                      Cancel
                    </Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Budget;
