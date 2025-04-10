import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Theme } from "@/constants/theme/theme"; // or remove if not using a custom theme

export default function AddItemLoggerScreen() {
  const [id, setId] = useState("");
  const [image, setImage] = useState("");
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");

  const handleLogItem = () => {
    if (!id || !title || !price || !quantity) {
      Alert.alert("Missing Fields", "Please fill in all fields.");
      return;
    }

    const item = {
      id,
      image,
      title,
      price: parseFloat(price),
      quantity: parseInt(quantity),
    };

    console.log("📦 New Item Data:\n", JSON.stringify(item, null, 2));
    Alert.alert("Success", "Item logged to console!");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Add Item</Text>

      <TextInput
        style={styles.input}
        placeholder="Item ID"
        value={id}
        onChangeText={setId}
      />
      <TextInput
        style={styles.input}
        placeholder="Image URL"
        value={image}
        onChangeText={setImage}
      />
      <TextInput
        style={styles.input}
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={styles.input}
        placeholder="Price"
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Quantity"
        value={quantity}
        onChangeText={setQuantity}
        keyboardType="numeric"
      />

      <TouchableOpacity style={styles.button} onPress={handleLogItem}>
        <Text style={styles.buttonText}>Log Item to Console</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f2f4f8",
  },
  heading: {
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 16,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
