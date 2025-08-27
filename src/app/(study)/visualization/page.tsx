"use client";

import React from "react";
import { Container, Box, Text } from "@chakra-ui/react";
import { VisualizationProvider, useVisualization } from "@/lib/context";
import { VisualizationView, StudyCompleteView } from "@/components/views";

/**
 * Visualization content with phase-based rendering
 */
function VisualizationContent() {
  const { currentPhase } = useVisualization();

  // Phase-based rendering - exploration + feedback dialog
  switch (currentPhase) {
    case "exploration":
    case "feedback":
      return <VisualizationView />;

    case "complete":
      return <StudyCompleteView />;

    default:
      return (
        <Container maxW="4xl" py={8}>
          <Box textAlign="center">
            <Text color="status.error">Unknown visualization phase: {currentPhase}</Text>
          </Box>
        </Container>
      );
  }
}

/**
 * Visualization Page - Manages 2D/3D visualization tasks and feedback flow
 * Uses VisualizationProvider to wrap the content component.
 * Flow: Exploration (2D/3D toggle) → Feedback → Complete
 */
export default function VisualizationPage() {
  return (
    <VisualizationProvider>
      <VisualizationContent />
    </VisualizationProvider>
  );
}