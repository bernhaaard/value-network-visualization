// Application Constants

/**
 * localStorage keys for modular data persistence across browser sessions
 */
export const STORAGE_KEYS = {
  /** Questionnaire state */
  QUESTIONNAIRE_STATE: "pvq_rr_questionnaire_state",
  /** Session metadata and timing information */
  SESSION_ID: "pvq_rr_session_id",
  /** User demographic data */
  DEMOGRAPHICS: "pvq_rr_demographics",
  /** Question responses only */
  RESPONSES: "pvq_rr_responses",
  /** Progress tracking data */
  PROGRESS: "pvq_rr_progress",
} as const;

/**
 * Core questionnaire configuration values for validation and UI logic.
 * Centralizes key parameters to ensure consistency across components and easy maintenance.
 */
export const QUESTIONNAIRE_CONFIG = {
  /** Number of actual questions (excludes attention checks) */
  TOTAL_QUESTIONS: 57,
  /** Number of attention check items for validation */
  ATTENTION_CHECK_COUNT: 2,
  /** Minimum participant age for ethical compliance */
  MIN_AGE: 13,
  /** Maximum reasonable participant age */
  MAX_AGE: 120,
  /** Session timeout in hours for data privacy */
  SESSION_TIMEOUT_HOURS: 24,
  /** Application version for compatibility tracking */
  VERSION: "1.0.0",
  /** Default interface language */
  DEFAULT_LANGUAGE: "en",
} as const;
