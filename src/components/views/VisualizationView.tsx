"use client";

import React, { useEffect, useState } from "react";
import { Container, Box, Heading, Text, VStack, Button, HStack } from "@chakra-ui/react";
import { useVisualization, useQuestionnaire } from "@/lib/context";
import { FeedbackForm } from "@/components/forms";

/**
 * Visualization Exploration View - 2D/3D visualization with mode switching
 * Handles the exploration phase of the visualization study
 */
export function VisualizationView() {
  const { currentMode, switchMode, valueProfile, initializeWithProfile } = useVisualization();
  const { valueProfile: questionnaireValueProfile } = useQuestionnaire();
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

  // Initialize visualization with value profile from questionnaire context
  useEffect(() => {
    if (questionnaireValueProfile && !valueProfile) {
      initializeWithProfile(questionnaireValueProfile);
    }
  }, [questionnaireValueProfile, valueProfile, initializeWithProfile]);

  return (
    <Container maxW="6xl" py={8}>
      <VStack gap={6}>
        <Box textAlign="center">
          <Heading size="xl" mb={4} color="fg">
            Explore Your Value Network
          </Heading>
          <Text color="fg.muted">
            Currently viewing in <Text as="span" fontWeight="medium" color="fg">{currentMode.toUpperCase()}</Text> mode
          </Text>
        </Box>

        <HStack gap={4}>
          <Button
            onClick={() => switchMode("2d")}
            variant={currentMode === "2d" ? "solid" : "ghost"}
            bg={currentMode === "2d" ? "interactive.primary" : "bg.subtle"}
            color={currentMode === "2d" ? "fg.inverted" : "fg.muted"}
            borderColor={currentMode === "2d" ? "interactive.primary" : "border.subtle"}
            _hover={{
              bg: currentMode === "2d" ? "interactive.hover" : "bg.muted",
              borderColor: currentMode === "2d" ? "interactive.hover" : "border"
            }}
          >
            2D View
          </Button>
          <Button
            onClick={() => switchMode("3d")}
            variant={currentMode === "3d" ? "solid" : "ghost"}
            bg={currentMode === "3d" ? "interactive.primary" : "bg.subtle"}
            color={currentMode === "3d" ? "fg.inverted" : "fg.muted"}
            borderColor={currentMode === "3d" ? "interactive.primary" : "border.subtle"}
            _hover={{
              bg: currentMode === "3d" ? "interactive.hover" : "bg.muted",
              borderColor: currentMode === "3d" ? "interactive.hover" : "border"
            }}
          >
            3D View
          </Button>
          <Button
            onClick={() => setIsFeedbackOpen(true)}
            bg="status.info"
            color="fg.inverted"
            _hover={{ bg: "status.warning" }}
          >
            Give Feedback
          </Button>
        </HStack>

        {/* Visualization Container */}
        <Box
          p={8}
          bg="bg.subtle"
          borderRadius="md"
          borderWidth="1px"
          borderColor="border.subtle"
          w="full"
          minH="400px"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <VStack gap={4} textAlign="center">
            <Text color="fg.muted" fontSize="lg">
              🌐 {currentMode.toUpperCase()} Visualization Rendering Here
            </Text>
            <Text color="fg.muted" fontSize="sm">
              Your personal value network will be displayed here once the visualization engine is connected.
            </Text>
          </VStack>
        </Box>

      </VStack>

      {/* Feedback Dialog */}
      <FeedbackForm open={isFeedbackOpen} onOpenChange={setIsFeedbackOpen} />
    </Container>
  );
}
