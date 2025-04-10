// database.ts
import { openDatabase } from 'react-native-sqlite-storage';

type Transaction = {
  executeSql: (sql: string, params: any[], success: (result: any) => void, error: (error: any) => void) => void;
};

const db = openDatabase({ name: 'AllShoppingItem.db' });

export const createItemTable = () => {
  db.transaction((tx: Transaction) => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS items (
        id TEXT PRIMARY KEY NOT NULL,
        image TEXT,
        title TEXT,
        price REAL,
        quantity INTEGER
      );`,
      [],
      () => console.log("✅ Table created or already exists"),
      (error: any) => {
        console.log("❌ Error creating table:", error);
        return false;
      }
    );
  });
};

export default db;
