import * as SQLite from 'expo-sqlite';
import { Asset } from 'expo-asset';

// Database configuration
const DATABASE_NAME = 'storix.db';
const DATABASE_VERSION = 1;

// Get database connection
async function getDatabaseConnection() {
  return SQLite.openDatabaseAsync(DATABASE_NAME);
}

// Initialize database with proper structure
export async function initializeDatabase() {
  try {
    const db = await getDatabaseConnection();
    
    // Enable foreign keys and WAL journal mode
    await db.execAsync(`
      PRAGMA foreign_keys = ON;
      PRAGMA journal_mode = WAL;
    `);

    // Check current database version
    const versionResult = await db.getFirstAsync<{ user_version: number }>('PRAGMA user_version');
    const currentVersion = versionResult?.user_version || 0;

    if (currentVersion < DATABASE_VERSION) {
      await db.execAsync('BEGIN TRANSACTION');

      // Create tables
      await db.execAsync(`
        CREATE TABLE IF NOT EXISTS items (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT NOT NULL,
          price REAL NOT NULL,
          image_uri TEXT,
          image_name TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
      `);

      await db.execAsync(`
        CREATE TABLE IF NOT EXISTS inventory (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          item_id INTEGER NOT NULL UNIQUE,
          quantity INTEGER NOT NULL DEFAULT 0,
          last_updated DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (item_id) REFERENCES items (id) ON DELETE CASCADE
        );
      `);

      await db.execAsync(`
        CREATE TABLE IF NOT EXISTS sales (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          item_id INTEGER NOT NULL,
          quantity INTEGER NOT NULL,
          price_at_sale REAL NOT NULL,
          sale_date DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (item_id) REFERENCES items (id) ON DELETE CASCADE
        );
      `);

      // Update database version
      await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION};`);
      await db.execAsync('COMMIT');
    }

    console.log('Database initialized successfully');
    return db;
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}

// Item operations
export async function addItem(title: string, price: number, imageUri?: string, imageName?: string) {
  const db = await getDatabaseConnection();
  try {
    const result = await db.runAsync(
      'INSERT INTO items (title, price, image_uri, image_name) VALUES (?, ?, ?, ?)',
      [title, price, imageUri || null, imageName || null]
    );
    return result.lastInsertRowId;
  } catch (error) {
    console.error('Error adding item:', error);
    throw error;
  }
}

export async function updateItem(id: number, title: string, price: number, imageUri?: string, imageName?: string) {
  const db = await getDatabaseConnection();
  try {
    await db.runAsync(
      'UPDATE items SET title = ?, price = ?, image_uri = ?, image_name = ? WHERE id = ?',
      [title, price, imageUri || null, imageName || null, id]
    );
  } catch (error) {
    console.error('Error updating item:', error);
    throw error;
  }
}

export async function getAllItems() {
  const db = await getDatabaseConnection();
  try {
    return await db.getAllAsync(`
      SELECT items.*, inventory.quantity 
      FROM items 
      LEFT JOIN inventory ON items.id = inventory.item_id
    `);
  } catch (error) {
    console.error('Error getting all items:', error);
    throw error;
  }
}

// Inventory operations
export async function updateInventory(itemId: number, quantity: number) {
  const db = await getDatabaseConnection();
  try {
    await db.runAsync(
      `INSERT INTO inventory (item_id, quantity) 
       VALUES (?, ?)
       ON CONFLICT(item_id) DO UPDATE SET 
         quantity = excluded.quantity, 
         last_updated = CURRENT_TIMESTAMP`,
      [itemId, quantity]
    );
  } catch (error) {
    console.error('Error updating inventory:', error);
    throw error;
  }
}

// Sales operations
export async function recordSale(itemId: number, quantity: number, priceAtSale: number) {
  const db = await getDatabaseConnection();
  try {
    await db.execAsync('BEGIN TRANSACTION');
    
    await db.runAsync(
      'INSERT INTO sales (item_id, quantity, price_at_sale) VALUES (?, ?, ?)',
      [itemId, quantity, priceAtSale]
    );

    await db.runAsync(
      'UPDATE inventory SET quantity = quantity - ? WHERE item_id = ?',
      [quantity, itemId]
    );

    await db.execAsync('COMMIT');
  } catch (error) {
    await db.execAsync('ROLLBACK');
    console.error('Error recording sale:', error);
    throw error;
  }
}

export async function getSalesHistory(startDate?: string, endDate?: string) {
  const db = await getDatabaseConnection();
  try {
    let query = `
      SELECT sales.*, items.title 
      FROM sales 
      JOIN items ON sales.item_id = items.id
    `;

    const params = [];
    if (startDate && endDate) {
      query += ` WHERE sale_date BETWEEN ? AND ?`;
      params.push(startDate, endDate);
    }

    return await db.getAllAsync(query, params);
  } catch (error) {
    console.error('Error getting sales history:', error);
    throw error;
  }
}

// Image handling utilities
export async function deleteItemImage(imageUri: string) {
  try {
    await FileSystem.deleteAsync(imageUri);
  } catch (error) {
    console.error('Error deleting image:', error);
  }
}