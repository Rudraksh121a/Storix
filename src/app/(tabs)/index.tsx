import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import CustomSearch from "@/components/search/customSearch";
import CustomCard from "@/components/itemcard/customCard";
import { Theme } from "@/constants/theme/theme";
import { router } from "expo-router";


// Sample data
const invoices = [
  {
    id: "1",
    image:
      "https://fastly.picsum.photos/id/2/5000/3333.jpg?hmac=_KDkqQVttXw_nM-RyJfLImIbafFrqLsuGO5YuHqD-qQ",
    title: "Milk 1L",
    price: 45,
    quantity: 2,
  },
  {
    id: "2",
    image:
      "https://fastly.picsum.photos/id/2/5000/3333.jpg?hmac=_KDkqQVttXw_nM-RyJfLImIbafFrqLsuGO5YuHqD-qQ",
    title: "Bread Pack",
    price: 30,
    quantity: 1,
  },
  {
    id: "3",
    image:
      "https://fastly.picsum.photos/id/2/5000/3333.jpg?hmac=_KDkqQVttXw_nM-RyJfLImIbafFrqLsuGO5YuHqD-qQ",
    title: "Peanut Butter",
    price: 250,
    quantity: 1,
  },
  {
    id: "4",
    image:
      "https://fastly.picsum.photos/id/2/5000/3333.jpg?hmac=_KDkqQVttXw_nM-RyJfLImIbafFrqLsuGO5YuHqD-qQ",
    title: "Tea Pack",
    price: 120,
    quantity: 3,
  },
];

export default function ItemsScreen () {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredInvoices = invoices.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <CustomSearch
            placeholder="Search Invoices"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push("/screen/addcardSeceen/addCardScreen")}
        >
          <MaterialCommunityIcons name="receipt" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>Items</Text>

      <FlatList
        data={filteredInvoices}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <CustomCard
            image={item.image}
            title={item.title}
            price={item.price}
            quantity={item.quantity}
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
});
