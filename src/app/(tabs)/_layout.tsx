import { Tabs } from "expo-router";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
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
        height: 60,
        paddingBottom: 6,
        paddingTop: 4,
      },
      tabBarLabelStyle: {
        fontFamily: Theme.Font.medium,
        fontSize: Theme.Font.size.sm,
      },
    }}
    >
    <Tabs.Screen
      name="index"
      options={{
        title: "items",
        tabBarIcon: ({ color, size }) => (
          <MaterialCommunityIcons name="cart" color={color} size={size} />
        ),
      }}
    />
      <Tabs.Screen
        name="items"
        options={{
          title: "items",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="pencil" color={color} size={size} />
          ),
        }}
      />
        <Tabs.Screen
          name="analysis"
          options={{
            title: "Analysis",
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="chart-box" color={color} size={size} />
            ),
          }}
        />
    </Tabs>
  );
}
