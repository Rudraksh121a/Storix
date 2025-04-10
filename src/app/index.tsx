import { View, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { Theme } from "@/constants/theme/theme";  

export default function FirstScreen() {
  const router = useRouter();

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: Theme.Colors.background,
        justifyContent: "center",
        alignItems: "center",
        padding: Theme.Spacing.lg,
      }}
    >
      <Text
        style={{
          fontFamily: Theme.Font.bold,
          fontSize: Theme.Font.size.xxl,
          color: Theme.Colors.primary,
          marginBottom: Theme.Spacing.md,
        }}
      >
        Storix
      </Text>
      <Text
        style={{
          fontFamily: Theme.Font.regular,
          fontSize: Theme.Font.size.md,
          color: Theme.Colors.textSecondary,
          textAlign: "center",
          marginBottom: Theme.Spacing.xl,
        }}
      >
        Smart Inventory & Cart Manager for the Businesses
      </Text>

      <Pressable
        onPress={() => router.replace("/(tabs)")}
        style={{
          backgroundColor: Theme.Colors.accent,
          paddingVertical: Theme.Spacing.md,
          paddingHorizontal: Theme.Spacing.xl,
          borderRadius: Theme.Radius.lg,
        }}
      >
        <Text
          style={{
            color: "#fff",
            fontSize: Theme.Font.size.md,
            fontFamily: Theme.Font.medium,
          }}
        >
          Get Started
        </Text>
      </Pressable>
    </View>
  );
}
