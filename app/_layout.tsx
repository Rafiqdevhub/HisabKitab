import { FontAwesome5 } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { Platform, StatusBar, View } from "react-native";
import { BudgetProvider } from "../context/BudgetContext";
import "./global.css";

const TabLayout = () => (
  <BudgetProvider>
    <StatusBar
      translucent={true}
      backgroundColor="transparent"
      barStyle="dark-content"
    />
    <Tabs
      screenOptions={{
        tabBarStyle: {
          height: Platform.OS === "ios" ? 85 : 65,
          paddingBottom: Platform.OS === "ios" ? 25 : 10,
          paddingTop: 10,
          backgroundColor: "white",
          borderTopWidth: 0,
          borderRadius: 20,
          marginBottom: 10,
          marginHorizontal: 10,
          position: "absolute",
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
        },
        tabBarActiveTintColor: "#0891B2",
        tabBarInactiveTintColor: "#6B7280",
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "500",
          marginTop: 0,
        },
        tabBarIconStyle: {
          marginBottom: 0,
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="(tabs)/index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <View className="items-center justify-center mb-1">
              <FontAwesome5
                name="home"
                size={24}
                color={color}
                solid={focused}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="(tabs)/budget"
        options={{
          title: "Budget",
          tabBarIcon: ({ color, focused }) => (
            <View className="items-center justify-center mb-1">
              <FontAwesome5
                name="piggy-bank"
                size={24}
                color={color}
                solid={focused}
              />
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="(tabs)/settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color, focused }) => (
            <View className="items-center justify-center mb-1">
              <FontAwesome5
                name="cogs"
                size={24}
                color={color}
                solid={focused}
              />
            </View>
          ),
        }}
      />
    </Tabs>
  </BudgetProvider>
);

export default TabLayout;
