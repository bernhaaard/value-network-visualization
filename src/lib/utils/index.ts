/**
 * Utils Barrel Export
 *
 * Centralized export for all utility functions to enable clean imports
 * throughout the application.
 */

// Storage utilities
export { storage } from "./storage";

// Browser utilities
export { isLocalStorageAvailable, isSessionStorageAvailable, isBrowser } from "./browser";
