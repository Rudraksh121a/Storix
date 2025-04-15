import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { generateInvoicePDF } from "@/utils/billGenerator";
import { BillItem } from "@/utils/billGenerator";
import { Theme } from "@/constants/theme/theme";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useSQLiteContext } from "expo-sqlite";
import { useState, useEffect } from "react";
import { useNavigation } from '@react-navigation/native';

export default function CreateInvoice() {
  const db = useSQLiteContext();
  const navigation = useNavigation();

  const fetchBillItems = async () => {
    const result = await db.getAllAsync<BillItem>("SELECT id, price, product_id, quantity, title FROM addcard");
    return result;
  };

  const [billItems, setBillItems] = useState<BillItem[]>([]);

  // Fetch bill items when the component mounts
  useEffect(() => {
    const getItems = async () => {
      const items = await fetchBillItems();
      setBillItems(items);
    };
    
    getItems();
  }, []);

  const total = billItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleDownloadPDF = () => {
    // Call PDF generation
    generateInvoicePDF(billItems);
  };

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color={Theme.Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Invoice</Text>
      </View>

      <ScrollView style={styles.preview}>
        <Text style={styles.heading}>Invoice Preview</Text>

        <View style={styles.invoiceHeader}>
          <Text style={styles.invoiceTitle}>INVOICE</Text>
          <Text style={styles.invoiceDate}>Date: {new Date().toLocaleDateString()}</Text>
        </View>

        <View style={styles.itemsHeader}>
          <Text style={styles.columnHeader}>Item</Text>
          <Text style={styles.columnHeader}>Qty</Text>
          <Text style={styles.columnHeader}>Price</Text>
          <Text style={styles.columnHeader}>Total</Text>
        </View>

        {billItems.map((item, index) => (
          <View key={index} style={styles.item}>
            <Text style={[styles.itemCell, styles.itemName]}>{item.title}</Text>
            <Text style={styles.itemCell}>{item.quantity}</Text>
            <Text style={styles.itemCell}>₹{item.price}</Text>
            <Text style={[styles.itemCell, styles.itemPrice]}>₹{(item.price * item.quantity).toFixed(2)}</Text>
          </View>
        ))}

        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Subtotal</Text>
          <Text style={styles.totalAmount}>₹{total.toFixed(2)}</Text>
        </View>

        <View style={[styles.totalContainer, styles.grandTotal]}>
          <Text style={styles.grandTotalLabel}>Grand Total</Text>
          <Text style={styles.grandTotalAmount}>₹{total.toFixed(2)}</Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Thank you for your business!</Text>
          <Text style={styles.footerTerms}>Terms & Conditions Apply</Text>
        </View>
      </ScrollView>

      <View style={styles.actionButtons}>
        {/* Download PDF Button */}
        <TouchableOpacity 
          style={styles.button}
          onPress={handleDownloadPDF}
        >
          <MaterialCommunityIcons name="download" size={24} color="#fff" />
          <Text style={styles.buttonText}>Download PDF</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Theme.Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Theme.Colors.border,
  },
  headerTitle: {
    fontSize: Theme.Font.size.xl,
    fontFamily: Theme.Font.bold,
    color: Theme.Colors.textPrimary,
    marginLeft: Theme.Spacing.sm,
  },
  preview: {
    flex: 1,
    padding: Theme.Spacing.md,
  },
  heading: {
    fontSize: Theme.Font.size.xl,
    fontFamily: Theme.Font.bold,
    color: Theme.Colors.textPrimary,
    marginBottom: Theme.Spacing.lg,
  },
  invoiceHeader: {
    alignItems: 'center',
    marginBottom: Theme.Spacing.xl,
  },
  invoiceTitle: {
    fontSize: Theme.Font.size.xxl,
    fontFamily: Theme.Font.bold,
    color: Theme.Colors.primary,
    marginBottom: Theme.Spacing.sm,
  },
  invoiceDate: {
    fontSize: Theme.Font.size.md,
    fontFamily: Theme.Font.regular,
    color: Theme.Colors.textSecondary,
  },
  itemsHeader: {
    flexDirection: 'row',
    paddingVertical: Theme.Spacing.sm,
    borderBottomWidth: 2,
    borderBottomColor: Theme.Colors.primary,
    marginBottom: Theme.Spacing.sm,
  },
  columnHeader: {
    flex: 1,
    fontSize: Theme.Font.size.md,
    fontFamily: Theme.Font.semiBold,
    color: Theme.Colors.textPrimary,
    textAlign: 'center',
  },
  item: {
    flexDirection: 'row',
    paddingVertical: Theme.Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Theme.Colors.border,
  },
  itemCell: {
    flex: 1,
    fontSize: Theme.Font.size.md,
    textAlign: 'center',
    color: Theme.Colors.textPrimary,
  },
  itemName: {
    textAlign: 'left',
    fontFamily: Theme.Font.medium,
  },
  itemPrice: {
    color: Theme.Colors.primary,
    fontFamily: Theme.Font.semiBold,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Theme.Spacing.sm,
    paddingHorizontal: Theme.Spacing.lg,
  },
  grandTotal: {
    marginTop: Theme.Spacing.md,
    borderTopWidth: 2,
    borderTopColor: Theme.Colors.primary,
    paddingTop: Theme.Spacing.md,
  },
  totalLabel: {
    fontSize: Theme.Font.size.lg,
    fontFamily: Theme.Font.semiBold,
    color: Theme.Colors.textPrimary,
  },
  totalAmount: {
    fontSize: Theme.Font.size.lg,
    fontFamily: Theme.Font.bold,
    color: Theme.Colors.primary,
  },
  grandTotalLabel: {
    fontSize: Theme.Font.size.xl,
    fontFamily: Theme.Font.bold,
    color: Theme.Colors.textPrimary,
  },
  grandTotalAmount: {
    fontSize: Theme.Font.size.xl,
    fontFamily: Theme.Font.bold,
    color: Theme.Colors.primary,
  },
  footer: {
    marginTop: Theme.Spacing.xl,
    alignItems: 'center',
    paddingTop: Theme.Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Theme.Colors.border,
  },
  footerText: {
    fontSize: Theme.Font.size.md,
    fontFamily: Theme.Font.medium,
    color: Theme.Colors.textPrimary,
    marginBottom: Theme.Spacing.sm,
  },
  footerTerms: {
    fontSize: Theme.Font.size.sm,
    fontFamily: Theme.Font.regular,
    color: Theme.Colors.textSecondary,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: Theme.Spacing.md,
    backgroundColor: Theme.Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Theme.Colors.border,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.Colors.primary,
    paddingVertical: Theme.Spacing.sm,
    paddingHorizontal: Theme.Spacing.lg,
    borderRadius: Theme.Radius.md,
    marginHorizontal: Theme.Spacing.sm,
  },
  buttonText: {
    color: '#fff',
    fontSize: Theme.Font.size.md,
    fontFamily: Theme.Font.medium,
    marginLeft: Theme.Spacing.sm,
  },
});
