"use client";

import React from "react";
import { useQuestionnaire } from "@/lib/context";
import { DemographicsForm } from "@/components/forms";
import {
  InstructionsView,
  QuestionnaireView,
  SurveyToVizTransitionView
} from "@/components/views";

/**
 * Main Questionnaire Page - Single Page Application
 * 
 * Conditionally renders different phases of the study based on context state:
 * - "demographics" → Demographics collection form
 * - "instructions" → Study instructions and consent
 * - "questionnaire" → PVQ-RR questions (57 + 2 attention checks)
 * - "complete" → Thank you and data summary
 */
export default function QuestionnairePage() {
  const { metadata } = useQuestionnaire();

  // Render appropriate component based on current phase
  switch (metadata?.currentPhase) {
    case "demographics":
      return <DemographicsForm />;

    case "instructions":
      return <InstructionsView />;

    case "questionnaire":
      return <QuestionnaireView />;

    case "complete":
      return <SurveyToVizTransitionView />;

    default:
      // Default to demographics if no phase set
      return <DemographicsForm />;
  }
}