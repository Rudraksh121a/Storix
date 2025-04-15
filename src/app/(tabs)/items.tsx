import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { Theme } from "@/constants/theme/theme";
import { MaterialCommunityIcons } from "@expo/vector-icons";

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

  const handleBack = () => {
    router.back();  // This goes back to the previous screen in the stack.
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <MaterialCommunityIcons name="arrow-left" size={30} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.heading}>Manage Items</Text>
      </View>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleAddItem}>
          <MaterialCommunityIcons name="plus" size={24} color="#FFFFFF" />
          <Text style={styles.buttonText}>Add New Item</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleEditItem}>
          <MaterialCommunityIcons name="pencil" size={24} color="#FFFFFF" />
          <Text style={styles.buttonText}>Edit Item</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.secondaryButton]} onPress={handleRemoveItem}>
          <MaterialCommunityIcons name="trash-can" size={24} color="#FFFFFF" />
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Theme.Spacing.lg,
  },
  backButton: {
    marginRight: Theme.Spacing.md, // Space between the back button and the heading
    color: "black",
  },
  heading: {
    fontSize: Theme.Font.size.xl,
    fontFamily: Theme.Font.bold,
    color: Theme.Colors.textPrimary,
    textAlign: "center",
    flex: 1,
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
    flexDirection: "row",
    justifyContent: "center",
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
    color: "#FFFFFF",
    fontSize: Theme.Font.size.md,
    fontFamily: Theme.Font.semiBold,
    marginLeft: Theme.Spacing.sm,
  },
});
