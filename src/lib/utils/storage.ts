import { STORAGE_KEYS } from "@/types/constants";

/**
 * Modular localStorage utilities for independent data persistence.
 * Enables selective loading/saving of different concerns.
 */
export const storage = {
  /**
   * Saves data to localStorage with error handling.
   * @param key - Storage key identifier
   * @param data - Data to serialize and store
   * @returns Success status for error handling
   */
  save: (key: string, data: unknown): boolean => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
      return true;
    } catch (error) {
      console.warn(`localStorage save failed for ${key}:`, error);
      return false;
    }
  },

  /**
   * Loads data from localStorage with error handling.
   * @param key - Storage key identifier
   * @returns Parsed data or null if not found/error
   */
  load: (key: string): unknown => {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.warn(`localStorage load failed for ${key}:`, error);
      return null;
    }
  },

  /**
   * Removes data from localStorage with error handling.
   * @param key - Storage key identifier
   */
  remove: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.warn(`localStorage remove failed for ${key}:`, error);
    }
  },

  /** Removes all questionnaire-related data for clean reset */
  clearAll: () => {
    Object.values(STORAGE_KEYS).forEach(key => storage.remove(key));
  },
};
