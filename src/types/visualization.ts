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
  /** What insights did user gain about their values? */
  valueLearnings: string;
  /** Additional thoughts and open feedback */
  additionalThoughts: string;
}

/**
 * Node exploration tracking for first-time hover analysis
 */
export interface NodeExploration {
  /** First time node was explored in 2D mode */
  first2DExploration?: Date;
  /** First time node was explored in 3D mode */
  first3DExploration?: Date;
}

/**
 * Complete user feedback data including exploration metrics
 */
export interface UserFeedbackData {
  /** All mode switches with timestamps for time analysis */
  modeSwaps: ModeSwap[];
  /** Node exploration tracking by node ID (first exploration only) */
  nodeExplorations: { [nodeId: string]: NodeExploration };
  /** User feedback responses */
  feedback: UserFeedback;
  /** When visualization data collection started */
  visualizationStartedAt: Date;
  /** When feedback phase was entered */
  feedbackEnteredAt?: Date;
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
  /** Track node exploration (first time only per mode) */
  trackNodeExploration: (nodeId: string) => void;
  /** Update feedback responses */
  updateFeedback: (feedback: Partial<UserFeedback>) => void;
  /** Go to a specific phase */
  goToPhase: (phase: VisualizationPhase) => void;
  /** Initialize with value profile from questionnaire */
  initializeWithProfile: (profile: ValueProfile) => void;
  /** Reset all visualization data */
  resetVisualization: () => void;

  // Development helpers
  /** Log current state for debugging */
  debugState: () => void;
}
