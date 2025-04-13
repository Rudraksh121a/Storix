import { View, Text, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { useState, useEffect } from "react";
import { useSQLiteContext } from "expo-sqlite";
import { router } from "expo-router";
import { Theme } from "@/constants/theme/theme";
import CustomSearch from "@/components/search/customSearch";
import CustomAddcardComponent from "@/components/addcardcomponent/customAddcardComponent";
import Toast from "react-native-toast-message";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export default function AddCardScreen() {
  const db = useSQLiteContext();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchCartData();
  }, [db]);

  const fetchCartData = async () => {
    await db.withTransactionAsync(async () => {
      const result = await db.getAllAsync(`
        SELECT addcard.id as id, products.title as name, products.price, products.image, addcard.quantity 
        FROM addcard 
        JOIN products ON addcard.product_id = products.id
      `);
      setCartItems(result as CartItem[]);
    });
  };

  const handleQuantityChange = async (id: string, newQuantity: number) => {
    await db.withTransactionAsync(async () => {
      await db.runAsync(`UPDATE addcard SET quantity = ? WHERE id = ?`, [
        newQuantity,
        id,
      ]);
      fetchCartData();
    });
  };

  const handleRemoveItem = async (id: string) => {
    // console.log("Removing item with id:", id); // Debug log

    await db.withTransactionAsync(async () => {
      await db.runAsync(`DELETE FROM addcard WHERE id = ?`, [id]);
      // Update UI immediately by filtering out the removed item
      setCartItems(prevItems => prevItems.filter(item => item.id !== id));

      Toast.show({
        type: "success",
        text1: "Item removed from cart",
      });
    });
  };

  const filteredItems = cartItems.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPrice = filteredItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleCreateInvoice = () => {
    router.push({
      pathname: "/screen/invoice/invoiceScreen",
      params: {
        items: JSON.stringify(filteredItems),
        total: totalPrice.toFixed(2),
      },
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cart</Text>

      <CustomSearch
        placeholder="Search in cart"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      <FlatList
        data={filteredItems}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <CustomAddcardComponent
            image={item.image}
            name={item.name}
            price={item.price}
            quantity={item.quantity}
            onQuantityChange={(quantity) => handleQuantityChange(item.id, quantity)}
            onRemove={() => handleRemoveItem(item.id)}
          />
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No items in the cart.</Text>
        }
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />

      <View style={styles.footer}>
        <Text style={styles.totalText}>Total: ₹{totalPrice.toFixed(2)}</Text>
        <TouchableOpacity style={styles.invoiceButton} onPress={handleCreateInvoice}>
          <Text style={styles.invoiceButtonText}>Create Invoice</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.Colors.background,
    padding: Theme.Spacing.md,
  },
  title: {
    fontSize: Theme.Font.size.lg,
    fontFamily: Theme.Font.semiBold,
    marginBottom: Theme.Spacing.sm,
    color: Theme.Colors.textPrimary,
  },
  list: {
    paddingBottom: 100,
  },
  emptyText: {
    textAlign: "center",
    fontFamily: Theme.Font.medium,
    color: Theme.Colors.textSecondary,
    marginTop: 40,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Theme.Colors.surface,
    padding: Theme.Spacing.md,
    borderTopWidth: 1,
    borderColor: Theme.Colors.border,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalText: {
    fontSize: Theme.Font.size.md,
    fontFamily: Theme.Font.semiBold,
    color: Theme.Colors.textPrimary,
  },
  invoiceButton: {
    backgroundColor: Theme.Colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: Theme.Radius.sm,
  },
  invoiceButtonText: {
    color: "#fff",
    fontFamily: Theme.Font.medium,
    fontSize: Theme.Font.size.sm,
  },
});
