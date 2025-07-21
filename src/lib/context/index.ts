// React Context State Management
// Contains: context providers, state management, localStorage persistence

// TODO: Add exports for:
// - UserDataContext (questionnaire responses, value scores)
// - StudyFlowContext (current phase, task progress)
// - VisualizationContext (2D/3D state, interactions)
// - localStorage persistence hooks

export const CONTEXT_VERSION = "1.0.0";

// Context Barrel Exports

export { QuestionnaireProvider, useQuestionnaire } from "./QuestionnaireContext";
