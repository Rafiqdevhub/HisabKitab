import { FontAwesome5 } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { Platform, View } from "react-native";
import { BudgetProvider } from "../context/BudgetContext";
import { LocalizationProvider } from "../context/LocalizationContext";
import { ThemeProvider } from "../context/ThemeContext";
import "./global.css";

const TabLayout = () => (
  <ThemeProvider>
    <LocalizationProvider>
      <BudgetProvider>
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
              marginTop: 4,
            },
            tabBarIconStyle: {
              marginBottom: -4,
            },
            headerShown: false,
          }}
        >
          <Tabs.Screen
            name="(tabs)/index"
            options={{
              title: "Home",
              tabBarIcon: ({ color, focused }) => (
                <View className="items-center justify-center">
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
                <View className="items-center justify-center">
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
            name="(tabs)/data"
            options={{
              title: "Data",
              tabBarIcon: ({ color, focused }) => (
                <View className="items-center justify-center">
                  <FontAwesome5
                    name="chart-pie"
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
                <View className="items-center justify-center">
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
    </LocalizationProvider>
  </ThemeProvider>
);

export default TabLayout;
