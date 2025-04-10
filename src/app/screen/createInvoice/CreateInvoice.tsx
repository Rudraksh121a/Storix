import { View, Button, Alert, StyleSheet } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { generateInvoicePDF } from "@/utils/billGenerator";
import { BillItem } from "@/utils/billGenerator"; // Make sure path is correct

export default function CreateInvoice() {
  const { data } = useLocalSearchParams();

  if (!data) {
    return (
      <View style={styles.centered}>
        <Button title="No Data Provided" onPress={() => Alert.alert("No invoice data found.")} />
      </View>
    );
  }

  let billItems: BillItem[] = [];

  try {
    billItems = JSON.parse(decodeURIComponent(data as string));
  } catch (error) {
    console.error("❌ Error decoding invoice data:", error);
    return (
      <View style={styles.centered}>
        <Button title="Error Parsing Data" onPress={() => Alert.alert("Failed to parse bill data.")} />
      </View>
    );
  }

  return (
    <View style={styles.centered}>
      <Button
        title="Generate Invoice PDF"
        onPress={() => generateInvoicePDF(billItems)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
