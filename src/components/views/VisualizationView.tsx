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
  const { currentMode, switchMode, valueProfile, initializeWithProfile, goToPhase } = useVisualization();
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

        <VStack gap={4}>


          {/* Mode Switching Buttons */}
          <HStack gap={4}>
            <Button
              onClick={() => switchMode("2d")}
              variant={currentMode === "2d" ? "solid" : "ghost"}
              bg={currentMode === "2d" ? "bg.subtle" : "bg.muted"}
              color={currentMode === "2d" ? "fg" : "fg.muted"}
              borderColor={currentMode === "2d" ? "fg" : "border"}
              _hover={{
                bg: "bg.subtle",
                borderColor: currentMode === "2d" ? "fg" : "border"
              }}
            >
              2D View
            </Button>
            <Button
              onClick={() => switchMode("3d")}
              variant={currentMode === "3d" ? "solid" : "ghost"}
              bg={currentMode === "3d" ? "bg.subtle" : "bg.muted"}
              color={currentMode === "3d" ? "fg" : "fg.muted"}
              borderColor={currentMode === "3d" ? "fg" : "border"}
              _hover={{
                bg: "bg.subtle",
                borderColor: currentMode === "3d" ? "fg" : "border"
              }}
            >
              3D View
            </Button>
          </HStack>
          <Button
            onClick={() => {
              setIsFeedbackOpen(true);
              goToPhase("feedback");
            }}
            bg="interactive.primary"
            color="fg.inverted"
            borderColor={"bg.muted"}
            _hover={{ bg: "interactive.hover" }}
            size="lg"
            px={8}
          >
            Give Feedback
          </Button>
        </VStack>
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
    </Container >
  );
}
