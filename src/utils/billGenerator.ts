import { printAsync } from "expo-print";
import { Alert } from "react-native";
export type BillItem = {
  id: string;
  title: string;
  quantity: number;
  price: number;
};

export async function generateInvoicePDF(billItems: BillItem[]) {
  const total = billItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const html = `
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; padding: 24px; }
          h1 { color: #007AFF; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #ccc; padding: 12px; text-align: left; }
          th { background-color: #f2f2f2; }
          tfoot td { font-weight: bold; }
        </style>
      </head>
      <body>
        <h1>Invoice</h1>
        <table>
          <thead>
            <tr>
              <th>Item</th>
              <th>Qty</th>
              <th>Price</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            ${billItems.map(item => `
              <tr>
                <td>${item.title}</td>
                <td>${item.quantity}</td>
                <td>₹${item.price}</td>
                <td>₹${item.quantity * item.price}</td>
              </tr>
            `).join("")}
          </tbody>
          <tfoot>
            <tr>
              <td colspan="3">Grand Total</td>
              <td>₹${total.toFixed(2)}</td>
            </tr>
          </tfoot>
        </table>
      </body>
    </html>
  `;

  try {
    const { uri } = await printAsync({ html });
    Alert.alert("PDF Generated", "Invoice created successfully!");
    console.log("📄 PDF URI:", uri);
  } catch (error) {
    console.error("Error generating invoice PDF:", error);
    Alert.alert("Error", "Failed to generate invoice PDF.");
  }
}
