import { openDB, type IDBPDatabase } from "idb";
import type { StateStorage } from "zustand/middleware";

const DB_NAME = "dialogue-with-stars";
const STORE_NAME = "app-state";
const DB_VERSION = 1;

let dbPromise: Promise<IDBPDatabase> | null = null;

function getDB(): Promise<IDBPDatabase> {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME);
        }
      },
    });
  }
  return dbPromise;
}

/**
 * A zustand-compatible StateStorage backed by IndexedDB.
 * All methods are async — zustand persist handles this transparently.
 */
export const idbStorage: StateStorage = {
  async getItem(name: string): Promise<string | null> {
    try {
      const db = await getDB();
      const val = await db.get(STORE_NAME, name);
      return val ?? null;
    } catch (e) {
      console.warn("[idbStorage] getItem failed:", e);
      return null;
    }
  },

  async setItem(name: string, value: string): Promise<void> {
    try {
      const db = await getDB();
      await db.put(STORE_NAME, value, name);
    } catch (e) {
      console.warn("[idbStorage] setItem failed:", e);
    }
  },

  async removeItem(name: string): Promise<void> {
    try {
      const db = await getDB();
      await db.delete(STORE_NAME, name);
    } catch (e) {
      console.warn("[idbStorage] removeItem failed:", e);
    }
  },
};
