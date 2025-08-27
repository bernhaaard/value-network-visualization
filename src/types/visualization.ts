// Visualization State & Context Type Definitions

import type { ValueProfile } from "@/lib/schwartz";

/**
 * Visualization rendering modes
 */
export type VisualizationMode = "2d" | "3d";

/**
 * Visualization study phases for controlled progression
 */
export type VisualizationPhase = "exploration" | "feedback" | "complete";

/**
 * Feedback preference options for comparison questions
 */
export type FeedbackPreference = "2d" | "3d" | "no_preference";

/**
 * Mode switch tracking for exploration time analysis
 */
export interface ModeSwap {
  /** Visualization mode switched to */
  mode: VisualizationMode;
  /** Timestamp of the mode switch */
  timestamp: Date;
}

/**
 * User feedback responses for research analysis
 */
export interface UserFeedback {
  /** Which visualization did you like better? */
  preference: FeedbackPreference | null;
  /** Which visualization was more helpful for understanding values? */
  helpfulness: FeedbackPreference | null;
  /** Additional thoughts and open feedback */
  additionalThoughts: string;
}

/**
 * Complete user feedback data including exploration metrics
 */
export interface UserFeedbackData {
  /** All mode switches with timestamps for time analysis */
  modeSwaps: ModeSwap[];
  /** User feedback responses */
  feedback: UserFeedback;
  /** When data collection started */
  startedAt: Date;
  /** When feedback was completed */
  completedAt?: Date;
}

/**
 * Visualization context state interface
 */
export interface VisualizationContextType {
  // Persistent state
  /** Value profile from questionnaire scoring */
  valueProfile: ValueProfile | null;
  /** Exploration tracking and feedback data */
  userFeedbackData: UserFeedbackData;

  // UI state (non-persistent)
  /** Current visualization mode */
  currentMode: VisualizationMode;
  /** Current study phase */
  currentPhase: VisualizationPhase;

  // Actions
  /** Switch between 2D and 3D modes */
  switchMode: (mode: VisualizationMode) => void;
  /** Update feedback responses */
  updateFeedback: (feedback: Partial<UserFeedback>) => void;
  /** Progress to next phase */
  nextPhase: () => void;
  /** Initialize with value profile from questionnaire */
  initializeWithProfile: (profile: ValueProfile) => void;
  /** Reset all visualization data */
  resetVisualization: () => void;

  // Development helpers
  /** Log current state for debugging */
  debugState: () => void;
}
