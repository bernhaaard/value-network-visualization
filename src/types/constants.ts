// Application Constants

export const STORAGE_KEYS = {
  QUESTIONNAIRE_STATE: "pvq_rr_questionnaire_state",
  SESSION_ID: "pvq_rr_session_id",
  DEMOGRAPHICS: "pvq_rr_demographics",
  RESPONSES: "pvq_rr_responses",
  PROGRESS: "pvq_rr_progress",
} as const;

export const QUESTIONNAIRE_CONFIG = {
  TOTAL_QUESTIONS: 57,
  ATTENTION_CHECK_COUNT: 2,
  MIN_AGE: 13,
  MAX_AGE: 120,
  SESSION_TIMEOUT_HOURS: 24,
} as const;
