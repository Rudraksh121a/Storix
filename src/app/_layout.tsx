import { Stack } from "expo-router";
import { Inter_400Regular,Inter_500Medium,Inter_600SemiBold,Inter_700Bold, useFonts } from "@expo-google-fonts/inter";
import * as SplashScreen from "expo-splash-screen"
import { useEffect } from "react";
import Toast from "react-native-toast-message";
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite'
import schema from '@/utils/model/schema'
import migrations from '@/utils/model/migrations'



const adapter = new SQLiteAdapter({
  schema,
  // (You might want to comment it out for development purposes -- see Migrations documentation)
  migrations,
  // (optional database name or file system path)
  // dbName: 'myapp',
  // (recommended option, should work flawlessly out of the box on iOS. On Android,
  // additional installation steps have to be taken - disable if you run into issues...)
  jsi: true, /* Platform.OS === 'ios' */
  // (optional, but you should implement this method)
  onSetUpError: error => {
    // Database failed to load -- offer the user to reload the app or log out
  }
})








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
        headerShown: false,
      }}
    >
    <Stack.Screen name="index" options={{title:"rudra"}}/>
    <Toast />
    </Stack>
  );
}