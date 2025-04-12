import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Share } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { generateInvoicePDF } from "@/utils/billGenerator";
import { BillItem } from "@/utils/billGenerator";
import { Theme } from "@/constants/theme/theme";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function CreateInvoice() {
  const { data } = useLocalSearchParams();

  if (!data) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>No invoice data found</Text>
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
        <Text style={styles.errorText}>Failed to parse bill data</Text>
      </View>
    );
  }

  const total = billItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleShare = async () => {
    try {
      const message = `Invoice Details:\n\n${billItems.map(item => 
        `${item.title}\nQty: ${item.quantity} x ₹${item.price} = ₹${item.quantity * item.price}`
      ).join('\n\n')}\n\nTotal Amount: ₹${total.toFixed(2)}`;
      
      await Share.share({
        message,
        title: "Invoice Details"
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
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

        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Tax (18%)</Text>
          <Text style={styles.totalAmount}>₹{(total * 0.18).toFixed(2)}</Text>
        </View>

        <View style={[styles.totalContainer, styles.grandTotal]}>
          <Text style={styles.grandTotalLabel}>Grand Total</Text>
          <Text style={styles.grandTotalAmount}>₹{(total * 1.18).toFixed(2)}</Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Thank you for your business!</Text>
          <Text style={styles.footerTerms}>Terms & Conditions Apply</Text>
        </View>
      </ScrollView>

      <View style={styles.actionButtons}>
        <TouchableOpacity 
          style={styles.button} 
          onPress={handleShare}
        >
          <MaterialCommunityIcons name="share-variant" size={24} color="#fff" />
          <Text style={styles.buttonText}>Share</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.button}
          onPress={() => generateInvoicePDF(billItems)}
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
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
    justifyContent: 'space-around',
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
  },
  buttonText: {
    color: '#fff',
    fontSize: Theme.Font.size.md,
    fontFamily: Theme.Font.medium,
    marginLeft: Theme.Spacing.sm,
  },
  errorText: {
    fontSize: Theme.Font.size.lg,
    fontFamily: Theme.Font.medium,
    color: Theme.Colors.error,
  }
});
