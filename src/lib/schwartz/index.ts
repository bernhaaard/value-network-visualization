// Schwartz Value Framework Domain
// Contains: value definitions, scoring utilities, relationship matrices, domain groupings

// Export types
export type {
  ValueCategory,
  HigherOrderDomain,
  RawValueScores,
  CenteredValueScores,
  ValueProfile,
} from "./types";

// Export constants
export {
  VALUE_QUESTION_MAPPING,
  HIGHER_ORDER_DOMAIN_MAPPING,
  VALUE_CATEGORIES,
  isValueCategory,
  isCompleteValueProfile,
  getHigherOrderDomainForValue,
  getValueCategory,
  getValueCategoryById,
} from "./types";

// Export scoring utilities
export {
  validateResponseCompleteness,
  calculateRawValueScores,
  calculateMRAT,
  applyCentering,
  calculateValueProfile,
  validateValueProfile,
} from "./scoring";
