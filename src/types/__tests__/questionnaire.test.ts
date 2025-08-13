/**
 * Tests for questionnaire utility functions
 * These functions are CRITICAL for the application to work correctly
 */

import { describe, it, expect } from "vitest";
import {
  isAttentionCheckId,
  getQuestionId,
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
