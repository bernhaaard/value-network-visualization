import type {
  SessionMetadata,
  UserDemographics,
  UserFeedbackData,
  QuestionnaireResponses,
} from "@/types";
import type { ValueProfile } from "@/lib/schwartz";

/**
 * Creates session record when questionnaire is completed
 */
export async function apiCreateSession(data: {
  sessionMetadata: SessionMetadata;
  demographics: UserDemographics;
  valueProfile: ValueProfile;
  responses: QuestionnaireResponses;
}) {
  const response = await fetch("/api/study/session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to create session");
  }

  return response.json();
}

/**
 * Save final study completion data
 */
export async function apiCompleteStudy(data: {
  sessionMetadata: SessionMetadata;
  userFeedbackData: UserFeedbackData;
  valueProfile: ValueProfile;
}) {
  const response = await fetch("/api/study/complete", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to complete study");
  }

  return response.json();
}
