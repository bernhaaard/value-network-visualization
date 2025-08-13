// Schwartz Value Framework Domain
// Contains: value definitions, scoring utilities, relationship matrices, domain groupings

// Export types
export type {
  ValueCategory,
  HigherOrderDomain,
  RawValueScores,
  CenteredValueScores,
  ValueProfile,
  CorrelationStrategy,
} from "./types";

// Export constants
export {
  VALUE_QUESTION_MAPPING,
  HIGHER_ORDER_DOMAIN_MAPPING,
  VALUE_CATEGORIES,
  isValueCategory,
  isCompleteValueProfile,
  getHigherOrderDomainForValue,
} from "./types";


// TODO: Add exports for correlation strategies when implemented
// export { createCorrelationMatrix, cosineStrategy, calibratedStrategy } from "./correlation";
