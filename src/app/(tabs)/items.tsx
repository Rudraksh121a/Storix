import { View, Text, TouchableOpacity, Alert, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { Theme } from "@/constants/theme/theme";


export default function EditItemScreen() {
  const router = useRouter();

  const handleAddItem = () => {
    router.push("/screen/addItemScreen/addItemForm");
  };

  const handleRemoveItem = () => {
    router.push("/screen/removeitemscreen/removeitem");
  };

  const handleEditItem = () => {
    router.push("/screen/editItemscreen/edititem");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Manage Items</Text>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleAddItem}>
          <Text style={styles.buttonText}>Add New Item</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleEditItem}>
          <Text style={styles.buttonText}>Edit Item</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.secondaryButton]} onPress={handleRemoveItem}>
          <Text style={styles.buttonText}>Remove Item</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.Colors.background,
    padding: Theme.Spacing.lg,
  },
  heading: {
    fontSize: Theme.Font.size.xl,
    fontFamily: Theme.Font.bold,
    color: Theme.Colors.textPrimary,
    marginTop: 60,
    marginBottom: Theme.Spacing.xl,
    textAlign: "center"
  },
  buttonContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: Theme.Spacing.md,
  },
  button: {
    backgroundColor: Theme.Colors.primary,
    paddingVertical: Theme.Spacing.md,
    paddingHorizontal: Theme.Spacing.lg,
    borderRadius: Theme.Radius.lg,
    width: "100%",
    alignItems: "center",
    marginVertical: Theme.Spacing.sm,
    shadowColor: Theme.Colors.shadow,
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 4,
  },
  secondaryButton: {
    backgroundColor: Theme.Colors.error,
  },
  buttonText: {
    color: "#FFFFFF", // Using literal white color instead of Theme.Colors.white
    fontSize: Theme.Font.size.md,
    fontFamily: Theme.Font.semiBold,
  },
});
