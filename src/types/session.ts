// Session State & Context Type Definitions

import type { Dispatch } from "react";
import type {
  PVQRRQuestionnaire,
  QuestionnaireResponses,
  QuestionnaireProgress,
  QuestionId,
  ResponseValue,
} from "./questionnaire";
import type { UserDemographics } from "./demographics";

export type StudyPhase = "demographics" | "instructions" | "questionnaire" | "complete";

export interface SessionMetadata {
  sessionId: string;
  userId?: string;
  startTime: Date;
  currentPhase: StudyPhase;
  lastUpdated: Date;
  completedAt?: Date;
  version: string;
  language: string;
}

export interface QuestionnaireState {
  questionnaire: PVQRRQuestionnaire | null;
  metadata: SessionMetadata | null;
  demographics: UserDemographics | null;
  responses: QuestionnaireResponses;
  progress: QuestionnaireProgress;
  isLoading: boolean;
  error: string | null;
}

export type QuestionnaireAction =
  // Initialization
  | { type: "LOAD_QUESTIONNAIRE"; payload: PVQRRQuestionnaire }
  | { type: "START_SESSION"; payload: { demographics: UserDemographics } }
  | { type: "RESTORE_FROM_STORAGE"; payload: Partial<QuestionnaireState> }

  // Demographics phase
  | { type: "SET_DEMOGRAPHICS"; payload: UserDemographics }

  // Questionnaire phase
  | { type: "ANSWER_QUESTION"; payload: { questionId: QuestionId; value: ResponseValue } }
  | { type: "NAVIGATE_TO_QUESTION"; payload: number }
  | { type: "SET_PHASE"; payload: StudyPhase }

  // Completion
  | { type: "COMPLETE_QUESTIONNAIRE" }

  // Error handling
  | { type: "SET_ERROR"; payload: string }
  | { type: "CLEAR_ERROR" }
  | { type: "SET_LOADING"; payload: boolean }

  // Reset
  | { type: "RESET_SESSION" };

export interface QuestionnaireContextType {
  state: QuestionnaireState;
  dispatch: Dispatch<QuestionnaireAction>;

  // Convenience methods
  startSession: (demographics: UserDemographics) => void;
  answerQuestion: (questionId: QuestionId, value: ResponseValue) => void;
  goToQuestion: (index: number) => void;
  completeQuestionnaire: () => void;
  resetSession: () => void;
}
