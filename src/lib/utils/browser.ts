/**
 * Browser utility functions
 */

/**
 * LocalStorage availability check
 * Only returns true if localStorage is actually available and functional.
 *
 * @returns {boolean} True if localStorage is available, false otherwise
 */
export const isLocalStorageAvailable = (): boolean => {
  try {
    if (typeof window === "undefined") return false;
    const test = "__localStorage_test__";
    window.localStorage.setItem(test, test);
    window.localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
};

/**
 * SessionStorage availability check
 * Only returns true if sessionStorage is actually available and functional.
 *
 * @returns {boolean} True if sessionStorage is available, false otherwise
 */
export const isSessionStorageAvailable = (): boolean => {
  try {
    if (typeof window === "undefined") return false;
    const test = "__sessionStorage_test__";
    window.sessionStorage.setItem(test, test);
    window.sessionStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
};

/**
 * Check if code is running in a browser environment.
 *
 * @returns {boolean} True if running in browser, false on server
 */
export const isBrowser = (): boolean => {
  return typeof window !== "undefined";
};
