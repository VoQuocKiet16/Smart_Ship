import * as React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "./login";
import Index from "./index";
import ManagementScreen from "./manage";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName: keyof typeof MaterialCommunityIcons.glyphMap = "home";
          if (route.name === "Control") iconName = "thermometer";
          else if (route.name === "Management") iconName = "clipboard-list";
          return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#2196F3",
        tabBarInactiveTintColor: "#999"
      })}
    >
      <Tab.Screen name="Control" component={Index} options={{ title: "Trạng thái" }} />
      <Tab.Screen name="Management" component={ManagementScreen} options={{ title: "Quản lý" }} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Index" component={MainTabs} />
    </Stack.Navigator>
  );
}
