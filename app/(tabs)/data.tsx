import { FontAwesome5 } from "@expo/vector-icons";
import * as Print from "expo-print";
import React, { useState } from "react";
import {
  Alert,
  Dimensions,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { BarChart, LineChart, PieChart } from "react-native-chart-kit";
import { SafeAreaView } from "react-native-safe-area-context";
import { useBudget } from "../../context/BudgetContext";

const formatCurrency = (amount: number) => {
  return `PKR ${amount.toLocaleString()}`;
};

// Color mapping from Tailwind classes to hex values
const colorMap: { [key: string]: string } = {
  "bg-green-500": "#22c55e",
  "bg-blue-500": "#3b82f6",
  "bg-yellow-500": "#eab308",
  "bg-red-500": "#ef4444",
  "bg-purple-500": "#a855f7",
};

const Data = () => {
  const { totalBudget, categories } = useBudget();
  const screenWidth = Dimensions.get("window").width;
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);

  // Calculate total spent and remaining
  const totalSpent = categories.reduce(
    (sum, category) => sum + category.spent,
    0
  );
  const remainingBudget = Math.max(totalBudget - totalSpent, 0);
  const spentPercentage =
    totalBudget > 0 ? Math.min((totalSpent / totalBudget) * 100, 100) : 0;

  // Prepare data for charts with proper color mapping
  const pieChartData = categories.map((category) => ({
    name: category.title,
    spent: category.spent,
    color: colorMap[category.iconColor] || "#6b7280", // fallback to gray if color not found
    legendFontColor: "#7F7F7F",
    legendFontSize: 12,
  }));

  // Prepare weekly data
  const weeklyData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        data: [20, 45, 28, 80, 99, 43, 50],
      },
    ],
  };

  // Prepare monthly data
  const monthlyData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        data: [100, 80, 60, 120, 90, 100],
        color: (opacity = 1) => `rgba(46, 204, 113, ${opacity})`,
        strokeWidth: 2,
      },
      {
        data: [70, 50, 90, 80, 85, 75],
        color: (opacity = 1) => `rgba(231, 76, 60, ${opacity})`,
        strokeWidth: 2,
      },
    ],
  };

  const handleGenerateReport = async () => {
    if (isGeneratingReport) return;

    setIsGeneratingReport(true);
    try {
      // Try to generate the PDF file first
      const { uri } = await Print.printToFileAsync({
        html: "<html><body><p>Test print</p></body></html>",
        base64: false,
      });

      if (!uri) {
        throw new Error("Failed to generate PDF file");
      }

      // If file generation succeeds, try to generate the full report
      const html = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
              body { 
                font-family: system-ui, -apple-system, sans-serif;
                padding: 20px;
                max-width: 800px;
                margin: 0 auto;
              }
              table { width: 100%; border-collapse: collapse; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              th { background-color: #f8fafc; }
            </style>
          </head>
          <body>
            <h1>MoneyWise Financial Report</h1>
            <p>${new Date().toLocaleDateString()}</p>
            <h2>Summary</h2>
            <p>Total Budget: ${formatCurrency(totalBudget)}</p>
            <p>Total Spent: ${formatCurrency(totalSpent)}</p>
            <p>Remaining: ${formatCurrency(remainingBudget)}</p>
            <h2>Categories</h2>
            <table>
              <tr>
                <th>Category</th>
                <th>Budget</th>
                <th>Spent</th>
                <th>Remaining</th>
              </tr>
              ${categories
                .map(
                  (cat) => `
                <tr>
                  <td>${cat.title}</td>
                  <td>${formatCurrency(cat.budget)}</td>
                  <td>${formatCurrency(cat.spent)}</td>
                  <td>${formatCurrency(cat.budget - cat.spent)}</td>
                </tr>
              `
                )
                .join("")}
            </table>
          </body>
        </html>
      `;

      // Try to print the report
      await Print.printAsync({
        uri: uri,
        html: html,
        printerUrl: undefined,
        orientation: Print.Orientation.portrait,
      }).catch(() => {
        // If printing fails, show a simple error
        throw new Error("Unable to print at this time");
      });
    } catch (error) {
      // Show a user-friendly error message
      Alert.alert(
        "Unable to Generate Report",
        "The report could not be generated at this time. Please try again later.",
        [{ text: "OK" }]
      );
      console.warn("Report generation failed:", error);
    } finally {
      setIsGeneratingReport(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
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
                <FontAwesome5 name="chart-pie" size={32} color="white" />
              </View>
            </View>

            <View className="items-center">
              <Text className="text-white text-3xl font-bold tracking-wider mb-2">
                Financial Overview
              </Text>
              <Text className="text-white/90 text-base text-center mb-4">
                Every rupee has a story—let&apos;s keep track of yours
              </Text>
            </View>
          </View>
        </View>

        {/* Financial Summary Cards */}
        <View className="px-4 mb-6">
          {/* Budget Progress */}
          <View className="bg-white p-6 rounded-xl shadow mb-4">
            <View className="mb-2">
              <View className="flex-row justify-between mb-2">
                <Text className="text-gray-600">Budget Used</Text>
                <Text className="text-gray-800 font-semibold">
                  {spentPercentage.toFixed(1)}%
                </Text>
              </View>
              <View className="bg-gray-200 h-2 rounded-full">
                <View
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: `${spentPercentage}%` }}
                />
              </View>
            </View>
          </View>

          {/* Financial Cards Row */}
          <View className="flex-row w-full">
            {/* Total Budget Card */}
            <View
              className="bg-white p-4 rounded-xl shadow-md flex-1 mr-2"
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 3,
                minHeight: 120,
                width: "33%",
              }}
            >
              <View className="items-center justify-between flex-1">
                <View className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center mb-2">
                  <FontAwesome5 name="wallet" size={20} color="#4B5563" />
                </View>
                <View className="flex-1 justify-center">
                  <Text className="text-gray-600 text-center text-sm mb-1">
                    Total Budget
                  </Text>
                  <Text className="text-center font-bold text-gray-800 text-base">
                    {formatCurrency(totalBudget)}
                  </Text>
                </View>
              </View>
            </View>

            {/* Total Expenses Card */}
            <View
              className="bg-white p-4 rounded-xl shadow-md flex-1 mx-2"
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 3,
                minHeight: 120,
                width: "33%",
              }}
            >
              <View className="items-center justify-between flex-1">
                <View className="w-10 h-10 bg-red-100 rounded-full items-center justify-center mb-2">
                  <FontAwesome5
                    name="shopping-cart"
                    size={20}
                    color="#EF4444"
                  />
                </View>
                <View className="flex-1 justify-center">
                  <Text className="text-gray-600 text-center text-sm mb-1">
                    Total Expenses
                  </Text>
                  <Text className="text-center font-bold text-red-600 text-base">
                    {formatCurrency(totalSpent)}
                  </Text>
                </View>
              </View>
            </View>

            {/* Remaining Balance Card */}
            <View
              className="bg-white p-4 rounded-xl shadow-md flex-1 ml-2"
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 3,
                minHeight: 120,
                width: "33%",
              }}
            >
              <View className="items-center justify-between flex-1">
                <View className="w-10 h-10 bg-green-100 rounded-full items-center justify-center mb-2">
                  <FontAwesome5 name="piggy-bank" size={20} color="#22C55E" />
                </View>
                <View className="flex-1 justify-center">
                  <Text className="text-gray-600 text-center text-sm mb-1">
                    Remaining Balance
                  </Text>
                  <Text className="text-center font-bold text-green-600 text-base">
                    {formatCurrency(remainingBudget)}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Charts Section */}
        <View className="px-4 mb-6">
          <Text className="text-lg font-semibold text-gray-800 mb-4">
            Expense Analysis
          </Text>

          {/* Pie Chart */}
          <View className="bg-white p-4 rounded-xl shadow mb-4">
            <Text className="text-base font-medium text-gray-700 mb-4">
              Expense Distribution
            </Text>
            <View className="items-center">
              <PieChart
                data={pieChartData}
                width={screenWidth - 48}
                height={200}
                chartConfig={{
                  backgroundColor: "#ffffff",
                  backgroundGradientFrom: "#ffffff",
                  backgroundGradientTo: "#ffffff",
                  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                  style: {
                    borderRadius: 16,
                  },
                  propsForLabels: {
                    fontSize: "10",
                  },
                }}
                accessor="spent"
                backgroundColor="transparent"
                paddingLeft="0"
                center={[0, 0]}
                absolute
                hasLegend={true}
                avoidFalseZero
              />
            </View>
          </View>

          {/* Bar Chart - Weekly Spending */}
          <View className="bg-white p-4 rounded-xl shadow mb-4">
            <Text className="text-base font-medium text-gray-700 mb-4">
              Weekly Spending Trend
            </Text>
            <View className="items-center">
              <BarChart
                data={weeklyData}
                width={screenWidth - 48}
                height={200}
                yAxisLabel="PKR "
                yAxisSuffix=""
                chartConfig={{
                  backgroundColor: "#ffffff",
                  backgroundGradientFrom: "#ffffff",
                  backgroundGradientTo: "#ffffff",
                  decimalPlaces: 0,
                  color: (opacity = 1) => `rgba(29, 78, 216, ${opacity})`,
                  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                  propsForLabels: {
                    fontSize: 10,
                  },
                }}
                showValuesOnTopOfBars={true}
                fromZero
                style={{
                  borderRadius: 16,
                }}
              />
            </View>
          </View>

          {/* Line Chart - Income vs Expenses */}
          <View className="bg-white p-4 rounded-xl shadow">
            <Text className="text-base font-medium text-gray-700 mb-4">
              Income vs Expenses
            </Text>
            <View className="items-center">
              <LineChart
                data={monthlyData}
                width={screenWidth - 48}
                height={200}
                yAxisLabel="PKR "
                yAxisSuffix=""
                chartConfig={{
                  backgroundColor: "#ffffff",
                  backgroundGradientFrom: "#ffffff",
                  backgroundGradientTo: "#ffffff",
                  decimalPlaces: 0,
                  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                  propsForLabels: {
                    fontSize: 10,
                  },
                  strokeWidth: 2,
                }}
                bezier
                style={{
                  borderRadius: 16,
                }}
              />
            </View>
          </View>
        </View>

        {/* PDF Export Button */}
        <View className="px-4">
          <TouchableOpacity
            onPress={handleGenerateReport}
            className="bg-blue-600 p-4 rounded-xl flex-row items-center justify-center"
            disabled={isGeneratingReport}
          >
            <FontAwesome5
              name="file-pdf"
              size={20}
              color="white"
              className="mr-2"
            />
            <Text className="text-white font-semibold ml-2">
              {isGeneratingReport
                ? "Generating Report..."
                : "Generate Monthly Report"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Data;
