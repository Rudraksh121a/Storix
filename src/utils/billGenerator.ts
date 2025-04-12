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
  const date = new Date().toLocaleDateString();
  const invoiceNumber = `INV-${Math.random().toString(36).substr(2, 9)}`;

  const html = `
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
        <style>
          body { 
            font-family: Arial, sans-serif;
            padding: 40px;
            max-width: 800px;
            margin: 0 auto;
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
          }
          .company-name {
            font-size: 24px;
            color: #1a73e8;
            margin-bottom: 5px;
          }
          .invoice-details {
            display: flex;
            justify-content: space-between;
            margin-bottom: 30px;
          }
          .invoice-number {
            color: #666;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin: 30px 0;
          }
          th, td {
            border: 1px solid #ddd;
            padding: 12px;
            text-align: left;
          }
          th {
            background-color: #f8f9fa;
            color: #1a73e8;
          }
          .total-row td {
            font-weight: bold;
            background-color: #f8f9fa;
          }
          .footer {
            margin-top: 40px;
            text-align: center;
            color: #666;
            font-size: 14px;
          }
          .amount-cell {
            text-align: right;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="company-name">STORIX</div>
          <div>Invoice</div>
        </div>

        <div class="invoice-details">
          <div>
            <div class="invoice-number">Invoice #: ${invoiceNumber}</div>
            <div>Date: ${date}</div>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Item Description</th>
              <th>Quantity</th>
              <th>Unit Price</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            ${billItems.map(item => `
              <tr>
                <td>${item.title}</td>
                <td>${item.quantity}</td>
                <td class="amount-cell">₹${item.price.toFixed(2)}</td>
                <td class="amount-cell">₹${(item.quantity * item.price).toFixed(2)}</td>
              </tr>
            `).join("")}
            <tr class="total-row">
              <td colspan="3">Total Amount</td>
              <td class="amount-cell">₹${total.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>

        <div class="footer">
          <p>Thank you for your business!</p>
          <p>For any queries, please contact support@storix.com</p>
        </div>
      </body>
    </html>
  `;

  try {
    await printAsync({
      html,
      orientation: 'portrait'
    });
    Alert.alert("Success", "Invoice generated successfully!");
  } catch (error) {
    console.error("Error generating invoice PDF:", error);
    Alert.alert("Error", "Failed to generate invoice PDF. Please try again.");
  }
}
