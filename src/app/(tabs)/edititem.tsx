import { View, Text, TouchableOpacity, Alert, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

export default function EditItemScreen() {
  const router = useRouter();
  const handleAddItem = () => {
    router.push("/screen/addItemScreen/addItemForm"); // Fixed route path
  };

  const handleRemoveItem = () => {
    Alert.alert("Coming Soon", "This feature will be available soon!");
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.button}
        onPress={handleAddItem}
      >
        <Text style={styles.buttonText}>Add Item</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={handleRemoveItem}
      >
        <Text style={styles.buttonText}>Remove Item</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  button: {
    backgroundColor: "#1a73e8",
    padding: 15,
    borderRadius: 8,
    width: "80%",
    alignItems: "center",
    marginVertical: 10,
  },
  buttonText: {
    color: "#fff", 
    fontSize: 16,
    fontWeight: "bold",
  }
});