/**
 * Tests for questionnaire utility functions
 * These functions are CRITICAL for the application to work correctly
 */

import { describe, it, expect } from "vitest";
import {
  isAttentionCheckId,
  getValueCategory,
  getQuestionId,
  VALUE_QUESTION_MAPPING,
  ATTENTION_CHECK_RESPONSES,
  type AttentionCheckId,
  type QuestionId,
  type QuestionNumber,
} from "../questionnaire";

describe("isAttentionCheckId", () => {
  it("should correctly identify attention check IDs", () => {
    expect(isAttentionCheckId("pvq_rr_en_attention_01")).toBe(true);
    expect(isAttentionCheckId("pvq_rr_en_attention_02")).toBe(true);
  });

  it("should return false for regular question IDs", () => {
    expect(isAttentionCheckId("pvq_rr_en_q01")).toBe(false);
    expect(isAttentionCheckId("pvq_rr_en_q19")).toBe(false);
    expect(isAttentionCheckId("pvq_rr_en_q57")).toBe(false);
  });

  it("should return false for invalid IDs", () => {
    expect(isAttentionCheckId("invalid_id")).toBe(false);
    expect(isAttentionCheckId("")).toBe(false);
    expect(isAttentionCheckId("pvq_rr_en_attention_03")).toBe(false);
  });

  it("should work as a type guard", () => {
    const id: string = "pvq_rr_en_attention_01";
    if (isAttentionCheckId(id)) {
      // TypeScript should narrow the type to AttentionCheckId
      const typedId: AttentionCheckId = id;
      expect(typedId).toBe("pvq_rr_en_attention_01" as AttentionCheckId);
    }
  });
});

describe("getValueCategory", () => {
  it("should return correct value categories for all mapped questions", () => {
    // Test a sample of known mappings from each category
    // Takes the first question in each valueCategory from the mapping
    expect(getValueCategory(1)).toBe("self_direction_thought");
    expect(getValueCategory(16)).toBe("self_direction_action");
    expect(getValueCategory(10)).toBe("stimulation");
    expect(getValueCategory(3)).toBe("hedonism");
    expect(getValueCategory(17)).toBe("achievement");
    expect(getValueCategory(6)).toBe("power_dominance");
    expect(getValueCategory(12)).toBe("power_resources");
    expect(getValueCategory(9)).toBe("face");
    expect(getValueCategory(13)).toBe("security_personal");
    expect(getValueCategory(2)).toBe("security_societal");
    expect(getValueCategory(18)).toBe("tradition");
    expect(getValueCategory(15)).toBe("conformity_rules");
    expect(getValueCategory(4)).toBe("conformity_interpersonal");
    expect(getValueCategory(7)).toBe("humility");
    expect(getValueCategory(8)).toBe("universalism_nature");
    expect(getValueCategory(5)).toBe("universalism_concern");
    expect(getValueCategory(14)).toBe("universalism_tolerance");
    expect(getValueCategory(11)).toBe("benevolence_care");
    expect(getValueCategory(19)).toBe("benevolence_dependability");
  });

  it("should return null for invalid question numbers", () => {
    expect(getValueCategory(0 as QuestionNumber)).toBe(null);
    expect(getValueCategory(58 as QuestionNumber)).toBe(null);
    expect(getValueCategory(100 as QuestionNumber)).toBe(null);
  });

  it("should handle all questions 1-57", () => {
    for (let i = 1; i <= 57; i++) {
      const category = getValueCategory(i as QuestionNumber);
      expect(category).not.toBe(null);
      expect(typeof category).toBe("string" as QuestionId);
    }
  });
});

describe("getQuestionId", () => {
  it("should format question IDs with zero padding", () => {
    expect(getQuestionId(1)).toBe("pvq_rr_en_q01" as QuestionId);
    expect(getQuestionId(5)).toBe("pvq_rr_en_q05" as QuestionId);
    expect(getQuestionId(10)).toBe("pvq_rr_en_q10" as QuestionId);
    expect(getQuestionId(57)).toBe("pvq_rr_en_q57" as QuestionId);
  });

  it("should handle all valid question numbers", () => {
    for (let i = 1; i <= 57; i++) {
      const id = getQuestionId(i as QuestionNumber);
      expect(id).toMatch(/^pvq_rr_en_q\d{2}$/);

      // Verify zero padding for single digits
      if (i < 10) {
        expect(id).toMatch(/^pvq_rr_en_q0\d$/);
      }
    }
  });

  it("should produce IDs that match the QuestionId type pattern", () => {
    const id = getQuestionId(1);
    const typedId: QuestionId = id;
    expect(typedId).toBe("pvq_rr_en_q01" as QuestionId);
  });
});

describe("VALUE_QUESTION_MAPPING", () => {
  it("should map exactly 57 questions across all categories", () => {
    const allQuestions = Object.values(VALUE_QUESTION_MAPPING).flat();
    const uniqueQuestions = [...new Set(allQuestions)];

    expect(uniqueQuestions).toHaveLength(57);
    expect(Math.min(...uniqueQuestions)).toBe(1);
    expect(Math.max(...uniqueQuestions)).toBe(57);
  });

  it("should have exactly 3 questions per value category", () => {
    Object.entries(VALUE_QUESTION_MAPPING).forEach(([, questions]) => {
      expect(questions).toHaveLength(3);
      expect(questions.every(q => q >= 1 && q <= 57)).toBe(true);
    });
  });

  it("should not have duplicate questions across categories", () => {
    const allQuestions = Object.values(VALUE_QUESTION_MAPPING).flat();
    const uniqueQuestions = [...new Set(allQuestions)];

    expect(allQuestions).toHaveLength(uniqueQuestions.length);
  });
});

describe("ATTENTION_CHECK_RESPONSES", () => {
  it("should define expected responses for attention checks", () => {
    expect(ATTENTION_CHECK_RESPONSES[1]).toBe("Not like me at all");
    expect(ATTENTION_CHECK_RESPONSES[6]).toBe("Very much like me");
  });

  it("should only have responses for values 1 and 6", () => {
    const keys = Object.keys(ATTENTION_CHECK_RESPONSES).map(Number);
    expect(keys).toEqual([1, 6]);
  });
});
