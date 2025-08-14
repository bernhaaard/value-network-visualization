// Schwartz Value Framework Scoring Utilities

import type { QuestionnaireResponses, QuestionId, AttentionCheckId, ResponseValue } from "@/types";
import type { QuestionNumber } from "@/types/questionnaire";
import { isAttentionCheckId } from "@/types";
import {
  VALUE_QUESTION_MAPPING,
  VALUE_CATEGORIES,
  type ValueCategory,
  type RawValueScores,
  type CenteredValueScores,
  type ValueProfile,
  isCompleteValueProfile,
  getValueCategory,
} from "./types";

/**
 * Validates response completeness (all 59 items answered)
 */
export const validateResponseCompleteness = (responses: QuestionnaireResponses): boolean => {
  return Object.keys(responses).length === 59; // 57 questions + 2 attention checks
};

/**
 * Calculates raw value scores as means of three questions per value
 */
export const calculateRawValueScores = (responses: QuestionnaireResponses): RawValueScores => {
  if (!validateResponseCompleteness(responses)) {
    throw new Error("Incomplete responses: all 59 items must be answered");
  }

  const rawScores: Partial<RawValueScores> = {};
  const valueSums: Partial<Record<ValueCategory, number>> = {};
  const valueCounts: Partial<Record<ValueCategory, number>> = {};

  // Single pass through responses
  Object.entries(responses).forEach(([id, value]) => {
    if (!isAttentionCheckId(id)) {
      const match = id.match(/q(\d+)$/);
      if (match) {
        const questionNum = parseInt(match[1]) as QuestionNumber;
        const category = getValueCategory(questionNum);
        if (category) {
          valueSums[category] = (valueSums[category] || 0) + value;
          valueCounts[category] = (valueCounts[category] || 0) + 1;
        }
      }
    }
  });

  // Calculate means and validate
  VALUE_CATEGORIES.forEach(category => {
    const count = valueCounts[category] || 0;
    if (count !== 3) {
      throw new Error(`Invalid response count for ${category}: expected 3, got ${count}`);
    }
    rawScores[category] = valueSums[category]! / 3;
  });

  if (!isCompleteValueProfile(rawScores)) {
    throw new Error("Failed to calculate complete value profile");
  }

  return rawScores;
};

/**
 * Calculates Mean RATing (MRAT) across all 57 value items
 */
export const calculateMRAT = (responses: QuestionnaireResponses): number => {
  if (!validateResponseCompleteness(responses)) {
    throw new Error("Cannot calculate MRAT: responses incomplete");
  }

  let sum = 0;
  let count = 0;

  Object.entries(responses).forEach(([id, value]) => {
    if (!isAttentionCheckId(id)) {
      sum += value;
      count += 1;
    }
  });

  return sum / count;
};

/**
 * Applies ipsatization (centering) to correct for scale-use bias
 */
export const applyCentering = (rawScores: RawValueScores, mrat: number): CenteredValueScores => {
  const centeredScores = {} as CenteredValueScores;

  VALUE_CATEGORIES.forEach(category => {
    centeredScores[category] = rawScores[category] - mrat;
  });

  return centeredScores;
};

/**
 * Calculates complete value profile with raw and centered scores
 */
export const calculateValueProfile = (responses: QuestionnaireResponses): ValueProfile => {
  const rawScores = calculateRawValueScores(responses);
  const meanResponse = calculateMRAT(responses);
  const centeredScores = applyCentering(rawScores, meanResponse);

  return {
    rawScores,
    centeredScores,
    meanResponse,
    calculatedAt: new Date(),
  };
};

/**
 * Validates value profile for completeness and consistency
 */
export const validateValueProfile = (
  profile: ValueProfile,
): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];

  if (!isCompleteValueProfile(profile.rawScores)) {
    errors.push("Incomplete raw scores");
  }

  if (!isCompleteValueProfile(profile.centeredScores)) {
    errors.push("Incomplete centered scores");
  }

  VALUE_CATEGORIES.forEach(category => {
    const rawScore = profile.rawScores[category];
    if (rawScore < 1 || rawScore > 6) {
      errors.push(`Raw score for ${category} out of range: ${rawScore}`);
    }
  });

  if (profile.meanResponse < 1 || profile.meanResponse > 6) {
    errors.push(`MRAT out of range: ${profile.meanResponse}`);
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};
