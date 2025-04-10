import { View, Text, Pressable, Animated } from "react-native";
import { useRouter } from "expo-router";
import { Theme } from "@/constants/theme/theme";
import { useRef } from "react";

export default function FirstScreen() {
  const router = useRouter();
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const onPressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const onPressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start(() => router.replace("/(tabs)"));
  };

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
          marginBottom: Theme.Spacing.sm,
          letterSpacing: 1.2,
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
          maxWidth: 300,
          lineHeight: 24,
        }}
      >
        Smart Inventory & Cart Manager for Businesses
      </Text>

      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <Pressable
          onPressIn={onPressIn}
          onPressOut={onPressOut}
          style={{
            backgroundColor: Theme.Colors.accent,
            paddingVertical: Theme.Spacing.md,
            paddingHorizontal: Theme.Spacing.xl,
            borderRadius: Theme.Radius.lg,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.2,
            shadowRadius: 5,
            elevation: 6,
          }}
        >
          <Text
            style={{
              color: "#fff",
              fontSize: Theme.Font.size.md,
              fontFamily: Theme.Font.medium,
              letterSpacing: 0.8,
            }}
          >
            Get Started
          </Text>
        </Pressable>
      </Animated.View>
    </View>
  );
}
