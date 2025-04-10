import { Stack } from "expo-router";
import { View, Text, StyleSheet } from "react-native";
import { useEffect, useState } from "react";

const dummyCart = [
  { id: "1", name: "Milk 1L", quantity: 2, price: 45 },
  { id: "2", name: "Bread Pack", quantity: 1, price: 30 },
  { id: "3", name: "Peanut Butter", quantity: 3, price: 250 },
  { id: "4", name: "Tea Pack", quantity: 1, price: 120 },
];

export default function HomeScreen() {
  const [totalItems, setTotalItems] = useState(0);
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [mostExpensive, setMostExpensive] = useState<any>(null);
  const [cheapest, setCheapest] = useState<any>(null);

  useEffect(() => {
    const itemsCount = dummyCart.length;
    const quantitySum = dummyCart.reduce((sum, item) => sum + item.quantity, 0);
    const priceSum = dummyCart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const maxItem = dummyCart.reduce((max, item) =>
      item.price > max.price ? item : max, dummyCart[0]
    );
    const minItem = dummyCart.reduce((min, item) =>
      item.price < min.price ? item : min, dummyCart[0]
    );

    setTotalItems(itemsCount);
    setTotalQuantity(quantitySum);
    setTotalPrice(priceSum);
    setMostExpensive(maxItem);
    setCheapest(minItem);
  }, []);

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <Text style={styles.heading}>🛒 Cart Insights</Text>

      <View style={styles.card}>
        <Text style={styles.title}> Summary</Text>
        <Text style={styles.text}>Total Items: <Text style={styles.value}>{totalItems}</Text></Text>
        <Text style={styles.text}>Total Quantity: <Text style={styles.value}>{totalQuantity}</Text></Text>
        <Text style={styles.text}>Total Price: <Text style={styles.value}>₹{totalPrice.toFixed(2)}</Text></Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.title}>Highlights</Text>
        <Text style={styles.text}>
           Most Expensive: <Text style={styles.value}>{mostExpensive?.name} (₹{mostExpensive?.price})</Text>
        </Text>
        <Text style={styles.text}>
           Cheapest: <Text style={styles.value}>{cheapest?.name} (₹{cheapest?.price})</Text>
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
    backgroundColor: "#F4F8FB",
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#007AFF",
    marginBottom: 25,
    textAlign: "center",
  },
  card: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2C3E50",
    marginBottom: 12,
  },
  text: {
    fontSize: 16,
    color: "#2C3E50",
    marginBottom: 6,
  },
  value: {
    fontWeight: "bold",
    color: "#007AFF",
  },
});
