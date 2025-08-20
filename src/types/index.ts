/**
 * Main Types Barrel Export
 *
 * Centralizes all type definitions for clean imports and better developer experience.
 */

// Questionnaire Types
export type {
  PVQRRQuestion,
  ScaleAnchors,
  QuestionnaireScale,
  PVQRRQuestionnaire,
  ResponseValue,
  QuestionnaireResponses,
  QuestionId,
  AttentionCheckId,
  QuestionnaireProgress,
} from "./questionnaire";

export { ATTENTION_CHECK_RESPONSES, isAttentionCheckId, getQuestionId } from "./questionnaire";

// Demographics Types
export type { Gender, EducationLevel, UserDemographics } from "./demographics";

// Session & Context Types
export type {
  QuestionnairePhase,
  SessionMetadata,
  QuestionnaireState,
  PersistenceStatus,
  QuestionnaireContextType,
} from "./session";

// Constants
export { STORAGE_KEYS, QUESTIONNAIRE_CONFIG } from "./constants";

// Utils
export type { PadSingleDigit, Enumerate } from "./utils";
