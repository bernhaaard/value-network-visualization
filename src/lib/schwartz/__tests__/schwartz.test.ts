import { describe, it, expect } from "vitest";
import {
  getValueCategory,
  VALUE_QUESTION_MAPPING,
  HIGHER_ORDER_DOMAIN_MAPPING,
  getHigherOrderDomainForValue,
  calculateRawValueScores,
  calculateMRAT,
  applyCentering,
  calculateValueProfile,
} from "@/lib/schwartz";
import type { QuestionnaireResponses, QuestionId } from "@/types";
import type { QuestionNumber } from "@/types/questionnaire";

describe("getValueCategory", () => {
  it("should return correct value categories for mapped questions", () => {
    // Test first question in each category
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
      expect(typeof category).toBe("string");
    }
  });
});

describe("VALUE_QUESTION_MAPPING", () => {
  it("should map exactly 57 questions across all categories", () => {
    const allQuestions = Object.values(VALUE_QUESTION_MAPPING).flat() as number[];
    const uniqueQuestions = [...new Set(allQuestions)];

    expect(uniqueQuestions).toHaveLength(57);
    expect(Math.min(...uniqueQuestions)).toBe(1);
    expect(Math.max(...uniqueQuestions)).toBe(57);
  });

  it("should have exactly 3 questions per value category", () => {
    Object.entries(VALUE_QUESTION_MAPPING).forEach(([, questions]) => {
      const typedQuestions = questions as readonly number[];
      expect(typedQuestions).toHaveLength(3);
      expect(typedQuestions.every(q => q >= 1 && q <= 57)).toBe(true);
    });
  });

  it("should not have duplicate questions across categories", () => {
    const allQuestions = Object.values(VALUE_QUESTION_MAPPING).flat() as number[];
    const uniqueQuestions = [...new Set(allQuestions)];

    expect(allQuestions).toHaveLength(uniqueQuestions.length);
  });
});

describe("HIGHER_ORDER_DOMAIN_MAPPING", () => {
  it("should contain all 19 value categories across 4 domains", () => {
    const allMappedValues = Object.values(HIGHER_ORDER_DOMAIN_MAPPING).flat();
    expect(allMappedValues).toHaveLength(19);

    // Check all VALUE_QUESTION_MAPPING keys are included
    const allValueCategories = Object.keys(VALUE_QUESTION_MAPPING);
    allValueCategories.forEach(category => {
      expect(allMappedValues).toContain(category);
    });
  });

  it("should have exactly 4 domains", () => {
    expect(Object.keys(HIGHER_ORDER_DOMAIN_MAPPING)).toHaveLength(4);
    expect(HIGHER_ORDER_DOMAIN_MAPPING.openness_to_change).toBeDefined();
    expect(HIGHER_ORDER_DOMAIN_MAPPING.self_enhancement).toBeDefined();
    expect(HIGHER_ORDER_DOMAIN_MAPPING.conservation).toBeDefined();
    expect(HIGHER_ORDER_DOMAIN_MAPPING.self_transcendence).toBeDefined();
  });

  it("should not have duplicate values across domains", () => {
    const allMappedValues = Object.values(HIGHER_ORDER_DOMAIN_MAPPING).flat();
    const uniqueValues = [...new Set(allMappedValues)];
    expect(allMappedValues).toHaveLength(uniqueValues.length);
  });
});

describe("getHigherOrderDomainForValue", () => {
  it("should return correct domains for known values", () => {
    expect(getHigherOrderDomainForValue("self_direction_thought")).toBe("openness_to_change");
    expect(getHigherOrderDomainForValue("achievement")).toBe("self_enhancement");
    expect(getHigherOrderDomainForValue("tradition")).toBe("conservation");
    expect(getHigherOrderDomainForValue("benevolence_care")).toBe("self_transcendence");
  });

  it("should handle all value categories", () => {
    const allValueCategories = Object.keys(VALUE_QUESTION_MAPPING);
    allValueCategories.forEach(category => {
      expect(() => getHigherOrderDomainForValue(category as any)).not.toThrow();
      const domain = getHigherOrderDomainForValue(category as any);
      expect(typeof domain).toBe("string");
    });
  });

  it("should throw error for invalid value category", () => {
    expect(() => getHigherOrderDomainForValue("invalid_value" as any)).toThrow();
  });
});

describe("calculateRawValueScores", () => {
  // Helper to create complete responses
  const createCompleteResponses = (defaultValue: number = 4): QuestionnaireResponses => {
    const responses = {} as QuestionnaireResponses;
    for (let i = 1; i <= 57; i++) {
      const id = `pvq_rr_en_q${i.toString().padStart(2, "0")}` as QuestionId;
      responses[id] = defaultValue as any;
    }
    // Add attention checks
    responses.pvq_rr_en_attention_01 = 1;
    responses.pvq_rr_en_attention_02 = 6;
    return responses;
  };

  it("should calculate mean scores for each value category", () => {
    const responses = createCompleteResponses(4);
    const scores = calculateRawValueScores(responses);

    // All values should be 4 (mean of 4,4,4)
    Object.values(scores).forEach(score => {
      expect(score).toBe(4);
    });
  });

  it("should handle varied responses correctly", () => {
    const responses = createCompleteResponses(3);
    // Set specific values for self_direction_thought [1, 23, 39]
    responses.pvq_rr_en_q01 = 6;
    responses.pvq_rr_en_q23 = 5;
    responses.pvq_rr_en_q39 = 4;

    const scores = calculateRawValueScores(responses);
    expect(scores.self_direction_thought).toBe(5); // (6+5+4)/3
  });

  it("should throw error for incomplete responses", () => {
    const responses = {} as QuestionnaireResponses;
    responses.pvq_rr_en_q01 = 4;

    expect(() => calculateRawValueScores(responses)).toThrow("Incomplete responses");
  });
});

describe("calculateMRAT", () => {
  it("should calculate mean across all 57 questions", () => {
    const responses = {} as QuestionnaireResponses;
    // All questions rated 4
    for (let i = 1; i <= 57; i++) {
      const id = `pvq_rr_en_q${i.toString().padStart(2, "0")}` as QuestionId;
      responses[id] = 4;
    }
    // Add attention checks (should be excluded)
    responses.pvq_rr_en_attention_01 = 1;
    responses.pvq_rr_en_attention_02 = 6;

    expect(calculateMRAT(responses)).toBe(4);
  });

  it("should exclude attention checks from calculation", () => {
    const responses = {} as QuestionnaireResponses;
    // Mix of ratings
    for (let i = 1; i <= 57; i++) {
      const id = `pvq_rr_en_q${i.toString().padStart(2, "0")}` as QuestionId;
      responses[id] = i <= 28 ? 3 : 5; // Half 3s, half 5s
    }
    responses.pvq_rr_en_attention_01 = 1;
    responses.pvq_rr_en_attention_02 = 6;

    const mrat = calculateMRAT(responses);
    expect(mrat).toBeCloseTo(4, 1); // Should be around 4
  });
});

describe("applyCentering", () => {
  it("should subtract MRAT from each value score", () => {
    const rawScores = {
      self_direction_thought: 5,
      self_direction_action: 3,
      stimulation: 4,
      // ... other values would be here in real usage
    } as any;

    const mrat = 4;
    const centered = applyCentering(rawScores, mrat);

    expect(centered.self_direction_thought).toBe(1); // 5-4
    expect(centered.self_direction_action).toBe(-1); // 3-4
    expect(centered.stimulation).toBe(0); // 4-4
  });
});

describe("calculateValueProfile", () => {
  it("should return complete profile with raw and centered scores", () => {
    const responses = {} as QuestionnaireResponses;
    // Create uniform responses
    for (let i = 1; i <= 57; i++) {
      const id = `pvq_rr_en_q${i.toString().padStart(2, "0")}` as QuestionId;
      responses[id] = 4;
    }
    responses.pvq_rr_en_attention_01 = 1;
    responses.pvq_rr_en_attention_02 = 6;

    const profile = calculateValueProfile(responses);

    expect(profile.rawScores).toBeDefined();
    expect(profile.centeredScores).toBeDefined();
    expect(profile.meanResponse).toBe(4);
    expect(profile.calculatedAt).toBeInstanceOf(Date);

    // All centered scores should be 0 (4-4)
    Object.values(profile.centeredScores).forEach(score => {
      expect(score).toBe(0);
    });
  });
});
