// Schwartz Value Framework Type Definitions

import type { QuestionNumber, QuestionId } from "@/types/questionnaire";
import { getQuestionId } from "@/types/questionnaire";

/**
 * Schwartz's 19 refined value categories
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
 * Official Schwartz mapping from value categories to question numbers
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
 * Factory function to generate direct QuestionId -> ValueCategory mapping
 */
const createQuestionIdToCategoryMapping = (): Record<QuestionId, ValueCategory> => {
  const mapping = {} as Record<QuestionId, ValueCategory>;

  Object.entries(VALUE_QUESTION_MAPPING).forEach(([category, questions]) => {
    questions.forEach(questionNum => {
      const questionId = getQuestionId(questionNum as QuestionNumber);
      mapping[questionId] = category as ValueCategory;
    });
  });

  return mapping;
};

/**
 * Dictionary mapping QuestionId to ValueCategory
 */
export const QUESTION_ID_TO_CATEGORY = createQuestionIdToCategoryMapping();

/**
 * Gets value category for a given question ID
 * @param questionId - Question ID to categorize
 * @returns Value category or null if not found
 */
export const getValueCategoryById = (questionId: QuestionId): ValueCategory | null => {
  return QUESTION_ID_TO_CATEGORY[questionId] || null;
};

/**
 * Maps question numbers to value categories
 * @param questionNumber - Question number (1-57) to categorize
 * @returns Value category or null if not found
 */
export const getValueCategory = (questionNumber: QuestionNumber): ValueCategory | null => {
  const questionId = getQuestionId(questionNumber);
  return QUESTION_ID_TO_CATEGORY[questionId] || null;
};

/**
 * Four higher-order value domains
 */
export type HigherOrderDomain =
  | "openness_to_change"
  | "self_enhancement"
  | "conservation"
  | "self_transcendence";

/**
 * Values grouped by higher-order domains
 */
export const HIGHER_ORDER_DOMAIN_MAPPING: Record<HigherOrderDomain, ValueCategory[]> = {
  openness_to_change: [
    "self_direction_thought",
    "self_direction_action",
    "stimulation",
    "hedonism",
  ],
  self_enhancement: ["achievement", "power_dominance", "power_resources"],
  conservation: [
    "security_personal",
    "security_societal",
    "tradition",
    "conformity_rules",
    "conformity_interpersonal",
    "humility",
    "face",
  ],
  self_transcendence: [
    "universalism_nature",
    "universalism_concern",
    "universalism_tolerance",
    "benevolence_care",
    "benevolence_dependability",
  ],
} as const;

/**
 * Get the higher-order domain for a given value category
 */
export const getHigherOrderDomainForValue = (value: ValueCategory): HigherOrderDomain => {
  const entry = Object.entries(HIGHER_ORDER_DOMAIN_MAPPING).find(([, values]) =>
    values.includes(value),
  );

  if (!entry) {
    throw new Error(`Value category "${value}" not found in domain mapping`);
  }

  return entry[0] as HigherOrderDomain;
};

/**
 * Raw value scores (means of 3 questions per value)
 */
export type RawValueScores = Record<ValueCategory, number>;

/**
 * Centered value scores after ipsatization
 */
export type CenteredValueScores = Record<ValueCategory, number>;

/**
 * Complete value profile containing both raw and processed scores
 */
export interface ValueProfile {
  rawScores: RawValueScores;
  centeredScores: CenteredValueScores;
  meanResponse: number;
  calculatedAt: Date;
}

/**
 * Type guard to validate ValueCategory strings
 */
export const isValueCategory = (value: string): value is ValueCategory => {
  return Object.keys(VALUE_QUESTION_MAPPING).includes(value);
};

/**
 * Array of all value categories for iteration
 */
export const VALUE_CATEGORIES: ValueCategory[] = Object.keys(
  VALUE_QUESTION_MAPPING,
) as ValueCategory[];

/**
 * Validates that all 19 values are represented in scores object
 */
export const isCompleteValueProfile = (
  scores: Partial<Record<ValueCategory, number>>,
): scores is RawValueScores => {
  return VALUE_CATEGORIES.every(category => typeof scores[category] === "number");
};
