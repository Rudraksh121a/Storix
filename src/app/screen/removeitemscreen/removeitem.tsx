import { View, Text, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { useState } from "react";
import { Theme } from "@/constants/theme/theme";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import CustomSearch from "@/components/search/customSearch";
import data from "../../../../assets/data/data.json";

export default function RemoveItemScreen() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredData = data.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRemoveItem = (id: string) => {
    // TODO: Implement remove item functionality
    console.log("Remove item:", id);
  };

  return (
    <View style={styles.container}>
      <CustomSearch
        placeholder="Search Items"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      <Text style={styles.heading}>Remove Items</Text>

      <FlatList
        data={filteredData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <View style={styles.itemInfo}>
              <Text style={styles.itemName}>{item.title}</Text>
              <Text style={styles.itemPrice}>₹{item.price}</Text>
            </View>
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => handleRemoveItem(item.id)}
            >
              <MaterialCommunityIcons name="delete" size={24} color={Theme.Colors.error} />
            </TouchableOpacity>
          </View>
        )}
        showsVerticalScrollIndicator={false}
      />
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
});
