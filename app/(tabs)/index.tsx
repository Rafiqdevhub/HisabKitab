import { FontAwesome5 } from "@expo/vector-icons";
import { SafeAreaView, ScrollView, Text, View } from "react-native";
import { useBudget } from "../../context/BudgetContext";

interface StatCardProps {
  title: string;
  value: string;
  bgColor?: string;
}

const StatCard = ({ title, value, bgColor = "bg-white" }: StatCardProps) => (
  <View className={`${bgColor} p-4 rounded-xl shadow-sm m-1 flex-1`}>
    <Text className="text-gray-600 text-sm">{title}</Text>
    <Text className="text-lg font-semibold mt-1">{value}</Text>
  </View>
);

interface CategoryCardProps {
  title: string;
  icon: string;
  amount: string;
  bgColor: string;
  iconColor: string;
}

const CategoryCard = ({
  title,
  icon,
  amount,
  bgColor,
  iconColor,
}: CategoryCardProps) => (
  <View
    className={`${bgColor} p-4 rounded-xl m-2 w-32`}
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
      className={`${iconColor} w-10 h-10 rounded-full items-center justify-center mb-2`}
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
      }}
    >
      <FontAwesome5 name={icon} size={20} color="white" />
    </View>
    <Text className="text-gray-700 font-medium mb-1">{title}</Text>
    <Text className="text-gray-900 font-bold">{amount}</Text>
  </View>
);

const formatCurrency = (amount: number) => {
  return `PKR ${amount.toLocaleString()}`;
};

const Index = () => {
  const { totalBudget, categories } = useBudget();

  // Calculate total spent amount
  const totalSpent = categories.reduce(
    (sum, category) => sum + category.spent,
    0
  );

  // Calculate spent percentage
  const spentPercentage =
    totalBudget > 0
      ? Math.min(Math.round((totalSpent / totalBudget) * 100), 100)
      : 0;

  // Calculate remaining budget
  const remainingBudget = Math.max(totalBudget - totalSpent, 0);

  // Calculate last 7 days spending
  const last7DaysSpent = 0; // This would need actual date tracking to implement

  // Calculate last month's spending
  const lastMonthSpent = 0; // This would need actual date tracking to implement

  return (
    <SafeAreaView className="flex-1 bg-gray-100" style={{ paddingBottom: 16 }}>
      <ScrollView
        showsVerticalScrollIndicator={true}
        contentContainerStyle={{ paddingBottom: 32 }}
        stickyHeaderIndices={[2]}
      >
        {/* App Title Card */}
        <View className="m-4">
          <View
            style={{
              backgroundColor: "#1d4ed8", // solid blue background as fallback
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
                <FontAwesome5 name="wallet" size={40} color="white" />
              </View>
            </View>

            {/* App Name and Primary Tagline */}
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
                HisabKitab
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
                  Clear hisaab, happy ghar
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

              {/* Feature Highlights */}
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
                    Smart Budget Tracking
                  </Text>
                </View>
                <View className="flex-row items-center mb-3">
                  <FontAwesome5 name="check-circle" size={16} color="white" />
                  <Text className="text-white text-sm ml-2 font-medium">
                    Category-wise Expenses
                  </Text>
                </View>
                <View className="flex-row items-center">
                  <FontAwesome5 name="check-circle" size={16} color="white" />
                  <Text className="text-white text-sm ml-2 font-medium">
                    Family Finance Management
                  </Text>
                </View>
              </View>

              {/* Family Focus Highlight */}
              <View
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.15)",
                  borderRadius: 8,
                  padding: 12,
                  width: "100%",
                }}
              >
                <View className="flex-row items-center justify-center">
                  <FontAwesome5 name="home" size={14} color="white" />
                  <Text className="text-white text-sm ml-2 text-center font-medium">
                    Perfect for families tracking daily expenses
                  </Text>
                </View>
              </View>

              {/* Trust Indicator */}
              <View className="mt-4 flex-row items-center">
                <FontAwesome5 name="shield-alt" size={14} color="white" />
                <Text className="text-white text-xs ml-2">
                  Your trusted companion for simple & secure budgeting
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Main Spending Card */}
        <View className="m-4">
          <View className="bg-blue-600 p-6 rounded-xl shadow-lg">
            <Text className="text-blue-100 text-base">
              Current Month&apos;s Budget
            </Text>
            <Text className="text-white text-3xl font-bold mt-2">
              {formatCurrency(totalSpent)}
            </Text>
            <Text className="text-blue-100 text-sm mt-1">
              Monthly Budget: {formatCurrency(totalBudget)}
            </Text>
            <View className="mt-4 bg-blue-500 rounded-full h-2">
              <View
                className="bg-blue-200 h-2 rounded-full"
                style={{ width: `${spentPercentage}%` }}
              />
            </View>
            <View className="flex-row justify-between mt-2">
              <Text className="text-blue-100 text-sm">
                {spentPercentage}% spent
              </Text>
              <Text className="text-blue-100 text-sm">
                {formatCurrency(remainingBudget)} remaining
              </Text>
            </View>
          </View>
        </View>

        {/* Categories Section - Now Sticky */}
        <View className="px-4 bg-gray-100 py-2">
          <Text className="text-lg font-semibold text-gray-800 mb-2">
            Categories
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingRight: 16 }}
          >
            {categories.map((category, index) => (
              <CategoryCard
                key={index}
                title={category.title}
                icon={category.icon}
                amount={formatCurrency(category.spent)}
                bgColor={category.bgColor}
                iconColor={category.iconColor}
              />
            ))}
          </ScrollView>
        </View>

        {/* Stats Grid */}
        <View className="px-4 mt-4 mb-4">
          <Text className="text-lg font-semibold text-gray-800 mb-2">
            Overview
          </Text>
          <View className="flex-row">
            <StatCard
              title="Total Budget"
              value={formatCurrency(totalBudget)}
              bgColor="bg-gray-50"
            />
            <StatCard
              title="Remaining"
              value={formatCurrency(remainingBudget)}
              bgColor="bg-green-50"
            />
          </View>
          <View className="flex-row mt-2">
            <StatCard
              title="Last Month"
              value={formatCurrency(lastMonthSpent)}
              bgColor="bg-purple-50"
            />
            <StatCard
              title="Last 7 Days"
              value={formatCurrency(last7DaysSpent)}
              bgColor="bg-orange-50"
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Index;
