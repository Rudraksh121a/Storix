import {
  View,
  Text,
  Pressable,
  Animated,
  StyleSheet,
  Dimensions,
  Image,
  StatusBar,
} from "react-native";
import { useRouter } from "expo-router";
import { Theme } from "@/constants/theme/theme";
import { useRef, useEffect } from "react";
import { LinearGradient } from "expo-linear-gradient";

const { width, height } = Dimensions.get("window");

export default function FirstScreen() {
  const router = useRouter();
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Hide status bar when component mounts
    StatusBar.setHidden(true);

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    // Show status bar again when component unmounts
    return () => {
      StatusBar.setHidden(false);
    };
  }, []);

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
    <LinearGradient
      colors={["#007AFF", "#0040ff", "#001f7f"]}
      style={styles.container}
    >
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <View style={styles.logoContainer}>
          <Text style={styles.title}>Storix</Text>
          <View style={styles.underline} />
        </View>
        
        <Text style={styles.subtitle}>
          Smart Inventory & Cart Manager{"\n"}for Modern Businesses
        </Text>

        <View style={styles.imageContainer}>
          <Image 
            source={require("../../assets/icon.png")} 
            style={styles.logo}
          />
        </View>

        <Animated.View style={[styles.buttonContainer, { transform: [{ scale: scaleAnim }] }]}>
          <Pressable 
            onPressIn={onPressIn} 
            onPressOut={onPressOut} 
            style={styles.button}
          >
            <Text style={styles.buttonText}>Get Started</Text>
          </Pressable>
        </Animated.View>
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    alignItems: "center",
    paddingHorizontal: 32,
    width: "100%",
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontFamily: Theme.Font.bold,
    fontSize: 52,
    color: "#fff",
    marginBottom: 8,
    letterSpacing: 2,
  },
  underline: {
    width: 60,
    height: 4,
    backgroundColor: "#fff",
    borderRadius: 2,
  },
  subtitle: {
    fontFamily: Theme.Font.regular,
    fontSize: 20,
    color: "#f0f4ff",
    textAlign: "center",
    marginBottom: 40,
    lineHeight: 28,
  },
  imageContainer: {
    width: width * 0.6,
    height: width * 0.6,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: width * 0.3,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 40,
  },
  logo: {
    width: width * 0.4,
    height: width * 0.4,
    resizeMode: "contain",
  },
  buttonContainer: {
    width: "100%",
    paddingHorizontal: 20,
  },
  button: {
    backgroundColor: "#fff",
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 12,
  },
  buttonText: {
    color: "#007AFF",
    fontSize: 20,
    fontFamily: Theme.Font.bold,
    letterSpacing: 1,
    textAlign: "center",
  },
});
