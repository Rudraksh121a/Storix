import { Tabs } from "expo-router";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Theme } from "@/constants/theme/theme";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Theme.Colors.primary,
        tabBarInactiveTintColor: Theme.Colors.textSecondary,
        tabBarStyle: {
          backgroundColor: Theme.Colors.surface,
          borderTopColor: Theme.Colors.border,
        },
        tabBarLabelStyle: {
          fontFamily: Theme.Font.medium,
          fontSize: Theme.Font.size.sm,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
