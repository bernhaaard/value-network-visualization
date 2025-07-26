// Session State & Context Type Definitions

import type {
  PVQRRQuestionnaire,
  QuestionnaireResponses,
  QuestionnaireProgress,
  QuestionId,
  ResponseValue,
} from "./questionnaire";
import type { UserDemographics } from "./demographics";

/**
 * Study phases for controlled progression through questionnaire workflow
 */
export type StudyPhase = "instructions" | "demographics" | "questionnaire" | "complete";

/**
 * Session tracking metadata
 */
export interface SessionMetadata {
  /** Unique session identifier */
  sessionId: string;
  /** Optional user ID */
  userId?: string;
  /** Session start timestamp */
  startTime: Date;
  /** Current study phase */
  currentPhase: StudyPhase;
  /** Last activity timestamp */
  lastUpdated: Date;
  /** Completion timestamp */
  completedAt?: Date;
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
  /** Record response to specific question */
  answerQuestion: (questionId: QuestionId, value: ResponseValue) => void;
  /** Navigate to specific question (UI only) */
  goToQuestion: (index: number) => void;
  /** Update current study phase */
  setPhase: (phase: StudyPhase) => void;
  /** Mark questionnaire as completed */
  completeQuestionnaire: () => void;
  /** Clear all session data */
  resetSession: () => void;

  // Development helpers
  /** Log current state for debugging */
  debugState: () => void;
  /** Clear current error message */
  clearError: () => void;
}
