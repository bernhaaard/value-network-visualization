/**
 * Utils Barrel Export
 */

// Storage utilities
export { storage } from "./storage";

// Browser utilities
export { isLocalStorageAvailable, isSessionStorageAvailable, isBrowser } from "./browser";

// Styling utilities
export {
  dimHSLColor,
  getNodeColorWithHover,
  getLinkColorWithHover,
  getLinkWidthWithHover,
} from "./styling";

// String utilities
export { slugify } from "./stringUtils";

// Session analytics utilities
export {
  calculateModeTimeDistribution,
  calculateNodeExplorationCoverage,
  calculateSessionCompletionMetrics,
  calculateSessionAnalytics,
  createIncrementalSessionData,
  formatDuration,
  logAnalyticsSummary,
} from "./session-analytics";
