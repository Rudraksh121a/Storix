import { View, TextInput, StyleSheet } from "react-native";
import { Theme } from "@/constants/theme/theme";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

type CustomSearchProps = {
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
};

export default function CustomSearch({
  placeholder = "Search...",
  value,
  onChangeText,
}: CustomSearchProps) {
  return (
    <View style={styles.container}>
      <MaterialCommunityIcons
        name="magnify"
        size={22}
        color={Theme.Colors.textSecondary}
        style={styles.icon}
      />
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={Theme.Colors.textSecondary}
        value={value}
        onChangeText={onChangeText}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Theme.Colors.surface,
    borderRadius: Theme.Radius.md,
    margin: Theme.Spacing.sm,
    paddingHorizontal: Theme.Spacing.md,
    shadowColor: Theme.Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  icon: {
    marginRight: Theme.Spacing.sm,
  },
  input: {
    flex: 1,
    fontFamily: Theme.Font.regular,
    fontSize: Theme.Font.size.md,
    color: Theme.Colors.textPrimary,
    paddingVertical: Theme.Spacing.sm,
  },
});
