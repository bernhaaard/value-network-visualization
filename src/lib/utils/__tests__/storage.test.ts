/**
 * Tests for storage utilities
 * These functions are CRITICAL for data persistence in the application
 */

import { describe, it, expect, beforeEach, vi } from "vitest";
import { storage } from "../storage";

// Mock localStorage using modern vi.stubGlobal pattern
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

// Set up the global mock
vi.stubGlobal("localStorage", mockLocalStorage);

describe("Storage Utilities", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("save", () => {
    it("should save data to localStorage successfully", () => {
      const testData = { name: "John", age: 30 };
      mockLocalStorage.setItem.mockImplementation(() => {});

      const result = storage.save("test-key", testData);

      expect(result).toBe(true);
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith("test-key", JSON.stringify(testData));
    });

    it("should handle localStorage save errors gracefully", () => {
      const testData = { name: "John" };
      mockLocalStorage.setItem.mockImplementation(() => {
        throw new Error("QuotaExceededError");
      });

      const consoleWarnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

      const result = storage.save("test-key", testData);

      expect(result).toBe(false);
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        "localStorage save failed for test-key:",
        expect.any(Error),
      );

      consoleWarnSpy.mockRestore();
    });

    it("should serialize complex data structures", () => {
      const complexData = {
        responses: { pvq_rr_en_q01: 5 },
        demographics: { age: 25, gender: "male" },
        timestamp: new Date("2025-01-01"),
      };

      storage.save("complex-key", complexData);

      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        "complex-key",
        JSON.stringify(complexData),
      );
    });
  });

  describe("load", () => {
    it("should load and parse data from localStorage", () => {
      const testData = { name: "John", age: 30 };
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(testData));

      const result = storage.load("test-key");

      expect(result).toEqual(testData);
      expect(mockLocalStorage.getItem).toHaveBeenCalledWith("test-key");
    });

    it("should return null when key does not exist", () => {
      mockLocalStorage.getItem.mockReturnValue(null);

      const result = storage.load("non-existent-key");

      expect(result).toBe(null);
    });

    it("should handle JSON parsing errors gracefully", () => {
      mockLocalStorage.getItem.mockReturnValue("invalid-json{");
      const consoleWarnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

      const result = storage.load("corrupt-key");

      expect(result).toBe(null);
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        "localStorage load failed for corrupt-key:",
        expect.any(Error),
      );

      consoleWarnSpy.mockRestore();
    });

    it("should handle localStorage access errors", () => {
      mockLocalStorage.getItem.mockImplementation(() => {
        throw new Error("SecurityError");
      });
      const consoleWarnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

      const result = storage.load("security-blocked-key");

      expect(result).toBe(null);
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        "localStorage load failed for security-blocked-key:",
        expect.any(Error),
      );

      consoleWarnSpy.mockRestore();
    });
  });

  describe("remove", () => {
    it("should remove data from localStorage", () => {
      storage.remove("test-key");

      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith("test-key");
    });

    it("should handle removal errors gracefully", () => {
      mockLocalStorage.removeItem.mockImplementation(() => {
        throw new Error("SecurityError");
      });
      const consoleWarnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

      storage.remove("protected-key");

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        "localStorage remove failed for protected-key:",
        expect.any(Error),
      );

      consoleWarnSpy.mockRestore();
    });
  });

  describe("clearAll", () => {
    it("should remove all questionnaire-related keys", () => {
      // Reset mock to not throw errors for this test
      mockLocalStorage.removeItem.mockImplementation(() => {});

      storage.clearAll();

      // Check that all expected keys are removed (order may vary)
      expect(mockLocalStorage.removeItem).toHaveBeenCalledTimes(4);
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith("pvq_rr_demographics");
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith("pvq_rr_responses");
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith("pvq_rr_progress");
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith("pvq_rr_session_id");
    });
  });

  describe("Data Integrity", () => {
    it("should maintain data integrity through save/load cycle", () => {
      const originalData = {
        responses: { pvq_rr_en_q01: 3, pvq_rr_en_q02: 5 },
        progress: { currentQuestionIndex: 2, completedQuestions: 2 },
      };

      // Mock the save/load cycle
      let storedData: string;
      mockLocalStorage.setItem.mockImplementation((key, value) => {
        storedData = value;
      });
      mockLocalStorage.getItem.mockImplementation(() => storedData);

      // Save and then load
      storage.save("integrity-test", originalData);
      const loadedData = storage.load("integrity-test");

      expect(loadedData).toEqual(originalData);
    });
  });
});
