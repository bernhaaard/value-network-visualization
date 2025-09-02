"use client";

import React, { useEffect, useState } from "react";
import { Box, Heading, Text, VStack, Button, HStack, Flex, AspectRatio } from "@chakra-ui/react";
import { useVisualization, useQuestionnaire } from "@/lib/context";
import { FeedbackForm } from "@/components/forms";
import { ValueNetwork } from "@/components/visualization";

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
    <Box w="full" h={{ base: "auto", lg: "100vh" }} p="3.5vh">
      <Flex gap="2.5vw" direction={{ base: "column", lg: "row" }} h="full">
        {/* Left Sidebar */}
        <Box
          w={{ base: "full", lg: "250px", xl: "300px" }}
          flexShrink={0}
          bg="bg.subtle"
          borderRadius="md"
          borderWidth="1px"
          borderColor="border.subtle"
          p={4}
        >
          <VStack gap={6} align="stretch">
            {/* Title */}
            <Box>
              <Heading size="xl" mb={2} color="fg">
                Explore Your Personal Value Network
              </Heading>
              <Text color="fg.muted" fontSize="md">
                Currently in <Text as="span" fontWeight="medium" color="fg">{currentMode.toUpperCase()}</Text> mode
              </Text>
            </Box>

            {/* Mode Switching Buttons */}
            <VStack gap={3} align="stretch">
              <Text fontSize="sm" fontWeight="medium" color="fg">
                Visualization Mode
              </Text>
              <HStack gap={3}>
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
                  flex={1}
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
                  flex={1}
                >
                  3D View
                </Button>
              </HStack>
            </VStack>

            {/* Feedback Button */}
            <Button
              onClick={() => {
                setIsFeedbackOpen(true);
                goToPhase("feedback");
              }}
              bg="interactive.primary"
              color="fg.inverted"
              _hover={{ bg: "interactive.hover" }}
              size="lg"
            >
              Give Feedback
            </Button>

            {/* Legend */}
            <Box
              p={4}
              bg="bg.muted"
              borderRadius="md"
              borderWidth="1px"
              borderColor="border.subtle"
            >
              <Text fontSize="sm" fontWeight="medium" mb={3} color="fg">
                Legend
              </Text>
              <VStack gap={3} align="stretch">
                <Text fontSize="xs" color="fg.muted">The big white node in the center represents you</Text>
                <Text fontSize="xs" color="fg.muted">The 4 colors represent higher-order value domains</Text>
                <VStack gap={1} align="start" pl={2}>
                  <Text fontSize="xs" color="fg.muted"><Text as="span" color="openness_to_change">🟠 Orange: </Text>Openness to Change</Text>
                  <Text fontSize="xs" color="fg.muted"><Text as="span" color="self_enhancement">🔴 Red: </Text>Self-Enhancement</Text>
                  <Text fontSize="xs" color="fg.muted"><Text as="span" color="conservation">🔵 Blue: </Text>Conservation</Text>
                  <Text fontSize="xs" color="fg.muted"><Text as="span" color="self_transcendence">🟢 Green: </Text>Self-Transcendence</Text>
                </VStack>
                <Text fontSize="xs" color="fg.muted">Distance from center as well as node size show relative importance for that value</Text>
              </VStack>
            </Box>
          </VStack>
        </Box>

        {/* Right: Visualization Area */}
        <Box
          flex={1}
          bg="bg.subtle"
          borderRadius="md"
          borderWidth="1px"
          borderColor="border.subtle"
          overflow="hidden"
          h={{ base: "auto", lg: "full" }}
          p="0"
        >
          {/* Square canvas on small screens */}
          <Box display={{ base: "block", lg: "none" }}>
            <AspectRatio ratio={1} w="full">
              <Box>
                <ValueNetwork />
              </Box>
            </AspectRatio>
          </Box>

          {/* Full-height canvas on large screens */}
          <Box display={{ base: "none", lg: "block" }} h="full">
            <ValueNetwork />
          </Box>
        </Box>
      </Flex>
      {/* Feedback Dialog */}
      <FeedbackForm open={isFeedbackOpen} onOpenChange={setIsFeedbackOpen} />
    </Box>
  );
}