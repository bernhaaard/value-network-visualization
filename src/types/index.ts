// TypeScript Type Definitions

// TODO: Add type definitions for:
// - PVQ-RR questionnaire types (questions, responses, scores)
// - Schwartz value types (values, domains, relationships)
// - Network types (nodes, edges, positions)
// - Study flow types (phases, tasks, metrics)
// - Visualization types (camera states, interactions)

// Placeholder types
export interface UserData {
  id: string;
  responses: unknown[]; // Will be defined when questionnaire is implemented
  valueScores: unknown; // Will be defined when scoring is implemented
}

export interface StudyPhase {
  phase:
    | "signup"
    | "questionnaire"
    | "instructions"
    | "2d-tasks"
    | "3d-tasks"
    | "debrief"
    | "playground";
  startTime?: Date;
  completedAt?: Date;
}
