// Session Analytics Type Definitions

import type {
  SessionMetadata,
  UserFeedbackData,
  ModeSwap,
  ProgressiveSessionStatus,
} from "./index";
import type { ValueProfile } from "@/lib/schwartz";

/**
 * Mode time distribution analysis for primary research metric
 */
export interface ModeTimeDistribution {
  /** Total time spent in 2D mode (milliseconds) */
  totalTimeIn2D: number;
  /** Total time spent in 3D mode (milliseconds) */
  totalTimeIn3D: number;
  /** Percentage of time in 2D mode */
  percentageIn2D: number;
  /** Percentage of time in 3D mode */
  percentageIn3D: number;
  /** Total exploration time across both modes */
  totalExplorationTime: number;
  /** Number of mode switches */
  modeSwapCount: number;
}

/**
 * Node exploration coverage analysis
 */
export interface NodeExplorationCoverage {
  /** Total number of unique values explored */
  totalNodesExplored: number;
  /** Number of values explored in 2D only */
  exploredIn2DOnly: number;
  /** Number of values explored in 3D only */
  exploredIn3DOnly: number;
  /** Number of values explored in both modes */
  exploredInBothModes: number;
  /** Percentage of all possible values explored */
  coveragePercentage: number;
  /** Node IDs explored only in 2D mode */
  nodesOnlyIn2D: string[];
  /** Node IDs explored only in 3D mode */
  nodesOnlyIn3D: string[];
  /** Node IDs explored in both modes */
  nodesInBothModes: string[];
}

/**
 * Session completion and timing metrics
 */
export interface SessionCompletionMetrics {
  /** Total session duration from start to current phase (milliseconds) */
  totalSessionDuration: number;
  /** Time spent in questionnaire phase (milliseconds) */
  questionnaireCompletionTime: number;
  /** Time from questionnaire completion to visualization start (transition time) */
  transitionTime: number;
  /** Time from visualization start to current phase */
  explorationTime: number;
  /** Time spent in feedback phase */
  feedbackTime: number;
}

/**
 * Session analytics combining all metrics
 */
export interface SessionAnalytics {
  /** Session identifier for tracking */
  sessionId: string;
  /** Mode time distribution (primary research metric) */
  modeTimeDistribution: ModeTimeDistribution;
  /** Node exploration coverage analysis */
  nodeExplorationCoverage: NodeExplorationCoverage;
  /** Session completion and timing metrics */
  sessionCompletionMetrics: SessionCompletionMetrics;
  /** Raw mode swaps data for detailed analysis */
  rawModeSwaps: ModeSwap[];
  /** Calculated at timestamp */
  calculatedAt: Date;
}

/**
 * Incremental analytics for data persistence
 * Designed to capture dropout data at any phase
 */
export interface IncrementalSessionData {
  /** Session identifier */
  sessionId: string;
  /** Current phase status */
  progressiveStatus: ProgressiveSessionStatus;
  /** Available analytics based on current phase */
  availableAnalytics: Partial<SessionAnalytics>;
  /** Raw data for future calculation */
  rawSessionData?: {
    sessionMetadata?: SessionMetadata;
    userFeedbackData?: Partial<UserFeedbackData>;
    valueProfile?: ValueProfile;
  };
}

/**
 * Input data structure for session analytics calculation
 */
export interface SessionAnalyticsInput {
  /** Session metadata with timing information */
  sessionMetadata: SessionMetadata;
  /** User feedback and exploration data */
  userFeedbackData: UserFeedbackData;
  /** Value profile for node count reference */
  valueProfile: ValueProfile;
}
