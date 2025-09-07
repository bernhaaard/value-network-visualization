import type {
  SessionAnalytics,
  SessionAnalyticsInput,
  ModeTimeDistribution,
  NodeExplorationCoverage,
  SessionCompletionMetrics,
  ProgressiveSessionStatus,
  StudyPhase,
  IncrementalSessionData,
  ModeSwap,
  NodeExploration,
  SessionMetadata,
  UserFeedbackData,
} from "@/types";
import type { ValueProfile } from "@/lib/schwartz";

/**
 * Calculates time distribution between 2D and 3D from mode swap data.
 *
 * Uses timestamps from mode swaps to measure
 * time spent in each mode.
 *
 * @param modeSwaps - Array of mode switches with timestamps
 * @param sessionStartTime - When exploration began
 * @param sessionEndTime - When exploration ended
 * @returns Detailed time distribution metrics
 */
export function calculateModeTimeDistribution(
  modeSwaps: ModeSwap[],
  sessionStartTime: Date,
  sessionEndTime: Date,
): ModeTimeDistribution {
  if (modeSwaps.length === 0) {
    // No mode swaps = entire session in 2D mode
    const totalTime = sessionEndTime.getTime() - sessionStartTime.getTime();
    return {
      totalTimeIn2D: totalTime,
      totalTimeIn3D: 0,
      percentageIn2D: 100,
      percentageIn3D: 0,
      totalExplorationTime: totalTime,
      modeSwapCount: 0,
    };
  }

  // Sort mode swaps chronologically
  const sortedSwaps = [...modeSwaps].sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

  let totalTimeIn2D = 0;
  let totalTimeIn3D = 0;
  let currentMode: "2d" | "3d" = "2d"; // Users always start in 2D mode
  let lastTimestamp = sessionStartTime.getTime();

  // Process each mode swap to count time per mode
  for (const swap of sortedSwaps) {
    const swapTime = swap.timestamp.getTime();
    const timeInCurrentMode = swapTime - lastTimestamp;

    if (currentMode === "2d") {
      totalTimeIn2D += timeInCurrentMode;
    } else {
      totalTimeIn3D += timeInCurrentMode;
    }

    currentMode = swap.mode;
    lastTimestamp = swapTime;
  }

  // Add remaining time for final mode until session end
  const finalModeTime = sessionEndTime.getTime() - lastTimestamp;
  if (currentMode === "2d") {
    totalTimeIn2D += finalModeTime;
  } else {
    totalTimeIn3D += finalModeTime;
  }

  const totalExplorationTime = totalTimeIn2D + totalTimeIn3D;

  return {
    totalTimeIn2D,
    totalTimeIn3D,
    percentageIn2D: totalExplorationTime > 0 ? (totalTimeIn2D / totalExplorationTime) * 100 : 0,
    percentageIn3D: totalExplorationTime > 0 ? (totalTimeIn3D / totalExplorationTime) * 100 : 0,
    totalExplorationTime,
    modeSwapCount: sortedSwaps.length,
  };
}

/**
 * Analyzes node exploration coverage across both visualization modes
 *
 * @param nodeExplorations - Map of nodeId to hover timestamps (both modes)
 * @param totalPossibleNodes - Total number of value nodes in exploration
 * @returns Comprehensive coverage analysis
 */
export function calculateNodeExplorationCoverage(
  nodeExplorations: { [nodeId: string]: NodeExploration },
  totalPossibleNodes: number,
): NodeExplorationCoverage {
  const nodeIds = Object.keys(nodeExplorations);
  const nodesOnlyIn2D: string[] = [];
  const nodesOnlyIn3D: string[] = [];
  const nodesInBothModes: string[] = [];

  // Analyze hover patterns for each node
  for (const [nodeId, exploration] of Object.entries(nodeExplorations)) {
    const hasFirst2D = !!exploration.first2DExploration;
    const hasFirst3D = !!exploration.first3DExploration;

    if (hasFirst2D && hasFirst3D) {
      nodesInBothModes.push(nodeId);
    } else if (hasFirst2D) {
      nodesOnlyIn2D.push(nodeId);
    } else if (hasFirst3D) {
      nodesOnlyIn3D.push(nodeId);
    }
  }

  return {
    totalNodesExplored: nodeIds.length,
    exploredIn2DOnly: nodesOnlyIn2D.length,
    exploredIn3DOnly: nodesOnlyIn3D.length,
    exploredInBothModes: nodesInBothModes.length,
    coveragePercentage: totalPossibleNodes > 0 ? (nodeIds.length / totalPossibleNodes) * 100 : 0,
    nodesOnlyIn2D,
    nodesOnlyIn3D,
    nodesInBothModes,
  };
}

/**
 * Determines current study phase based on available timestamps
 */
function determineCurrentPhase(
  sessionMetadata: SessionMetadata,
  userFeedbackData: Partial<UserFeedbackData>,
): { phase: StudyPhase; phaseReachedAt: Date } {
  const sessionEnd = userFeedbackData.completedAt;
  const feedbackStart = userFeedbackData.feedbackEnteredAt;
  const visualizationStart = userFeedbackData.visualizationStartedAt;
  const questionnaireEnd = sessionMetadata.questionnaireCompletedAt;

  if (sessionEnd) {
    return { phase: "complete", phaseReachedAt: sessionEnd };
  } else if (feedbackStart) {
    return { phase: "feedback", phaseReachedAt: feedbackStart };
  } else if (visualizationStart) {
    return { phase: "exploration", phaseReachedAt: visualizationStart };
  } else if (questionnaireEnd) {
    return { phase: "questionnaire", phaseReachedAt: questionnaireEnd };
  } else {
    return { phase: "demographics", phaseReachedAt: sessionMetadata.startTime };
  }
}

/**
 * Calculates session completion metrics/duration
 *
 * @param sessionMetadata - Session timing and phase data
 * @param userFeedbackData - Visualization and feedback timing data
 * @returns Duration metrics
 */
export function calculateSessionCompletionMetrics(
  sessionMetadata: SessionMetadata,
  userFeedbackData: UserFeedbackData,
): SessionCompletionMetrics {
  const sessionStart = sessionMetadata.startTime.getTime();
  const questionnaireStart = sessionMetadata.questionnaireStartedAt?.getTime();
  const questionnaireEnd = sessionMetadata.questionnaireCompletedAt?.getTime();
  const visualizationStart = userFeedbackData.visualizationStartedAt.getTime();
  const feedbackStart = userFeedbackData.feedbackEnteredAt?.getTime();
  const sessionEnd = userFeedbackData.completedAt?.getTime();

  // Calculate timing phases with fallbacks for incomplete sessions
  const questionnaireCompletionTime =
    questionnaireStart && questionnaireEnd ? questionnaireEnd - questionnaireStart : 0;

  const transitionTime = questionnaireEnd ? visualizationStart - questionnaireEnd : 0;

  const explorationTime = feedbackStart
    ? feedbackStart - visualizationStart
    : sessionEnd
      ? sessionEnd - visualizationStart
      : Date.now() - visualizationStart;

  const feedbackTime = feedbackStart && sessionEnd ? sessionEnd - feedbackStart : 0;

  const totalSessionDuration = sessionEnd ? sessionEnd - sessionStart : Date.now() - sessionStart;

  return {
    totalSessionDuration,
    questionnaireCompletionTime,
    transitionTime,
    explorationTime,
    feedbackTime,
  };
}

/**
 * Session analytics calculation combining all metrics
 *
 * @param input - Complete session data from both contexts
 * @returns Analytics ready for analysis
 */
export function calculateSessionAnalytics(input: SessionAnalyticsInput): SessionAnalytics {
  const { sessionMetadata, userFeedbackData, valueProfile } = input;

  // Extract key timestamps for mode time calculation
  const sessionStartTime = userFeedbackData.visualizationStartedAt;
  const sessionEndTime = userFeedbackData.completedAt || new Date();

  // Calculate primary research metrics
  const modeTimeDistribution = calculateModeTimeDistribution(
    userFeedbackData.modeSwaps,
    sessionStartTime,
    sessionEndTime,
  );

  const nodeExplorationCoverage = calculateNodeExplorationCoverage(
    userFeedbackData.nodeExplorations,
    Object.keys(valueProfile.rawScores).length,
  );

  const sessionCompletionMetrics = calculateSessionCompletionMetrics(
    sessionMetadata,
    userFeedbackData,
  );

  return {
    sessionId: sessionMetadata.sessionId,
    modeTimeDistribution,
    nodeExplorationCoverage,
    sessionCompletionMetrics,
    rawModeSwaps: userFeedbackData.modeSwaps,
    calculatedAt: new Date(),
  };
}

/**
 * Utility function to format duration in milliseconds to human-readable format
 */
export function formatDuration(milliseconds: number): string {
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  if (minutes > 0) {
    return `${minutes}m ${remainingSeconds}s`;
  }
  return `${seconds}s`;
}

/**
 * Creates incremental session data for progressive database updates
 * Focused on data structure creation - analytics calculation handled separately.
 */
export function createIncrementalSessionData(
  sessionMetadata: SessionMetadata,
  userFeedbackData?: Partial<UserFeedbackData>,
  valueProfile?: ValueProfile,
): IncrementalSessionData {
  const currentPhaseInfo = determineCurrentPhase(sessionMetadata, userFeedbackData || {});

  const progressiveStatus: ProgressiveSessionStatus = {
    furthestPhaseReached: currentPhaseInfo.phase,
    phaseReachedAt: currentPhaseInfo.phaseReachedAt,
    isActive: !userFeedbackData?.completedAt,
    lastActivityAt:
      userFeedbackData?.completedAt ||
      userFeedbackData?.feedbackEnteredAt ||
      userFeedbackData?.visualizationStartedAt ||
      sessionMetadata.lastUpdated,
  };

  return {
    sessionId: sessionMetadata.sessionId,
    progressiveStatus,
    availableAnalytics: {},
    rawSessionData: {
      sessionMetadata,
      userFeedbackData,
      valueProfile,
    },
  };
}

/**
 * Simple development helper to log analytics summary
 */
export function logAnalyticsSummary(analytics: SessionAnalytics): void {
  if (process.env.NODE_ENV === "development") {
    console.group("📊 Session Analytics Summary");
    console.log("Session:", analytics.sessionId);
    console.log("2D Time:", formatDuration(analytics.modeTimeDistribution.totalTimeIn2D));
    console.log("3D Time:", formatDuration(analytics.modeTimeDistribution.totalTimeIn3D));
    console.log("Nodes Explored:", analytics.nodeExplorationCoverage.totalNodesExplored);
    console.log("Coverage:", `${analytics.nodeExplorationCoverage.coveragePercentage.toFixed(1)}%`);
    console.groupEnd();
  }
}
