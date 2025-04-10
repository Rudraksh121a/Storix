import { Stack } from "expo-router";
import { Inter_400Regular,Inter_500Medium,Inter_600SemiBold,Inter_700Bold, useFonts } from "@expo-google-fonts/inter";
import * as SplashScreen from "expo-splash-screen"
import { useEffect } from "react";

export default function RootLayout() {
  const [fontloaded, fonterror] = useFonts({
    Inter: Inter_400Regular,
    InterMedium: Inter_500Medium,
    InterSemiBold: Inter_600SemiBold,
    InterBold: Inter_700Bold,

  });

  useEffect(() => {
    if (fontloaded || fonterror) {
      SplashScreen.hideAsync();
    }
  }, [fontloaded, fonterror]);

  if (!fontloaded && !fonterror) {
    return null;
  }

  return (
    <Stack
      screenOptions={{
      }}
    >
    <Stack.Screen name="index" options={{title:"rudra"}}/>
    </Stack>
  );
}