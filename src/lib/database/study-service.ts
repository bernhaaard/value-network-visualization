import { supabaseServer } from "./supabase";
import { calculateModeTimeDistribution, calculateNodeExplorationCoverage } from "@/lib/utils";
import type {
  SessionMetadata,
  UserDemographics,
  QuestionnaireResponses,
  AttentionCheckId,
  ModeSwap,
  UserFeedbackData,
  VisualizationMode,
  NodeExploration,
} from "@/types";
import type { ValueProfile } from "@/lib/schwartz";

/**
 * Creates initial session record when questionnaire is completed
 */
export async function createSessionRecord(data: {
  sessionMetadata: SessionMetadata;
  demographics: UserDemographics;
  valueProfile: ValueProfile;
  responses: QuestionnaireResponses;
}) {
  const { sessionMetadata, demographics, valueProfile, responses } = data;

  // Check if user answered attention checks correctly
  const attentionChecksCorrect = calculateAttentionChecks(responses);

  const sessionData = {
    session_id: sessionMetadata.sessionId,
    session_started_at: new Date(sessionMetadata.startTime),
    questionnaire_started_at: sessionMetadata.questionnaireStartedAt
      ? new Date(sessionMetadata.questionnaireStartedAt)
      : null,
    questionnaire_completed_at: sessionMetadata.questionnaireCompletedAt
      ? new Date(sessionMetadata.questionnaireCompletedAt)
      : null,

    // Demographics
    age: demographics.age,
    gender: demographics.gender,
    nationality: demographics.nationality,
    education_level: demographics.education,

    // Research data
    value_profile: valueProfile,
    attention_checks_correct: attentionChecksCorrect,

    // Status tracking
    furthest_phase_reached: "questionnaire" as const,
    is_active: true,
    last_activity_at: sessionMetadata.questionnaireCompletedAt
      ? new Date(sessionMetadata.questionnaireCompletedAt)
      : new Date(),

    app_version: sessionMetadata.version,
  };

  const { data: result, error } = await supabaseServer
    .from("study_sessions")
    .insert(sessionData)
    .select("id")
    .single();

  if (error) {
    console.error("Failed to create session record:", error);
    throw new Error(`Database error: ${error.message}`);
  }

  return result;
}

/**
 * Save final study data with calculated analytics
 */
export async function completeStudySession(data: {
  sessionMetadata: SessionMetadata;
  userFeedbackData: UserFeedbackData;
  valueProfile: ValueProfile;
}) {
  const { sessionMetadata, userFeedbackData, valueProfile } = data;

  // Convert date strings back to Date objects
  const visualizationStartedAt = new Date(userFeedbackData.visualizationStartedAt);
  const feedbackEnteredAt = userFeedbackData.feedbackEnteredAt
    ? new Date(userFeedbackData.feedbackEnteredAt)
    : undefined;
  const completedAt = userFeedbackData.completedAt
    ? new Date(userFeedbackData.completedAt)
    : new Date();

  // Convert mode swaps from JSON
  const modeSwapsWithDates = (userFeedbackData.modeSwaps || []).map((swap: ModeSwap) => ({
    mode: swap.mode as VisualizationMode,
    timestamp: new Date(swap.timestamp),
  }));

  // Convert node explorations from JSON
  const nodeExplorationsWithDates: Record<string, NodeExploration> = Object.fromEntries(
    Object.entries(userFeedbackData.nodeExplorations || {}).map(([nodeId, ex]: [string, any]) => [
      nodeId,
      {
        first2DExploration: ex.first2DExploration ? new Date(ex.first2DExploration) : undefined,
        first3DExploration: ex.first3DExploration ? new Date(ex.first3DExploration) : undefined,
      },
    ]),
  );

  // Calculate time spent in each mode and exploration coverage
  const modeTime = calculateModeTimeDistribution(
    modeSwapsWithDates,
    visualizationStartedAt,
    completedAt,
  );
  const coverage = calculateNodeExplorationCoverage(
    nodeExplorationsWithDates,
    Object.keys(valueProfile.rawScores).length,
  );

  // Save all mode switches
  if (modeSwapsWithDates.length > 0) {
    const swapRows = modeSwapsWithDates.map((swap: { mode: "2d" | "3d"; timestamp: Date }) => ({
      session_id: sessionMetadata.sessionId,
      mode: swap.mode,
      timestamp: swap.timestamp,
      time_since_session_start: swap.timestamp.getTime() - visualizationStartedAt.getTime(),
    }));

    const { error: swapsError } = await supabaseServer.from("mode_swaps").insert(swapRows);
    if (swapsError) {
      console.error("Failed to insert mode swaps:", swapsError);
    }
  }

  // Save node exploration data
  const explorationRows: Array<{
    session_id: string;
    node_id: string;
    mode: VisualizationMode;
    first_exploration_at: Date;
    time_since_visualization_start: number;
  }> = [];

  for (const [nodeId, exploration] of Object.entries(nodeExplorationsWithDates)) {
    if (exploration.first2DExploration) {
      explorationRows.push({
        session_id: sessionMetadata.sessionId,
        node_id: nodeId,
        mode: "2d",
        first_exploration_at: exploration.first2DExploration,
        time_since_visualization_start:
          exploration.first2DExploration.getTime() - visualizationStartedAt.getTime(),
      });
    }
    if (exploration.first3DExploration) {
      explorationRows.push({
        session_id: sessionMetadata.sessionId,
        node_id: nodeId,
        mode: "3d",
        first_exploration_at: exploration.first3DExploration,
        time_since_visualization_start:
          exploration.first3DExploration.getTime() - visualizationStartedAt.getTime(),
      });
    }
  }

  if (explorationRows.length > 0) {
    const { error: explorationError } = await supabaseServer
      .from("node_explorations")
      .upsert(explorationRows, { onConflict: "session_id,node_id,mode" });
    if (explorationError) {
      console.error("Failed to upsert node explorations:", explorationError);
    }
  }

  // Update session with completion data and analytics
  const updateData = {
    visualization_started_at: visualizationStartedAt,
    feedback_entered_at: feedbackEnteredAt ?? null,
    study_completed_at: completedAt,
    furthest_phase_reached: "complete" as const,

    // Feedback responses
    mode_preference: userFeedbackData.feedback?.preference ?? null,
    mode_helpfulness: userFeedbackData.feedback?.helpfulness ?? null,
    value_learnings: userFeedbackData.feedback?.valueLearnings ?? "",
    additional_thoughts: userFeedbackData.feedback?.additionalThoughts ?? "",

    // Analytics calculated above
    total_time_2d: modeTime.totalTimeIn2D,
    total_time_3d: modeTime.totalTimeIn3D,
    mode_swap_count: modeTime.modeSwapCount,
    nodes_explored_count: coverage.totalNodesExplored,
    exploration_coverage_percent: coverage.coveragePercentage,

    is_active: false,
    last_activity_at: completedAt,
    updated_at: new Date(),
  };

  const { error: updateError } = await supabaseServer
    .from("study_sessions")
    .update(updateData)
    .eq("session_id", sessionMetadata.sessionId);

  if (updateError) {
    console.error("Failed to complete study session:", updateError);
    throw new Error(`Database error: ${updateError.message}`);
  }

  return { success: true, sessionId: sessionMetadata.sessionId };
}

/**
 * Count how many attention checks the user got correct (0-2)
 */
function calculateAttentionChecks(responses: QuestionnaireResponses): number {
  let correctCount = 0;

  // Check both attention check questions
  const attentionCheck01: AttentionCheckId = "pvq_rr_en_attention_01";
  const attentionCheck02: AttentionCheckId = "pvq_rr_en_attention_02";

  // Attention check 01 expects response = 1 ("Not like me at all")
  if (responses[attentionCheck01] === 1) {
    correctCount++;
  }

  // Attention check 02 expects response = 6 ("Very much like me")
  if (responses[attentionCheck02] === 6) {
    correctCount++;
  }

  return correctCount;
}
