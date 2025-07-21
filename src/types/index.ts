/**
 * Main Types Barrel Export
 *
 * Centralizes all type definitions for clean imports and better developer experience.
 */

// Questionnaire Types
export type {
  ValueCategory,
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

export {
  ATTENTION_CHECK_RESPONSES,
  VALUE_QUESTION_MAPPING,
  isAttentionCheckId,
  getValueCategory,
  getQuestionId,
} from "./questionnaire";

// Demographics Types
export type { Gender, EducationLevel, UserDemographics } from "./demographics";

// Session & Context Types
export type {
  StudyPhase,
  SessionMetadata,
  QuestionnaireState,
  PersistenceStatus,
  QuestionnaireContextType,
} from "./session";

// Constants
export { STORAGE_KEYS, QUESTIONNAIRE_CONFIG } from "./constants";
