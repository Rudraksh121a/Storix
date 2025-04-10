import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Theme } from "@/constants/theme/theme";

type Props = {
  image: string;
  name: string;
  price: number;
  quantity: number;
  onQuantityChange: (quantity: number) => void;
  onRemove: () => void;
};

export default function CustomAddcardComponent({
  image,
  name,
  price,
  quantity,
  onQuantityChange,
  onRemove,
}: Props) {
  const safePrice = typeof price === "number" ? price : 0;
  const safeQuantity = typeof quantity === "number" ? quantity : 1;

  const increment = () => onQuantityChange(safeQuantity + 1);
  const decrement = () => onQuantityChange(Math.max(1, safeQuantity - 1));

  const total = safeQuantity * safePrice;

  return (
    <View style={styles.card}>
      <Image source={{ uri: image }} style={styles.image} />

      <View style={styles.details}>
        <View style={styles.headerRow}>
          <Text style={styles.name}>{name}</Text>
          <TouchableOpacity onPress={onRemove}>
            <Text style={styles.removeText}>Remove</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.price}>₹{safePrice} each</Text>

        <View style={styles.quantityRow}>
          <TouchableOpacity style={styles.qButton} onPress={decrement}>
            <Text style={styles.qText}>−</Text>
          </TouchableOpacity>

          <Text style={styles.quantity}>{safeQuantity}</Text>

          <TouchableOpacity style={styles.qButton} onPress={increment}>
            <Text style={styles.qText}>+</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.total}>Total: ₹{total}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: Theme.Colors.surface,
    padding: Theme.Spacing.md,
    borderRadius: Theme.Radius.md,
    marginBottom: Theme.Spacing.sm,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: Theme.Radius.sm,
    marginRight: Theme.Spacing.md,
  },
  details: {
    flex: 1,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  name: {
    fontSize: Theme.Font.size.md,
    fontFamily: Theme.Font.semiBold,
    color: Theme.Colors.textPrimary,
  },
  removeText: {
    color: Theme.Colors.error || "#FF3B30",
    fontSize: Theme.Font.size.sm,
    fontFamily: Theme.Font.medium,
  },
  price: {
    fontSize: Theme.Font.size.sm,
    fontFamily: Theme.Font.regular,
    color: Theme.Colors.textSecondary,
    marginVertical: 4,
  },
  quantityRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 4,
  },
  qButton: {
    backgroundColor: Theme.Colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  qText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  quantity: {
    marginHorizontal: 12,
    fontSize: 16,
    fontFamily: Theme.Font.medium,
    color: Theme.Colors.textPrimary,
  },
  total: {
    marginTop: 6,
    fontSize: Theme.Font.size.sm,
    fontFamily: Theme.Font.medium,
    color: Theme.Colors.accent,
  },
});
