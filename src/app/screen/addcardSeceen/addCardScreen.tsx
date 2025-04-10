import { View, Text, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { useState } from "react";
import CustomSearch from "@/components/search/customSearch";
import { Theme } from "@/constants/theme/theme";
import CustomAddcardComponent from "@/components/addcardcomponent/customAddcardComponent";
import { router ,useLocalSearchParams} from "expo-router";
import { BillItem } from "@/utils/billGenerator";

const dummyData = [
  {
    id: "1",
    image: "https://picsum.photos/seed/milk/200/200",
    name: "Milk 1L",
    price: 45,
  },
  {
    id: "2",
    image: "https://picsum.photos/seed/bread/200/200",
    name: "Bread Pack",
    price: 30,
  },
  {
    id: "3",
    image: "https://picsum.photos/seed/butter/200/200",
    name: "Peanut Butter",
    price: 250,
  },
  {
    id: "4",
    image: "https://picsum.photos/seed/tea/200/200",
    name: "Tea Pack",
    price: 120,
  },
];


export default function AddCardScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [quantities, setQuantities] = useState<{ [id: string]: number }>({});

  const filteredData = dummyData.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleQuantityChange = (id: string, quantity: number) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: quantity,
    }));
  };

  const totalPrice = filteredData.reduce((sum, item) => {
    const quantity = quantities[item.id] || 1;
    return sum + item.price * quantity;
  }, 0);

  const handleCreateInvoice = () => {
    const billItems: BillItem[] = filteredData.map((item) => ({
      id: item.id,
      title: item.name,
      price: item.price,
      quantity: quantities[item.id] || 1,
    }));
  
    const billItemsParam = encodeURIComponent(JSON.stringify(billItems));
    router.push(`/screen/createInvoice/CreateInvoice?data=${billItemsParam}`);
  };

  return (
    <View style={styles.container}>
      <CustomSearch
        placeholder="Search Items"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      <Text style={styles.heading}>Add Card</Text>

      <FlatList
        data={filteredData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <CustomAddcardComponent
            image={item.image}
            name={item.name}
            price={item.price}
            quantity={quantities[item.id] || 1}
            onQuantityChange={(q) => handleQuantityChange(item.id, q)}
            onRemove={() => {
              setQuantities((prev) => {
                const updated = { ...prev };
                delete updated[item.id];
                return updated;
              });
            }}
          />
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />

      {/* Total and Button */}
      <View style={styles.footer}>
        <Text style={styles.totalText}>Total: ₹{totalPrice.toFixed(2)}</Text>
        <TouchableOpacity style={styles.button} onPress={handleCreateInvoice}>
          <Text style={styles.buttonText}>Create Invoice</Text>
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
    paddingBottom: 120, // Ensure scroll under button
  },
  heading: {
    fontSize: Theme.Font.size.lg,
    fontFamily: Theme.Font.semiBold,
    color: Theme.Colors.textPrimary,
    marginVertical: Theme.Spacing.sm,
  },
  listContainer: {
    paddingBottom: Theme.Spacing.md,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Theme.Colors.surface,
    padding: Theme.Spacing.md,
    borderTopWidth: 1,
    borderColor: "#ddd",
    alignItems: "center",
  },
  totalText: {
    fontSize: 18,
    fontFamily: Theme.Font.medium,
    color: Theme.Colors.textPrimary,
    marginBottom: 10,
  },
  button: {
    backgroundColor: Theme.Colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: Theme.Radius.md,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: Theme.Font.semiBold,
  },
});
