import { useCallback, useEffect, useState } from "react";
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
import { router, useFocusEffect } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import Toast from "react-native-toast-message";

interface Product {
  id: number;
  image: string;
  title: string;
  price: number;
  quantity: number;
}

export default function ItemsScreen() {
  const db = useSQLiteContext();
  const [searchQuery, setSearchQuery] = useState("");
  const [priceFilter, setPriceFilter] = useState<"asc" | "desc" | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    createTables();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchProducts();
    }, [])
  );

  const createTables = async () => {
    try {
      await db.runAsync(`
        CREATE TABLE IF NOT EXISTS products (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          image TEXT,
          title TEXT,
          price REAL,
          quantity INTEGER
        )
      `);

      await db.runAsync(`
        CREATE TABLE IF NOT EXISTS addcard (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          product_id INTEGER,
          title TEXT,
          price REAL,
          image TEXT,
          quantity INTEGER,
          FOREIGN KEY (product_id) REFERENCES products(id)
        );
      `);
    } catch (error) {
      console.error("Error creating tables:", error);
    }
  };

  const fetchProducts = async () => {
    try {
      const result = await db.getAllAsync<Product>("SELECT * FROM products");
      setProducts(result);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleAddToCart = async (item: Product) => {
    if (!item.id || !item.title || !item.price) {
      Toast.show({
        type: "error",
        text1: "Invalid Product",
        text2: "Product details are missing. Please try again.",
      });
      return;
    }

    try {
      const result = await db.getAllAsync(
        `SELECT * FROM addcard WHERE product_id = ?`,
        [item.id]
      );

      if (result.length > 0) {
        Toast.show({
          type: "info",
          text1: "Item already in cart",
          text2: `${item.title} is already in your cart.`,
        });
        return;
      }

      await db.runAsync(
        `INSERT INTO addcard (product_id, title, price, image, quantity) VALUES (?, ?, ?, ?, ?)`,
        [item.id, item.title, item.price, item.image, 1]
      );

      Toast.show({
        type: "success",
        text1: "Added to cart",
        text2: `${item.title} has been added to your cart`,
      });
    } catch (error) {
      console.error("Error adding to cart:", error);
      Toast.show({
        type: "error",
        text1: "Failed to add to cart",
        text2: "Please try again",
      });
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchProducts();
    setRefreshing(false);
  };

  const filteredAndSortedItems = products
    .filter((item) =>
      item.title?.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (priceFilter === "asc") return a.price - b.price;
      if (priceFilter === "desc") return b.price - a.price;
      return 0;
    });

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
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.title}>Items ({products.length})</Text>

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
            onPress={() =>
              setPriceFilter(priceFilter === "desc" ? null : "desc")
            }
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

      {products.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No items available</Text>
        </View>
      ) : (
        <FlatList
          data={filteredAndSortedItems}
          keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
          renderItem={({ item }) => (
            <CustomCard
              image={item.image}
              title={item.title}
              price={item.price}
              onPress={() => handleAddToCart(item)}
              quantity={item.quantity}
            />
          )}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
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
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontFamily: Theme.Font.medium,
    fontSize: Theme.Font.size.lg,
    color: Theme.Colors.textSecondary,
  },
});
