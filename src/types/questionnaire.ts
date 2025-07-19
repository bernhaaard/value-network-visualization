// PVQ-RR Questionnaire Type Definitions

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

export interface PVQRRQuestion {
  id: string;
  male: string;
  female: string;
}

export type ResponseValue = 1 | 2 | 3 | 4 | 5 | 6;

export type ScaleAnchors = {
  [Key in ResponseValue]: string;
};

export interface QuestionnaireScale {
  min: number;
  max: number;
  anchors: ScaleAnchors;
}

export interface PVQRRQuestionnaire {
  id: string;
  version: string;
  language: string;
  title: string;
  description: string;
  instructions: string;
  scale: QuestionnaireScale;
  questions: Record<string, PVQRRQuestion>;
}

export type QuestionnaireResponses = Record<string, ResponseValue>;

// Utility type to generate number range from 1 to N
type Enumerate<N extends number, Counter extends number[] = []> = Counter["length"] extends N
  ? Counter[number]
  : Enumerate<N, [...Counter, Counter["length"]]>;

// Valid question numbers: 1 to 57
export type QuestionNumber = Exclude<Enumerate<58>, 0>;

// Utility type for zero-padding single digit numbers
type PadSingleDigit<N extends number> = N extends 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9
  ? `0${N}`
  : `${N}`;

// Type-safe Question ID with proper zero-padding (matches runtime exactly)
export type QuestionId = `pvq_rr_en_q${PadSingleDigit<QuestionNumber>}`;

export interface QuestionnaireProgress {
  currentQuestionIndex: number; // 0-based index
  totalQuestions: number;
  completedQuestions: number;
  percentComplete: number;
}

// Expected responses for attention checks (handled at UI level)
export const ATTENTION_CHECK_RESPONSES = {
  1: "Not like me at all",
  6: "Very much like me",
} as const;

// Value Category to Question Numbers mapping (follows official Schwartz scoring instructions order)
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

// Helper functions
export const isAttentionCheck = (questionIndex: number): boolean => {
  // Attention checks after questions 19 and 39 (0-based: positions 19 and 39)
  return questionIndex === 19 || questionIndex === 39;
};

export const getValueCategory = (questionNumber: QuestionNumber): ValueCategory | null => {
  for (const [category, numbers] of Object.entries(VALUE_QUESTION_MAPPING)) {
    if ((numbers as readonly number[]).includes(questionNumber)) {
      return category as ValueCategory;
    }
  }
  return null;
};

export const getQuestionId = (questionNumber: QuestionNumber): QuestionId => {
  return `pvq_rr_en_q${questionNumber.toString().padStart(2, "0")}` as QuestionId;
};
