import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  Alert,
} from "react-native";
import { useState, useEffect } from "react";
import { Theme } from "@/constants/theme/theme";
import CustomSearch from "@/components/search/customSearch";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { useSQLiteContext } from "expo-sqlite";
import { useRouter } from "expo-router";

export default function EditItemScreen() {
  const db = useSQLiteContext();
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const result = await db.getAllAsync(`SELECT * FROM products`);
      setItems(result);
    } catch (error) {
      console.error("Error fetching items:", error);
      Alert.alert("Error", "Failed to fetch items");
    }
  };

  const filteredItems = items.filter((item) =>
    item.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleItemSelect = (item: any) => {
    setSelectedItem(item);
    setTitle(item.title);
    setPrice(item.price.toString());
    setQuantity(item.quantity.toString());
    setImageUri(item.image);
  };

  const pickImage = async (type: "camera" | "gallery") => {
    try {
      let permissionResult;
      let result;

      if (type === "camera") {
        permissionResult = await ImagePicker.requestCameraPermissionsAsync();
        if (!permissionResult.granted) {
          Alert.alert("Permission required", "Camera permission is needed.");
          return;
        }

        result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        });
      } else {
        permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permissionResult.granted) {
          Alert.alert("Permission required", "Gallery permission is needed.");
          return;
        }

        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        });
      }

      if (!result.canceled) {
        setImageUri(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to pick image");
      console.error(error);
    }
  };

  const handleSubmit = async () => {
    if (!selectedItem || !title || !price || !quantity || !imageUri) {
      Alert.alert("All fields are required");
      return;
    }

    try {
      await db.withTransactionAsync(async () => {
        await db.runAsync(
          `UPDATE products SET image = ?, title = ?, price = ?, quantity = ? WHERE id = ?`,
          [imageUri, title, parseFloat(price), parseInt(quantity), selectedItem.id]
        );
      });

      Alert.alert("Success", `Item '${title}' updated successfully!`);
      fetchItems();
      setSelectedItem(null);
    } catch (error) {
      console.error("Update error:", error);
      Alert.alert("Error", "Failed to update item");
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color={Theme.Colors.textPrimary} />
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>

      <Text style={styles.heading}>Edit Item</Text>

      <View style={styles.searchContainer}>
        <CustomSearch
          placeholder="Search Items"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {!selectedItem ? (
        <FlatList
          data={filteredItems}
          keyExtractor={(item) => item.id?.toString() ?? Math.random().toString()}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.itemCard} onPress={() => handleItemSelect(item)}>
              <Text style={styles.itemTitle}>{item.title}</Text>
              <Text style={styles.itemDetails}>
                Price: ₹{item.price} | Quantity: {item.quantity}
              </Text>
            </TouchableOpacity>
          )}
        />
      ) : (
        <View style={styles.form}>
          <View style={styles.imagePickerContainer}>
            {imageUri ? (
              <Image source={{ uri: imageUri }} style={styles.image} />
            ) : (
              <View style={styles.placeholderContainer}>
                <Text style={styles.placeholderText}>No image selected</Text>
              </View>
            )}

            <View style={styles.imageButtonsContainer}>
              <TouchableOpacity style={styles.imageButton} onPress={() => pickImage("camera")}>
                <Ionicons name="camera" size={24} color={Theme.Colors.primary} />
                <Text style={styles.buttonLabel}>Camera</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.imageButton} onPress={() => pickImage("gallery")}>
                <Ionicons name="images" size={24} color={Theme.Colors.primary} />
                <Text style={styles.buttonLabel}>Gallery</Text>
              </TouchableOpacity>
            </View>
          </View>

          <TextInput
            style={styles.input}
            placeholder="Enter Title"
            placeholderTextColor={Theme.Colors.textSecondary}
            value={title}
            onChangeText={setTitle}
          />

          <TextInput
            style={styles.input}
            placeholder="Enter Price"
            placeholderTextColor={Theme.Colors.textSecondary}
            value={price}
            onChangeText={setPrice}
            keyboardType="numeric"
          />

          <TextInput
            style={styles.input}
            placeholder="Enter Quantity"
            placeholderTextColor={Theme.Colors.textSecondary}
            value={quantity}
            onChangeText={setQuantity}
            keyboardType="numeric"
          />

          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Save Changes</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Theme.Spacing.lg,
    backgroundColor: Theme.Colors.background,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Theme.Spacing.sm,
  },
  backButtonText: {
    marginLeft: 8,
    fontFamily: Theme.Font.medium,
    fontSize: Theme.Font.size.md,
    color: Theme.Colors.textPrimary,
  },
  heading: {
    fontSize: Theme.Font.size.xl,
    fontFamily: Theme.Font.bold,
    color: Theme.Colors.textPrimary,
    marginBottom: Theme.Spacing.lg,
    textAlign: "center",
  },
  searchContainer: {
    marginBottom: Theme.Spacing.md,
  },
  itemCard: {
    backgroundColor: Theme.Colors.surface,
    padding: Theme.Spacing.md,
    borderRadius: Theme.Radius.md,
    marginBottom: Theme.Spacing.sm,
    borderWidth: 1,
    borderColor: Theme.Colors.border,
  },
  itemTitle: {
    fontSize: Theme.Font.size.md,
    fontFamily: Theme.Font.semiBold,
    color: Theme.Colors.textPrimary,
    marginBottom: 4,
  },
  itemDetails: {
    fontSize: Theme.Font.size.sm,
    color: Theme.Colors.textSecondary,
  },
  form: {
    flex: 1,
  },
  imagePickerContainer: {
    marginBottom: Theme.Spacing.lg,
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: Theme.Radius.lg,
    marginBottom: Theme.Spacing.md,
  },
  placeholderContainer: {
    width: "100%",
    height: 200,
    backgroundColor: Theme.Colors.surface,
    borderRadius: Theme.Radius.lg,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Theme.Spacing.md,
    borderWidth: 1,
    borderColor: Theme.Colors.border,
  },
  placeholderText: {
    color: Theme.Colors.textSecondary,
    fontFamily: Theme.Font.medium,
  },
  imageButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: Theme.Spacing.sm,
  },
  imageButton: {
    alignItems: "center",
    backgroundColor: Theme.Colors.surface,
    padding: Theme.Spacing.md,
    borderRadius: Theme.Radius.md,
    width: "45%",
  },
  buttonLabel: {
    marginTop: Theme.Spacing.xs,
    color: Theme.Colors.textPrimary,
    fontFamily: Theme.Font.medium,
  },
  input: {
    backgroundColor: Theme.Colors.surface,
    padding: Theme.Spacing.md,
    borderRadius: Theme.Radius.md,
    marginBottom: Theme.Spacing.md,
    fontSize: Theme.Font.size.md,
    color: Theme.Colors.textPrimary,
    borderWidth: 1,
    borderColor: Theme.Colors.border,
  },
  submitButton: {
    backgroundColor: Theme.Colors.primary,
    padding: Theme.Spacing.md,
    borderRadius: Theme.Radius.md,
    alignItems: "center",
    marginTop: Theme.Spacing.md,
  },
  submitButtonText: {
    color: "white",
    fontSize: Theme.Font.size.md,
    fontFamily: Theme.Font.semiBold,
  },
});
