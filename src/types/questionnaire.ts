// PVQ-RR Questionnaire Type Definitions

import { PadSingleDigit, Enumerate } from "@/types";

/**
 * Question structure with gender-specific versions
 */
export interface PVQRRQuestion {
  male: string;
  female: string;
  neutral: string;
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
 * PVQ-RR questionnaire structure with all metadata, questions, and attention checks.
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
  questions: Record<QuestionId | AttentionCheckId, PVQRRQuestion>;
}

/**
 * Valid question numbers (1-57) for the PVQ-RR questionnaire.
 */
export type QuestionNumber = Exclude<Enumerate<58>, 0>;

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
 * Response collection for questionnaire questions and attention checks.
 * Maps question/attention check IDs to user responses on 6-point scale.
 */
export type QuestionnaireResponses = Record<QuestionId | AttentionCheckId, ResponseValue>;

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
 * Set of attention check IDs
 * Type-safe constant ensures exact matching of known attention checks
 */
const ATTENTION_CHECK_IDS = new Set(["pvq_rr_en_attention_01", "pvq_rr_en_attention_02"] as const);

/**
 * Checks if a question ID is an attention check (type-safe)
 * @param questionId - Question or attention check ID to test
 * @returns True if the ID is an attention check item
 */
export const isAttentionCheckId = (questionId: string): questionId is AttentionCheckId => {
  return ATTENTION_CHECK_IDS.has(questionId as AttentionCheckId);
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
