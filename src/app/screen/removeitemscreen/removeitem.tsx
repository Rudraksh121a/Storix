import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from "react-native";
import { useState, useEffect } from "react";
import { Theme } from "@/constants/theme/theme";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import CustomSearch from "@/components/search/customSearch";
import { useSQLiteContext } from "expo-sqlite";
import Toast from "react-native-toast-message";

export default function RemoveItemScreen() {
  const db = useSQLiteContext();
  const [searchQuery, setSearchQuery] = useState("");
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

  const handleRemoveItem = (id: string, title: string) => {
    Alert.alert(
      "Confirm Deletion",
      `Are you sure you want to delete ${title}?`,
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Yes",
          onPress: () => {
            Alert.alert(
              "Final Confirmation",
              "This action cannot be undone. Are you absolutely sure?",
              [
                {
                  text: "Cancel",
                  style: "cancel"
                },
                {
                  text: "Delete",
                  style: "destructive",
                  onPress: async () => {
                    try {
                      await db.withTransactionAsync(async () => {
                        // First delete from addcard table if exists
                        await db.runAsync(`DELETE FROM addcard WHERE product_id = ?`, [id]);
                        
                        // Then delete from products table
                        await db.runAsync(`DELETE FROM products WHERE id = ?`, [id]);
                        
                        setItems(prevItems => prevItems.filter(item => item.id !== id));
                        Toast.show({
                          type: "success",
                          text1: "Item deleted successfully"
                        });
                      });
                    } catch (error) {
                      console.error("Error deleting item:", error);
                      Alert.alert("Error", "Failed to delete item");
                    }
                  }
                }
              ]
            );
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <CustomSearch
        placeholder="Search Items"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      <Text style={styles.heading}>Remove Items</Text>

      {/* Show message when no items are available */}
      {filteredItems.length === 0 ? (
        <Text style={styles.noItemsText}>No items available</Text>
      ) : (
        <FlatList
          data={filteredItems}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.itemContainer}>
              <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{item.title}</Text>
                <Text style={styles.itemPrice}>₹{item.price}</Text>
              </View>
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => handleRemoveItem(item.id, item.title)}
              >
                <MaterialCommunityIcons name="delete" size={24} color={Theme.Colors.error} />
              </TouchableOpacity>
            </View>
          )}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.Colors.background,
    padding: Theme.Spacing.md,
  },
  heading: {
    fontSize: Theme.Font.size.lg,
    fontFamily: Theme.Font.semiBold,
    color: Theme.Colors.textPrimary,
    marginVertical: Theme.Spacing.sm,
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: Theme.Spacing.sm,
    backgroundColor: Theme.Colors.surface,
    borderRadius: Theme.Radius.md,
    marginBottom: Theme.Spacing.sm,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: Theme.Font.size.md,
    fontFamily: Theme.Font.medium,
    color: Theme.Colors.textPrimary,
  },
  itemPrice: {
    fontSize: Theme.Font.size.sm,
    fontFamily: Theme.Font.regular,
    color: Theme.Colors.textSecondary,
  },
  removeButton: {
    padding: Theme.Spacing.xs,
  },
  noItemsText: {
    fontSize: Theme.Font.size.md,
    fontFamily: Theme.Font.regular,
    color: Theme.Colors.textSecondary,
    textAlign: "center",
    marginTop: Theme.Spacing.lg,
  },
});
