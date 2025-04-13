import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import CustomSearch from "@/components/search/customSearch";
import CustomCard from "@/components/itemcard/customCard";
import { Theme } from "@/constants/theme/theme";
import { router } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";

export default function ItemsScreen() {
  const db = useSQLiteContext();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [items, setItems] = useState<any[]>([]);
  const [priceFilter, setPriceFilter] = useState<"asc" | "desc" | null>(null);
  const [cardCount, setCardCount] = useState(0);

  useEffect(() => {
    fetchData();
  }, [db]);

  const fetchData = async () => {
    await db.withTransactionAsync(async () => {
      const addcardResult = await db.getAllAsync(`SELECT * FROM addcard`);
      setCardCount(addcardResult.length);

      const result = await db.getAllAsync(`SELECT * FROM products`);
      setItems(result);
    });
  };

  const filteredAndSortedItems = items
    .filter((item) =>
      item.title?.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (priceFilter === "asc") {
        return a.price - b.price;
      } else if (priceFilter === "desc") {
        return b.price - a.price;
      }
      return 0;
    });

  const handleItemPress = async (id: string) => {
    // Check if item already exists in cart
    const existingItem = await db.getAllAsync(
      `SELECT * FROM addcard WHERE product_id = ?`,
      [id]
    );

    if (existingItem.length > 0) {
      // If item exists, increment quantity
      await db.withTransactionAsync(async () => {
        await db.runAsync(
          `UPDATE addcard SET quantity = quantity + 1 WHERE product_id = ?`,
          [id]
        );
        const addcardResult = await db.getAllAsync(`SELECT * FROM addcard`);
        setCardCount(addcardResult.length);
      });
    } else {
      // If item doesn't exist, add new entry
      const updated = [...selectedIds, id];
      setSelectedIds(updated);

      await db.withTransactionAsync(async () => {
        await db.runAsync(
          `INSERT INTO addcard (product_id, quantity) VALUES (?, ?)`,
          [id, 1]
        );
        const addcardResult = await db.getAllAsync(`SELECT * FROM addcard`);
        setCardCount(addcardResult.length);
      });
    }
  };

  const handleBuyPress = async (item: any) => {
    // Check if item already exists in cart
    const existingItem = await db.getAllAsync(
      `SELECT * FROM addcard WHERE product_id = ?`,
      [item.id]
    );

    if (existingItem.length > 0) {
      // If item exists, increment quantity
      await db.withTransactionAsync(async () => {
        await db.runAsync(
          `UPDATE addcard SET quantity = quantity + 1 WHERE product_id = ?`,
          [item.id]
        );
        const addcardResult = await db.getAllAsync(`SELECT * FROM addcard`);
        setCardCount(addcardResult.length);
      });
    } else {
      // If item doesn't exist, add new entry
      const updated = [...selectedIds, item.id];
      setSelectedIds(updated);

      await db.withTransactionAsync(async () => {
        await db.runAsync(
          `INSERT INTO addcard (product_id, quantity) VALUES (?, ?)`,
          [item.id, 1]
        );
        const addcardResult = await db.getAllAsync(`SELECT * FROM addcard`);
        setCardCount(addcardResult.length);
      });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <CustomSearch
            placeholder="Search Items"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <View style={styles.receiptContainer}>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => router.push("/screen/addcardSeceen/addCardScreen")}
          >
            <MaterialCommunityIcons name="receipt" size={24} color="#fff" />
            {cardCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{cardCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.title}>Items</Text>

      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity
            style={[
              styles.filterButton,
              priceFilter === "asc" && styles.filterButtonActive,
            ]}
            onPress={() => setPriceFilter(priceFilter === "asc" ? null : "asc")}
          >
            <Text
              style={[
                styles.filterButtonText,
                priceFilter === "asc" && styles.filterButtonTextActive,
              ]}
            >
              Price: Low to High
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterButton,
              priceFilter === "desc" && styles.filterButtonActive,
            ]}
            onPress={() => setPriceFilter(priceFilter === "desc" ? null : "desc")}
          >
            <Text
              style={[
                styles.filterButtonText,
                priceFilter === "desc" && styles.filterButtonTextActive,
              ]}
            >
              Price: High to Low
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      <FlatList
        data={filteredAndSortedItems}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <CustomCard
            image={item.image}
            title={item.title}
            price={item.price}
            quantity={item.quantity}
            onPress={() => handleItemPress(item.id)}
          />
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Theme.Spacing.sm,
  },
  searchContainer: {
    flex: 1,
    marginRight: Theme.Spacing.sm,
  },
  receiptContainer: {
    position: "relative",
  },
  addButton: {
    backgroundColor: Theme.Colors.primary,
    padding: Theme.Spacing.sm,
    borderRadius: Theme.Radius.sm,
    justifyContent: "center",
    alignItems: "center",
  },
  badge: {
    position: "absolute",
    top: -8,
    right: -8,
    backgroundColor: Theme.Colors.error,
    borderRadius: 12,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
  },
  badgeText: {
    color: "#fff",
    fontSize: 12,
    fontFamily: Theme.Font.medium,
  },
  title: {
    fontFamily: Theme.Font.semiBold,
    fontSize: Theme.Font.size.lg,
    color: Theme.Colors.textPrimary,
    marginBottom: Theme.Spacing.sm,
    marginTop: Theme.Spacing.sm,
  },
  listContent: {
    paddingBottom: Theme.Spacing.lg,
  },
  filterContainer: {
    marginBottom: Theme.Spacing.md,
  },
  filterButton: {
    paddingHorizontal: Theme.Spacing.md,
    paddingVertical: Theme.Spacing.sm,
    borderRadius: Theme.Radius.sm,
    backgroundColor: Theme.Colors.surface,
    marginRight: Theme.Spacing.sm,
    borderWidth: 1,
    borderColor: Theme.Colors.border,
  },
  filterButtonActive: {
    backgroundColor: Theme.Colors.primary,
  },
  filterButtonText: {
    fontFamily: Theme.Font.medium,
    fontSize: Theme.Font.size.sm,
    color: Theme.Colors.textSecondary,
  },
  filterButtonTextActive: {
    color: Theme.Colors.surface,
  },
});
