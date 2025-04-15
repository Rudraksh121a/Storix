import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from "react-native";
import { useState, useEffect } from "react";
import { useSQLiteContext } from "expo-sqlite";
import { Theme } from "@/constants/theme/theme";
import CustomSearch from "@/components/search/customSearch";
import CustomAddcardComponent from "@/components/addcardcomponent/customAddcardComponent";
import Toast from "react-native-toast-message";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";  // Import useNavigation
import { router } from "expo-router";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string | null;
}

export default function AddCardScreen() {
  const db = useSQLiteContext();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const navigation = useNavigation();  // Initialize navigation hook

  useEffect(() => {
    fetchCartData();
    logAddCardData();
  }, [db]);

  const fetchCartData = async () => {
    try {
      const result = await db.getAllAsync(`
        SELECT 
          CAST(p.id AS TEXT) as id,
          p.title as name,
          p.price,
          p.image,
          SUM(a.quantity) as quantity
        FROM addcard a
        JOIN products p ON a.product_id = p.id
        GROUP BY p.id
      `);

      const formattedResult = result.map((item: any) => ({
        ...item,
        quantity: item.quantity || 1,  // Default quantity to 1 if it's null
      }));
      setCartItems(formattedResult as CartItem[]);
    } catch (error) {
      console.error("Error fetching cart data:", error);
      Toast.show({
        type: "error",
        text1: "Failed to load cart items",
        text2: "Please try again",
      });
    }
  };

  const handleQuantityChange = async (id: string, newQuantity: number) => {
    try {
      const currentItem = cartItems.find((item) => item.id === id);
      if (!currentItem || newQuantity <= 0) return;

      const productId = parseInt(id);

      // If the quantity is different, update the database
      if (newQuantity !== currentItem.quantity) {
        // Update the quantity in the database
        await db.runAsync(
          `UPDATE addcard SET quantity = ? WHERE product_id = ?`,
          [newQuantity, productId]
        );

        // Update cart items state
        await fetchCartData();
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
      Toast.show({
        text1: "Failed to update quantity",
        text2: "Please try again",
      });
    }
  };

  const handleRemoveItem = async (id: string) => {
    try {
      const productId = parseInt(id);
      await db.runAsync(`DELETE FROM addcard WHERE product_id = ?`, [productId]);
      setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
      Toast.show({
        type: "success",
        text1: "Item removed from cart",
      });
    } catch (error) {
      console.error("Error removing item:", error);
      Toast.show({
        type: "error",
        text1: "Failed to remove item",
        text2: "Please try again",
      });
    }
  };

  const logAddCardData = async () => {
    const addcardData = await db.getAllAsync(`SELECT * FROM addcard`);
    console.log("AddCard Table Data:", addcardData);
  };

  const getTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const handleGenerateInvoice = () => {
    Toast.show({
      type: "success",
      text1: "Invoice generated!",
      text2: "Proceed to print or export as PDF.",
    });
    router.push("/screen/createInvoice/CreateInvoice");

    // Add logic to generate the invoice here
  };

  const handleClearCart = async () => {
    // Show a confirmation dialog
    Alert.alert(
      "Confirm Clear Cart",
      "Are you sure you want to clear all items from the cart?",
      [
        {
          text: "Cancel",
          style: "cancel", // Option to cancel the action
        },
        {
          text: "Yes", 
          onPress: async () => {
            try {
              await db.runAsync("DELETE FROM addcard");  // Clear the addcard table
              setCartItems([]);  // Update the state to reflect the cleared cart
              Toast.show({
                type: "success",
                text1: "Cart cleared successfully",
              });
            } catch (error) {
              console.error("Error clearing cart:", error);
              Toast.show({
                type: "error",
                text1: "Failed to clear the cart",
                text2: "Please try again",
              });
            }
          },
        },
      ]
    );
  };

  const filteredItems = cartItems.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>

      <Text style={styles.title}>Cart</Text>

      <CustomSearch
        placeholder="Search in cart"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      <FlatList
        data={filteredItems}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <CustomAddcardComponent
            image={item.image || ""}
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

      {/* Footer with Total, Clear Button, and Invoice Button */}
      {cartItems.length > 0 && (
        <View style={styles.footer}>
          <View style={styles.totalContainer}>
            <Text style={styles.totalText}>Total:</Text>
            <Text style={styles.totalAmount}>₹{getTotal().toFixed(2)}</Text>
          </View>
          <TouchableOpacity style={styles.invoiceButton} onPress={handleGenerateInvoice}>
            <Ionicons name="document-text-outline" size={20} color="#fff" />
            <Text style={styles.invoiceText}>Generate Invoice</Text>
          </TouchableOpacity>

          {/* Clear Cart Button */}
          <TouchableOpacity style={styles.clearButton} onPress={handleClearCart}>
            <Ionicons name="trash-bin-outline" size={20} color="#fff" />
            <Text style={styles.clearText}>Clear Cart</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.Colors.background,
    padding: Theme.Spacing.md,
    paddingBottom: 120,
  },
  title: {
    fontSize: Theme.Font.size.lg,
    fontFamily: Theme.Font.semiBold,
    marginBottom: Theme.Spacing.sm,
    color: Theme.Colors.textPrimary,
    alignSelf: "center",
  },
  backButton: {
    position: "absolute",
    top: 10,
    left: 10,
    padding: 10,
  },
  list: {
    paddingBottom: 80,
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 8,
  },
  totalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: Theme.Spacing.sm,
  },
  totalText: {
    fontSize: Theme.Font.size.md,
    fontFamily: Theme.Font.medium,
    color: Theme.Colors.textPrimary,
  },
  totalAmount: {
    fontSize: Theme.Font.size.md,
    fontFamily: Theme.Font.bold,
    color: Theme.Colors.textPrimary,
  },
  invoiceButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Theme.Colors.primary,
    padding: Theme.Spacing.sm,
    borderRadius: 10,
    justifyContent: "center",
    marginBottom: Theme.Spacing.sm,
  },
  invoiceText: {
    color: "#fff",
    fontFamily: Theme.Font.medium,
    marginLeft: 8,
  },
  clearButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Theme.Colors.error,
    padding: Theme.Spacing.sm,
    borderRadius: 10,
    justifyContent: "center",
  },
  clearText: {
    color: "#fff",
    fontFamily: Theme.Font.medium,
    marginLeft: 8,
  },
});
