import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Theme } from "@/constants/theme/theme";


export default function EditItemScreen({ route }: { route: any }) {
  const { item } = route.params;

  const [title, setTitle] = useState(item.title);
  const [price, setPrice] = useState(String(item.price));
  const [stock, setStock] = useState(String(item.quantity));

  const handleMockSave = () => {
    const updatedItem = {
      ...item,
      title,
      price: parseFloat(price),
      quantity: parseInt(stock),
    };
    console.log("📦 Updated Item:", JSON.stringify(updatedItem, null, 2));
    Alert.alert("Mock Save", "Check console for JSON output.");
  };

  const handleMockDelete = () => {
    console.log("🗑️ Deleted Item:", JSON.stringify(item, null, 2));
    Alert.alert("Mock Delete", "Item logged to console.");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Title</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="Enter title"
      />

      <Text style={styles.label}>Price (₹)</Text>
      <TextInput
        style={styles.input}
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
        placeholder="Enter price"
      />

      <Text style={styles.label}>Stock</Text>
      <TextInput
        style={styles.input}
        value={stock}
        onChangeText={setStock}
        keyboardType="numeric"
        placeholder="Enter stock"
      />

      <TouchableOpacity style={styles.saveButton} onPress={handleMockSave}>
        <Text style={styles.saveText}>Log Updated JSON</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.deleteButton} onPress={handleMockDelete}>
        <Text style={styles.deleteText}>Log Deleted JSON</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Theme.Spacing.lg,
    backgroundColor: Theme.Colors.background,
    flex: 1,
  },
  label: {
    color: Theme.Colors.textPrimary,
    fontSize: Theme.Font.size.md,
    fontFamily: Theme.Font.medium,
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: Theme.Colors.border,
    borderRadius: Theme.Radius.sm,
    padding: Theme.Spacing.sm,
    marginBottom: Theme.Spacing.md,
    backgroundColor: "#fff",
    fontSize: Theme.Font.size.md,
  },
  saveButton: {
    backgroundColor: Theme.Colors.primary,
    padding: Theme.Spacing.md,
    borderRadius: Theme.Radius.sm,
    alignItems: "center",
    marginTop: Theme.Spacing.md,
  },
  saveText: {
    color: "#fff",
    fontFamily: Theme.Font.semiBold,
  },
  deleteButton: {
    backgroundColor: "#ff3b30",
    padding: Theme.Spacing.md,
    borderRadius: Theme.Radius.sm,
    alignItems: "center",
    marginTop: Theme.Spacing.sm,
  },
  deleteText: {
    color: "#fff",
    fontFamily: Theme.Font.semiBold,
  },
});
