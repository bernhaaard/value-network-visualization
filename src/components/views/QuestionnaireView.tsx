"use client";

import React, { useState } from "react";
import {
  Container,
  Box,
  Heading,
  Text,
  Button,
  Flex,
  Stack,
  Alert,
} from "@chakra-ui/react";
import { useQuestionnaire } from "@/lib/context";
import { ErrorDisplay } from "@/components/ui";
import type { ResponseValue, QuestionId, AttentionCheckId, PVQRRQuestionnaire, Gender } from "@/types";

/**
 * Get question text by participant's gender and itemId
 */
const getQuestionText = (itemId: QuestionId | AttentionCheckId, gender: Gender, questionnaire: PVQRRQuestionnaire): string => {
  const questionData = questionnaire.questions[itemId];

  if (!questionData) return "Question not found";

  // Use neutral version for non-binary and prefer_not_to_say
  if (gender === "non-binary" || gender === "prefer_not_to_say") {
    return questionData.neutral || questionData.male;
  }

  return questionData[gender] || `Question for gender option (${gender}) not found`;
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
    completeQuestionnaire,
    calculateAndStoreValueProfile,
    isLoading,
    error,
    canAnswerQuestions,
    validateQuestionnaireLength,
    orderedQuestionIds,
    progress
  } = useQuestionnaire();

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

  // Get current item
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
  const progressPercentage = progress.percentComplete;

  // Navigation helpers
  const canGoBack = navigationIndex > 0;
  const canGoNext = currentResponse !== undefined;
  const isLastQuestion = navigationIndex === totalItems - 1;

  const handleNext = () => {
    if (canGoNext) {
      setAttemptedNext(false);
      if (isLastQuestion) {
        // Complete questionnaire , then calculate value profile
        completeQuestionnaire();
        calculateAndStoreValueProfile();
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
      <Stack gap={6}>
        {/* Context Error Display */}
        {error && (
          <ErrorDisplay
            title="Error"
            message={error}
            variant="inline"
          />
        )}

        {/* Progress Bar */}
        <Box borderColor="border.subtle" borderWidth="1px" borderRadius="md" p={4}>
          <Text fontSize="sm" color="fg.muted" mb={2}>
            Progress: {progressPercentage}%
          </Text>
          <Box w="full" bg="bg.subtle" rounded="full" h="3">
            <Box
              bg="interactive.primary"
              h="full"
              rounded="full"
              w={`${progressPercentage}%`}
              transition="width 0.5s ease"
            />
          </Box>
        </Box>

        {/* Question */}
        <Box borderColor="border.muted">
          <Heading size="3xl" mb={6} lineHeight="tall" color="fg">
            {currentQuestionText}
          </Heading>

          {/* 6-Point Likert Scale */}
          <Stack gap={3}>
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
                  borderColor={isSelected ? "interactive.primary" : "border.muted"}
                  bg={isSelected ? "bg.selected" : "bg.subtle"}
                  rounded="md"
                  _hover={{ bg: isSelected ? "bg.selected" : "bg.muted" }}
                  transition="all 0.2s"
                >
                  <Flex align="center" gap={3}>
                    <Box
                      w="3"
                      h="3"
                      borderWidth="2px"
                      borderColor={isSelected ? "interactive.primary" : "border"}
                      rounded="full"
                      bg={isSelected ? "interactive.primary" : "bg"}
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
                          bg="fg.inverted"
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
                    <Text fontWeight="medium" color="fg">
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
            variant="ghost"
            bg="bg.subtle"
            borderColor="border.subtle"
            color="fg.muted"
            _hover={{ bg: "bg.muted", borderColor: "border" }}
          >
            ← Previous
          </Button>

          {/* Validation Error */}
          {attemptedNext && !currentResponse && (
            <Alert.Root status="warning" bg="bg.subtle" color="status.error" border="1px solid" borderColor="status.error" size="sm" width="fit-content">
              <Alert.Indicator />
              <Alert.Content>
                <Alert.Title>Please select a response to continue</Alert.Title>
              </Alert.Content>
            </Alert.Root>
          )}

          <Button
            onClick={handleNext}
            bg="interactive.primary"
            color="fg.inverted"
            _hover={{ bg: "interactive.hover" }}
          >
            {isLastQuestion ? "Complete" : "Next →"}
          </Button>
        </Flex>
      </Stack>
    </Container>
  );
}