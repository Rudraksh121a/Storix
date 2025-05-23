import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Theme } from "@/constants/theme/theme";

type CustomCardProps = {
  image: string;
  title: string;
  price: number;
  quantity: number;
  onPress: () => void;
};

export default function CustomCard({
  image,
  title,
  price,
  quantity,
  onPress,
}: CustomCardProps) {
  return (
    <View style={styles.card}>
      <Image source={{ uri: image }} style={styles.image} resizeMode="cover" />
      <View style={styles.details}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.price}>₹ {price.toFixed(2)}</Text>
        <Text style={styles.quantity}>
          Stock: {quantity > 0 ? quantity : "Out of stock"}
        </Text>
      </View>
      {quantity > 0 ? (
        <TouchableOpacity style={styles.buyButton} onPress={onPress}>
          <Text style={styles.buyButtonText}>Buy</Text>
        </TouchableOpacity>
      ) : (
        <View style={[styles.buyButton, styles.disabledButton]}>
          <Text style={styles.buyButtonText}>Out of Stock</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: Theme.Colors.surface,
    borderRadius: Theme.Radius.md,
    margin: Theme.Spacing.sm,
    padding: Theme.Spacing.sm,
    shadowColor: Theme.Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    alignItems: "center",
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: Theme.Radius.sm,
    marginRight: Theme.Spacing.md,
  },
  details: {
    flex: 1,
  },
  title: {
    fontFamily: Theme.Font.medium,
    fontSize: Theme.Font.size.md,
    color: Theme.Colors.textPrimary,
    marginBottom: 4,
  },
  price: {
    fontFamily: Theme.Font.regular,
    fontSize: Theme.Font.size.sm,
    color: Theme.Colors.primary,
  },
  quantity: {
    fontFamily: Theme.Font.regular,
    fontSize: Theme.Font.size.sm,
    color: Theme.Colors.textSecondary,
  },
  buyButton: {
    backgroundColor: Theme.Colors.primary,
    paddingHorizontal: Theme.Spacing.md,
    paddingVertical: Theme.Spacing.xs,
    borderRadius: Theme.Radius.sm,
  },
  disabledButton: {
    backgroundColor: Theme.Colors.textSecondary,
  },
  buyButtonText: {
    fontFamily: Theme.Font.medium,
    color: "#fff",
    fontSize: Theme.Font.size.sm,
  },
});
