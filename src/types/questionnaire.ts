// PVQ-RR Questionnaire Type Definitions

/**
 * Schwartz's 19 refined value categories for measuring individual priorities.
 */
export type ValueCategory =
  | "self_direction_thought"
  | "self_direction_action"
  | "stimulation"
  | "hedonism"
  | "achievement"
  | "power_dominance"
  | "power_resources"
  | "face"
  | "security_personal"
  | "security_societal"
  | "tradition"
  | "conformity_rules"
  | "conformity_interpersonal"
  | "humility"
  | "universalism_nature"
  | "universalism_concern"
  | "universalism_tolerance"
  | "benevolence_care"
  | "benevolence_dependability";

/**
 * Question structure with gender-specific versions
 */
export interface PVQRRQuestion {
  male: string;
  female: string;
}

/**
 * Likert scale (1-6)
 */
export type ResponseValue = 1 | 2 | 3 | 4 | 5 | 6;

/**
 * Response scale anchors mapping numeric values to descriptive labels
 */
export type ScaleAnchors = {
  [Key in ResponseValue]: string;
};

/**
 * Complete scale definition including range and descriptive anchors
 */
export interface QuestionnaireScale {
  min: number;
  max: number;
  anchors: ScaleAnchors;
}

/**
 * PVQ-RR questionnaire structure with all metadata and questions.
 * Central data structure ensuring type-safe access to questionnaire content and configuration.
 */
export interface PVQRRQuestionnaire {
  id: string;
  version: string;
  language: string;
  title: string;
  description: string;
  instructions: string;
  scale: QuestionnaireScale;
  questions: Record<QuestionId, PVQRRQuestion>;
}

/**
 * Utility type generating consecutive numbers 1 to N for type-level validation
 */
type Enumerate<N extends number, Counter extends number[] = []> = Counter["length"] extends N
  ? Counter[number]
  : Enumerate<N, [...Counter, Counter["length"]]>;

/**
 * Valid question numbers (1-57) for the PVQ-RR questionnaire.
 */
export type QuestionNumber = Exclude<Enumerate<58>, 0>;

/**
 * Zero-pads single digit numbers for consistent ID formatting.
 * Ensures uniform question IDs (01, 02...57).
 */
type PadSingleDigit<N extends number> = N extends 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9
  ? `0${N}`
  : `${N}`;

/**
 * Type-safe question identifier with proper zero-padding matching runtime format
 */
export type QuestionId = `pvq_rr_en_q${PadSingleDigit<QuestionNumber>}`;

/**
 * Type-safe attention check identifiers.
 * Enables detection of attention checks separate from actual questionnaire items.
 */
export type AttentionCheckId = `pvq_rr_en_attention_${"01" | "02"}`;

/**
 * User responses mapped by question ID for efficient lookup and progress tracking.
 * Core data structure for collecting and analyzing individual value assessments.
 */
export type QuestionnaireResponses = Record<QuestionId, ResponseValue>;

/**
 * Progress tracking excluding attention checks.
 */
export interface QuestionnaireProgress {
  /** Current position in actual questions (0-based, excludes attention checks) */
  currentQuestionIndex: number;
  /** Total number of actual questions (57, excludes attention checks) */
  totalQuestions: number;
  /** Number of completed questions */
  completedQuestions: number;
  /** Completion percentage for progress indicators */
  percentComplete: number;
}

/**
 * Expected responses for attention check validation.
 * Defines correct answers to verify participant engagement and data quality.
 */
export const ATTENTION_CHECK_RESPONSES = {
  1: "Not like me at all",
  6: "Very much like me",
} as const;

/**
 * Official Schwartz mapping from value categories to question numbers.
 */
export const VALUE_QUESTION_MAPPING = {
  self_direction_thought: [1, 23, 39],
  self_direction_action: [16, 30, 56],
  stimulation: [10, 28, 43],
  hedonism: [3, 36, 46],
  achievement: [17, 32, 48],
  power_dominance: [6, 29, 41],
  power_resources: [12, 20, 44],
  face: [9, 24, 49],
  security_personal: [13, 26, 53],
  security_societal: [2, 35, 50],
  tradition: [18, 33, 40],
  conformity_rules: [15, 31, 42],
  conformity_interpersonal: [4, 22, 51],
  humility: [7, 38, 54],
  universalism_nature: [8, 21, 45],
  universalism_concern: [5, 37, 52],
  universalism_tolerance: [14, 34, 57],
  benevolence_care: [11, 25, 47],
  benevolence_dependability: [19, 27, 55],
} as const;

/**
 * Identifies attention checks using string matching for validation.
 * @param questionId - Question or attention check ID to test
 * @returns True if the ID represents an attention check item
 */
export const isAttentionCheckId = (questionId: QuestionId | AttentionCheckId): boolean => {
  return questionId.includes("attention");
};

/**
 * Maps question numbers to their corresponding value categories for scoring.
 * Used to calculate individual value importance scores from raw responses.
 * @param questionNumber - Question number (1-57) to categorize
 * @returns Value category or null if not found
 */
export const getValueCategory = (questionNumber: QuestionNumber): ValueCategory | null => {
  for (const [category, numbers] of Object.entries(VALUE_QUESTION_MAPPING)) {
    if ((numbers as readonly number[]).includes(questionNumber)) {
      return category as ValueCategory;
    }
  }
  return null;
};

/**
 * Generates properly formatted question ID from number with zero-padding.
 * Ensures runtime IDs match TypeScript types exactly for type safety.
 * @param questionNumber - Question number (1-57) to format
 * @returns Formatted question ID matching QuestionId type
 */
export const getQuestionId = (questionNumber: QuestionNumber): QuestionId => {
  return `pvq_rr_en_q${questionNumber.toString().padStart(2, "0")}` as QuestionId;
};
