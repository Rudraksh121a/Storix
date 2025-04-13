import { Stack, router } from "expo-router";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { useEffect, useState } from "react";
import { Theme } from "@/constants/theme/theme";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import data from "../../../assets/data/data.json";


export default function HomeScreen() {
  const [totalItems, setTotalItems] = useState(0);
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [mostExpensive, setMostExpensive] = useState<any>(null);
  const [cheapest, setCheapest] = useState<any>(null);

  useEffect(() => {
    const itemsCount = data.length;
    const quantitySum = data.reduce((sum, item) => sum + item.quantity, 0);
    const priceSum = data.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const maxItem = data.reduce((max, item) =>
      item.price > max.price ? item : max, data[0]
    );
    const minItem = data.reduce((min, item) =>
      item.price < min.price ? item : min, data[0]
    );

    setTotalItems(itemsCount);
    setTotalQuantity(quantitySum);
    setTotalPrice(priceSum);
    setMostExpensive(maxItem);
    setCheapest(minItem);
  }, []);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Stack.Screen options={{ headerShown: false }} />
      <Text style={styles.heading}>Analytics Dashboard</Text>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <MaterialCommunityIcons name="cart-outline" size={24} color={Theme.Colors.primary} />
          <Text style={styles.statValue}>{totalItems}</Text>
          <Text style={styles.statLabel}>Total Items</Text>
        </View>

        <View style={styles.statCard}>
          <MaterialCommunityIcons name="package-variant" size={24} color={Theme.Colors.primary} />
          <Text style={styles.statValue}>{totalQuantity}</Text>
          <Text style={styles.statLabel}>Quantity</Text>
        </View>

        <View style={styles.statCard}>
          <MaterialCommunityIcons name="currency-inr" size={24} color={Theme.Colors.primary} />
          <Text style={styles.statValue}>₹{totalPrice.toFixed(0)}</Text>
          <Text style={styles.statLabel}>Total Value</Text>
        </View>
      </View>

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <MaterialCommunityIcons name="star-outline" size={24} color={Theme.Colors.primary} />
          <Text style={styles.title}>Price Analysis</Text>
        </View>
        
        <View style={styles.priceAnalysis}>
          <View style={styles.priceItem}>
            <Text style={styles.priceLabel}>Most Expensive</Text>
            <Text style={styles.itemName}>{mostExpensive?.title}</Text>
            <Text style={styles.priceValue}>₹{mostExpensive?.price}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.priceItem}>
            <Text style={styles.priceLabel}>Most Affordable</Text>
            <Text style={styles.itemName}>{cheapest?.title}</Text>
            <Text style={styles.priceValue}>₹{cheapest?.price}</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.Colors.background,
  },
  heading: {
    fontSize: Theme.Font.size.xl,
    fontFamily: Theme.Font.bold,
    color: Theme.Colors.textPrimary,
    marginTop: 60,
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  statCard: {
    backgroundColor: Theme.Colors.surface,
    padding: 16,
    borderRadius: Theme.Radius.lg,
    alignItems: 'center',
    width: '30%',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  statValue: {
    fontSize: Theme.Font.size.lg,
    fontFamily: Theme.Font.bold,
    color: Theme.Colors.textPrimary,
    marginTop: 8,
  },
  statLabel: {
    fontSize: Theme.Font.size.sm,
    fontFamily: Theme.Font.medium,
    color: Theme.Colors.textSecondary,
    marginTop: 4,
  },
  card: {
    backgroundColor: Theme.Colors.surface,
    borderRadius: Theme.Radius.lg,
    marginHorizontal: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: Theme.Font.size.lg,
    fontFamily: Theme.Font.semiBold,
    color: Theme.Colors.textPrimary,
    marginLeft: 8,
  },
  priceAnalysis: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  priceItem: {
    flex: 1,
    alignItems: 'center',
  },
  priceLabel: {
    fontSize: Theme.Font.size.sm,
    fontFamily: Theme.Font.medium,
    color: Theme.Colors.textSecondary,
    marginBottom: 8,
  },
  itemName: {
    fontSize: Theme.Font.size.md,
    fontFamily: Theme.Font.semiBold,
    color: Theme.Colors.textPrimary,
    marginBottom: 4,
    textAlign: 'center',
  },
  priceValue: {
    fontSize: Theme.Font.size.lg,
    fontFamily: Theme.Font.bold,
    color: Theme.Colors.primary,
  },
  divider: {
    width: 1,
    backgroundColor: Theme.Colors.border,
    marginHorizontal: 16,
  }
});
