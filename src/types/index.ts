// Main Types Barrel Export

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
  QuestionnaireProgress,
} from "./questionnaire";

export {
  ATTENTION_CHECK_RESPONSES,
  VALUE_QUESTION_MAPPING,
  isAttentionCheck,
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
  QuestionnaireAction,
  QuestionnaireContextType,
} from "./session";

// Constants
export { STORAGE_KEYS, QUESTIONNAIRE_CONFIG } from "./constants";
