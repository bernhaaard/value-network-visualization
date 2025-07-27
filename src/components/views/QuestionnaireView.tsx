"use client";

import React, { useState } from "react";
import {
  Container,
  Box,
  Heading,
  Text,
  Button,
  Flex,
  Stack
} from "@chakra-ui/react";
import { useQuestionnaire } from "@/lib/context";
import { ErrorDisplay } from "@/components/ui";
import type { ResponseValue, QuestionId, AttentionCheckId, PVQRRQuestionnaire } from "@/types";

// Note: Attention check validation will be implemented in the completion flow

/**
 * Get question text by participant's gender and itemId
 * Handles questions and attention checks from JSON
 */
const getQuestionText = (itemId: QuestionId | AttentionCheckId, gender: "male" | "female", questionnaire: PVQRRQuestionnaire): string => {
  const questionData = questionnaire.questions[itemId];
  return questionData?.[gender] || "Question not found";
};

/**
 * PVQ-RR Questionnaire component - single question per page with navigation
 */
export function QuestionnaireView() {
  const {
    questionnaire,
    demographics,
    responses,
    navigationIndex,
    answerQuestion,
    goToQuestion,
    isLoading,
    error,
    canAnswerQuestions,
    validateQuestionnaireLength,
    orderedQuestionIds,
    progress
  } = useQuestionnaire();

  // State to track if user tried to proceed without selecting a response
  const [attemptedNext, setAttemptedNext] = useState(false);

  // Loading state
  if (isLoading || !questionnaire || !demographics) {
    return (
      <Container maxW="4xl" py={8}>
        <Box textAlign="center">
          <Text>Loading questionnaire...</Text>
        </Box>
      </Container>
    );
  }

  // Check if we can answer questions (phase validation)
  if (!canAnswerQuestions()) {
    return (
      <ErrorDisplay
        title="Access Error"
        message="Questionnaire is not currently available. Please complete previous steps first."
      />
    );
  }

  // Validate questionnaire length using context method
  if (!validateQuestionnaireLength()) {
    return (
      <ErrorDisplay
        title="Questionnaire Error"
        message="Questionnaire has incorrect number of items. Please contact support."
      />
    );
  }
  
  // Get current item from ordered IDs
  const currentItemId = orderedQuestionIds[navigationIndex];
  const totalItems = orderedQuestionIds.length;

  if (!currentItemId) {
    return (
      <ErrorDisplay
        title="Question Error"
        message={`Could not load question at index ${navigationIndex}.`}
      />
    );
  }

  const currentQuestionText = getQuestionText(currentItemId, demographics.gender, questionnaire);
  const currentResponse = responses[currentItemId];

  // Use context's calculated progress instead of recalculating
  const progressPercentage = progress.percentComplete;

  // Navigation helpers
  const canGoBack = navigationIndex > 0;
  const canGoNext = currentResponse !== undefined;
  const isLastQuestion = navigationIndex === totalItems - 1;

  const handleNext = () => {
    if (canGoNext) {
      setAttemptedNext(false);
      if (isLastQuestion) {
        // TODO: Complete questionnaire and go to complete phase
        console.log("🎯 Questionnaire completed!");
      } else {
        goToQuestion(navigationIndex + 1);
      }
    } else {
      // User tried to continue without selecting a response
      setAttemptedNext(true);
    }
  };

  const handlePrevious = () => {
    if (canGoBack) {
      setAttemptedNext(false);
      goToQuestion(navigationIndex - 1);
    }
  };

  const handleAnswerChange = (value: ResponseValue) => {
    answerQuestion(currentItemId, value);
    setAttemptedNext(false);
  };

  return (
    <Container maxW="4xl" py={8}>
      <Stack gap={8}>
        {/* Context Error Display */}
        {error && (
          <ErrorDisplay
            title="Error"
            message={error}
            variant="inline"
          />
        )}

        {/* Progress Bar */}
        <Box>
          <Text fontSize="sm" color="gray.600" mb={2}>
            Progress: {progressPercentage}%
          </Text>
          <Box w="full" bg="gray.200" rounded="md" h="2">
            <Box
              bg="blue.500"
              h="full"
              rounded="md"
              w={`${progressPercentage}%`}
              transition="width 0.3s ease"
            />
          </Box>
        </Box>

        {/* Question */}
        <Box>
          <Heading size="lg" mb={6} lineHeight="tall">
            {currentQuestionText}
          </Heading>

          {/* 6-Point Likert Scale */}
          <Stack gap={4}>
            {([1, 2, 3, 4, 5, 6] as ResponseValue[]).map((value) => {
              const labels = {
                1: "Not like me at all",
                2: "Not like me",
                3: "A little like me",
                4: "Moderately like me",
                5: "Like me",
                6: "Very much like me"
              };

              const isSelected = currentResponse === value;

              return (
                <Box
                  key={value}
                  as="label"
                  cursor="pointer"
                  p={3}
                  borderWidth="2px"
                  borderColor={isSelected ? "blue.500" : "gray.200"}
                  bg={isSelected ? "blue.50" : "white"}
                  rounded="md"
                  _hover={{ bg: isSelected ? "blue.50" : "gray.50" }}
                  transition="all 0.2s"
                >
                  <Flex align="center" gap={3}>
                    <Box
                      w="4"
                      h="4"
                      borderWidth="2px"
                      borderColor={isSelected ? "blue.500" : "gray.300"}
                      rounded="full"
                      bg={isSelected ? "blue.500" : "white"}
                      position="relative"
                    >
                      {isSelected && (
                        <Box
                          position="absolute"
                          top="50%"
                          left="50%"
                          transform="translate(-50%, -50%)"
                          w="2"
                          h="2"
                          bg="white"
                          rounded="full"
                        />
                      )}
                    </Box>
                    <input
                      type="radio"
                      name="questionnaire-response"
                      value={value}
                      checked={isSelected}
                      onChange={() => handleAnswerChange(value)}
                      style={{ display: 'none' }}
                    />
                    <Text fontWeight="medium">
                      {value} - {labels[value]}
                    </Text>
                  </Flex>
                </Box>
              );
            })}
          </Stack>
        </Box>

        {/* Navigation Controls */}
        <Flex justify="space-between" align="center">
          <Button
            onClick={handlePrevious}
            disabled={!canGoBack}
            variant="outline"
          >
            ← Previous
          </Button>

          {/* Only show if user tried to proceed */}
          {attemptedNext && !currentResponse && (
            <Text fontSize="sm" color="orange.600" textAlign="center">
              Please select a response to continue
            </Text>
          )}

          <Button
            onClick={handleNext}
            colorScheme="blue"
          >
            {isLastQuestion ? "Complete" : "Next →"}
          </Button>
        </Flex>
      </Stack>
    </Container>
  );
} 