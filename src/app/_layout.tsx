import { Stack } from "expo-router";
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from "@expo-google-fonts/inter";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import Toast from "react-native-toast-message";
import { SQLiteProvider } from "expo-sqlite";
import * as FileSystem from "expo-file-system";
import { Asset } from "expo-asset";
import * as React from "react";
import { View } from "react-native";

export default function RootLayout() {
  const [dbLoaded, setDbLoaded] = React.useState<boolean>(false);
  const [fontloaded, fonterror] = useFonts({
    Inter: Inter_400Regular,
    InterMedium: Inter_500Medium,
    InterSemiBold: Inter_600SemiBold,
    InterBold: Inter_700Bold,
  });

  const loadDatabase = async () => {
    const dbName = "mySQLiteDB.db";
    const dbAsset = require("../../assets/mySQLiteDB.db");
    const dbUri = Asset.fromModule(dbAsset).uri;
    const dbFilePath = `${FileSystem.documentDirectory}SQLite/${dbName}`;

    const fileInfo = await FileSystem.getInfoAsync(dbFilePath);
    if (!fileInfo.exists) {
      await FileSystem.makeDirectoryAsync(
        `${FileSystem.documentDirectory}SQLite`,
        { intermediates: true }
      );
      await FileSystem.downloadAsync(dbUri, dbFilePath);
    }
  };

  useEffect(() => {
    loadDatabase()
      .then(() => setDbLoaded(true))
      .catch((e) => console.error(e));
  }, []);

  useEffect(() => {
    if ((fontloaded || fonterror) && dbLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontloaded, fonterror, dbLoaded]);

  if (!fontloaded && !fonterror && !dbLoaded) {
    return null;
  }

  return (
    <SQLiteProvider databaseName="mySQLiteDB.db" useSuspense>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" options={{ title: "rudra" }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
      <View style={{ position: 'absolute', top: 0, left: 0, right: 0 }}>
        <Toast />
      </View>
    </SQLiteProvider>
  );
}
