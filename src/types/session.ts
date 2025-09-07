// Session State & Context Type Definitions

import type {
  PVQRRQuestionnaire,
  QuestionnaireResponses,
  QuestionnaireProgress,
  QuestionId,
  AttentionCheckId,
  ResponseValue,
} from "./questionnaire";
import type { UserDemographics } from "./demographics";
import type { ValueProfile } from "@/lib/schwartz";

/**
 * Questionnaire phases for controlled progression through questionnaire workflow
 */
export type QuestionnairePhase = "instructions" | "demographics" | "questionnaire" | "complete";

/**
 * Complete study phases including visualization for comprehensive dropout analysis
 */
export type StudyPhase = "demographics" | "questionnaire" | "exploration" | "feedback" | "complete";

/**
 * Progressive session status for dropout analysis
 */
export interface ProgressiveSessionStatus {
  /** Current furthest phase reached */
  furthestPhaseReached: StudyPhase;
  /** Timestamp when this phase was reached */
  phaseReachedAt: Date;
  /** Whether session is currently active */
  isActive: boolean;
  /** Last activity timestamp */
  lastActivityAt: Date;
}

/**
 * Session tracking metadata
 */
export interface SessionMetadata {
  /** Unique session identifier */
  sessionId: string;
  /** Optional user ID */
  userId?: string;
  /** Session start timestamp (when demographics submitted) */
  startTime: Date;
  /** When questionnaire phase started */
  questionnaireStartedAt?: Date;
  /** Current questionnaire phase */
  currentPhase: QuestionnairePhase;
  /** Last activity timestamp */
  lastUpdated: Date;
  /** When questionnaire was completed */
  questionnaireCompletedAt?: Date;
  /** Application version */
  version: string;
  /** Interface language */
  language: string;
}

/**
 * Complete questionnaire state combining all data collection concerns.
 * Central state structure enabling consistent data access and validation across components.
 */
export interface QuestionnaireState {
  /** Loaded questionnaire structure and metadata */
  questionnaire: PVQRRQuestionnaire | null;
  /** Session tracking and timing information */
  metadata: SessionMetadata | null;
  /** User demographic information */
  demographics: UserDemographics | null;
  /** Question responses collected so far */
  responses: QuestionnaireResponses;
  /** Progress tracking for user feedback */
  progress: QuestionnaireProgress;
  /** Loading state for async operations */
  isLoading: boolean;
  /** Error message for user feedback */
  error: string | null;
}

/**
 * localStorage persistence status for reliability monitoring.
 */
export interface PersistenceStatus {
  /** Whether localStorage is available in browser */
  isSupported: boolean;
  /** Last successful save timestamp */
  lastSaveTime: Date | null;
  /** Most recent persistence error message */
  lastError: string | null;
  /** Whether save operation is currently in progress */
  pendingSave: boolean;
}

/**
 * React Context interface providing questionnaire state and operations
 */
export interface QuestionnaireContextType {
  // State values
  /** Currently loaded questionnaire structure */
  questionnaire: PVQRRQuestionnaire | null;
  /** Session metadata and timing */
  metadata: SessionMetadata | null;
  /** User demographic data */
  demographics: UserDemographics | null;
  /** Collected question responses */
  responses: QuestionnaireResponses;
  /** Calculated value profile from responses */
  valueProfile: ValueProfile | null;
  /** Current completion progress */
  progress: QuestionnaireProgress;
  /** Current question being viewed (for UI navigation, separate from progress) */
  navigationIndex: number;
  /** Async operation loading state */
  isLoading: boolean;
  /** Current error message if any */
  error: string | null;
  /** Data persistence status */
  persistence: PersistenceStatus;

  // State setters
  /** Update questionnaire structure */
  setQuestionnaire: (value: PVQRRQuestionnaire | null) => void;
  /** Update session metadata */
  setMetadata: (value: SessionMetadata | null) => void;
  /** Update demographic information */
  setDemographics: (value: UserDemographics | null) => void;
  /** Update response collection */
  setResponses: (value: QuestionnaireResponses) => void;
  /** Update loading state */
  setIsLoading: (value: boolean) => void;
  /** Update error message */
  setError: (value: string | null) => void;

  // Convenience methods
  /** Initialize new session with demographics */
  startSession: (demographics: UserDemographics) => void;
  /** Check if questions can currently be answered */
  canAnswerQuestions: () => boolean;
  /** Record response to specific question or attention check */
  answerQuestion: (questionId: QuestionId | AttentionCheckId, value: ResponseValue) => void;
  /** Navigate to specific question (UI only) */
  goToQuestion: (index: number) => void;
  /** Update current questionnaire phase */
  setPhase: (phase: QuestionnairePhase) => void;
  /** Mark questionnaire as completed */
  completeQuestionnaire: () => void;
  /** Calculate and store value profile from responses */
  calculateAndStoreValueProfile: () => void;
  /** Clear all session data */
  resetSession: () => void;
  /** Validate questionnaire length (59 items) */
  validateQuestionnaireLength: () => boolean;
  /** Ordered question and attention check IDs (memoized) */
  orderedQuestionIds: (QuestionId | AttentionCheckId)[];

  // Development helpers
  /** Log current state for debugging */
  debugState: () => void;
  /** Clear current error message */
  clearError: () => void;
}
