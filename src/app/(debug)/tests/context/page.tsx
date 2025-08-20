"use client";

import {
  Box,
  Button,
  Flex,
  Heading,
  Text,
  Card,
  Stack,
  Grid,
  Badge,
  Code,
  ClientOnly,
} from "@chakra-ui/react";
import { useQuestionnaire } from "@/lib/context";
import { useState, useEffect } from "react";
import type { UserDemographics, QuestionnairePhase, QuestionId, AttentionCheckId, ResponseValue } from "@/types";

/**
 * Comprehensive QuestionnaireProvider verification page.
 * Tests all context functionality for development and thesis evaluation purposes.
 */
export default function ContextTestPage() {
  const {
    // State values
    metadata,
    demographics,
    responses,
    progress,
    isLoading,
    error,
    persistence,

    // Convenience methods
    startSession,
    answerQuestion,
    setPhase,
    completeQuestionnaire,
    resetSession,
    debugState,
    clearError,
  } = useQuestionnaire();

  // Debug tracking - FIXED hydration safe version
  const [renderCount, setRenderCount] = useState(0);
  const [lastDebounceTest, setLastDebounceTest] = useState<string>("");

  // Increment render counter only when key state changes (not every render)
  const responseCount = Object.keys(responses).length;
  useEffect(() => {
    setRenderCount(prev => prev + 1);
  }, [metadata?.sessionId, responseCount]);

  // Test data for simulating different scenarios
  const testDemographics: UserDemographics = {
    age: 25,
    gender: "male",
    education: "bachelor_degree",
    nationality: "Austria",
  };

  // Debug test functions
  const testStateStability = () => {
    console.log("🧪 Testing state stability - 10 rapid updates");
    for (let i = 0; i < 10; i++) {
      setTimeout(() => {
        answerQuestion("pvq_rr_en_q01", (Math.floor(Math.random() * 6) + 1) as 1 | 2 | 3 | 4 | 5 | 6);
      }, i * 50);
    }
  };

  const testDebounce = () => {
    console.log("🧪 Testing debounce - 5 rapid calls");
    const start = Date.now();
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        answerQuestion("pvq_rr_en_q02", (Math.floor(Math.random() * 6) + 1) as 1 | 2 | 3 | 4 | 5 | 6);
        if (i === 4) {
          setTimeout(() => {
            setLastDebounceTest(`${Date.now() - start}ms ago`);
          }, 600); // After debounce completes
        }
      }, i * 100);
    }
  };

  const simulateQuestionnaireAnswers = () => {
    // Simulate answering all questions
    for (let i = 1; i <= 57; i++) {
      const questionId = `pvq_rr_en_q${i.toString().padStart(2, '0')}` as QuestionId | AttentionCheckId;
      const response = (Math.floor(Math.random() * 6) + 1) as ResponseValue;
      answerQuestion(questionId, response);
    }
  };


  const simulatePhaseProgression = (currentPhase: QuestionnairePhase) => {
    if (currentPhase === "demographics") {
      setPhase("instructions");
    } else if (currentPhase === "instructions") {
      setPhase("questionnaire");
    } else if (currentPhase === "questionnaire") {
      setPhase("complete");
    }
  };

  return (
    <Stack gap={6} align="stretch">
      <Box>
        <Heading size="md" mb={4}>
          QuestionnaireProvider Test Page
        </Heading>
        <Text color="fg.muted">
          Testing page for state management and localStorage persistence.
        </Text>
      </Box>

      {/* Debug Information - NEW */}
      <Card.Root bg="bg.muted" borderColor="border">
        <Card.Body p={6}>
          <Heading size="sm" mb={4} color="fg">Debug Information</Heading>
          <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={4}>
            <Box>
              <Text fontWeight="medium">Hydration Safe:</Text>
              <ClientOnly fallback={
                <Badge bg="status.warning" color="fg.inverted">SSR/Hydrating</Badge>
              }>
                <Badge bg="status.success" color="fg.inverted">Client Detected</Badge>
              </ClientOnly>
              <Text fontSize="xs" color="fg.muted">
                Should be &quot;SSR/Hydrating&quot; initially, then &quot;Client Detected&quot;
              </Text>
            </Box>
            <Box>
              <Text fontWeight="medium">Render Count:</Text>
              <ClientOnly fallback={<Badge bg="bg.muted" color="fg">0</Badge>}>
                <Badge bg="purple" color="white">
                  {renderCount}
                </Badge>
              </ClientOnly>
              <Text fontSize="xs" color="fg.muted">
                Should increment slowly, not rapidly
              </Text>
            </Box>
            <Box>
              <Text fontWeight="medium">State Update Test:</Text>
              <Button
                size="xs"
                onClick={testStateStability}
                bg="transparent"
                color="orange"
                border="1px solid"
                borderColor="orange"
                _hover={{ bg: "orange", color: "fg.inverted" }}
              >
                Test Stability (10 rapid updates)
              </Button>
            </Box>
            <Box>
              <Text fontWeight="medium">Debounce Test:</Text>
              <ClientOnly fallback={<Text fontSize="sm">Last save: Loading...</Text>}>
                <Text fontSize="sm">
                  Last save: {lastDebounceTest || "None"}
                </Text>
              </ClientOnly>
              <Button
                size="xs"
                onClick={testDebounce}
                bg="transparent"
                color="orange"
                border="1px solid"
                borderColor="orange"
                _hover={{ bg: "orange", color: "fg.inverted" }}
              >
                Test Debounce (5 rapid calls)
              </Button>
            </Box>
          </Grid>
        </Card.Body>
      </Card.Root>

      {/* Quick Actions */}
      <Card.Root>
        <Card.Body p={6}>
          <Heading size="sm" mb={4}>Quick Actions</Heading>
          <Flex gap={3} flexWrap="wrap">
            <Button
              onClick={() => startSession(testDemographics)}
              bg="transparent"
              color="status.success"
              border="1px solid"
              borderColor="status.success"
              _hover={{ bg: "status.success", color: "fg.inverted" }}
              size="sm"
            >
              Start Test Session
            </Button>
            <Button
              onClick={simulateQuestionnaireAnswers}
              bg="transparent"
              color="interactive.primary"
              border="1px solid"
              borderColor="interactive.primary"
              _hover={{ bg: "interactive.primary", color: "fg.inverted" }}
              size="sm"
            >
              Simulate Answers
            </Button>
            <Button
              onClick={() => simulatePhaseProgression(metadata?.currentPhase || "instructions")}
              bg="transparent"
              color="interactive.primary"
              border="1px solid"
              borderColor="interactive.primary"
              _hover={{ bg: "interactive.primary", color: "fg.inverted" }}
              size="sm"
            >
              Test Phase Progression
            </Button>
            <Button
              onClick={completeQuestionnaire}
              bg="transparent"
              color="interactive.primary"
              border="1px solid"
              borderColor="interactive.primary"
              _hover={{ bg: "interactive.primary", color: "fg.inverted" }}
              size="sm"
            >
              Complete Session
            </Button>
            <Button
              onClick={debugState}
              bg="transparent"
              color="fg"
              border="1px solid"
              borderColor="border"
              _hover={{ bg: "bg.subtle", borderColor: "border.accent" }}
              size="sm"
            >
              Debug Console
            </Button>
            <Button
              onClick={resetSession}
              bg="transparent"
              color="status.error"
              border="1px solid"
              borderColor="status.error"
              _hover={{ bg: "status.error", color: "fg.inverted" }}
              size="sm"
            >
              Reset All
            </Button>
          </Flex>
        </Card.Body>
      </Card.Root>

      {/* State Overview */}
      <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap={6}>

        {/* Session & Demographics */}
        <Card.Root>
          <Card.Body p={6}>
            <Heading size="sm" mb={4}>Session & Demographics</Heading>
            <Stack gap={3} align="stretch">
              <Box>
                <Text fontWeight="medium">Session ID:</Text>
                <Code bg="bg.subtle" color="fg" px={2} py={1} borderRadius="md">{metadata?.sessionId || "None"}</Code>
              </Box>
              <Box>
                <Text fontWeight="medium">Current Phase:</Text>
                <Badge bg={metadata?.currentPhase === "complete" ? "status.success" : "interactive.primary"} color="fg.inverted">
                  {metadata?.currentPhase || "None"}
                </Badge>
              </Box>
              <Box>
                <Text fontWeight="medium">Demographics:</Text>
                <Code
                  fontSize="sm"
                  bg="bg.subtle"
                  color="fg"
                  p={3}
                  borderRadius="md"
                  display="block"
                  whiteSpace="pre"
                >
                  {demographics ? JSON.stringify(demographics, null, 2) : "None"}
                </Code>
              </Box>
            </Stack>
          </Card.Body>
        </Card.Root>

        {/* Progress & Responses */}
        <Card.Root>
          <Card.Body p={6}>
            <Heading size="sm" mb={4}>Progress & Responses</Heading>
            <Stack gap={3} align="stretch">
              <Box>
                <Text fontWeight="medium">Progress:</Text>
                <Text>{progress.completedQuestions}/{progress.totalQuestions} questions</Text>
                <Text fontSize="sm" color="fg.muted">{progress.percentComplete}% complete</Text>
              </Box>
              <Box>
                <Text fontWeight="medium">Recent Responses:</Text>
                <Code
                  fontSize="sm"
                  maxH="100px"
                  overflowY="auto"
                  bg="bg.subtle"
                  color="fg"
                  p={3}
                  borderRadius="md"
                  display="block"
                  whiteSpace="pre"
                >
                  {Object.keys(responses).length > 0
                    ? JSON.stringify(responses, null, 2)
                    : "No responses yet"
                  }
                </Code>
              </Box>
            </Stack>
          </Card.Body>
        </Card.Root>
      </Grid>

      {/* Persistence Status */}
      <Card.Root>
        <Card.Body p={6}>
          <Heading size="sm" mb={4}>localStorage Persistence</Heading>
          <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(4, 1fr)" }} gap={4}>
            <Box>
              <Text fontWeight="medium">Supported:</Text>
              <ClientOnly fallback={<Badge bg="bg.muted" color="fg">Loading...</Badge>}>
                <Badge bg={persistence.isSupported ? "status.success" : "status.error"} color="fg.inverted">
                  {persistence.isSupported ? "Yes" : "No"}
                </Badge>
              </ClientOnly>
            </Box>
            <Box>
              <Text fontWeight="medium">Last Save:</Text>
              <ClientOnly fallback={<Text fontSize="sm">Loading...</Text>}>
                <Text fontSize="sm">
                  {persistence.lastSaveTime?.toLocaleTimeString() || "Never"}
                </Text>
              </ClientOnly>
            </Box>
            <Box>
              <Text fontWeight="medium">Pending Save:</Text>
              <ClientOnly fallback={<Badge bg="bg.subtle" color="fg">Loading...</Badge>}>
                <Badge bg={persistence.pendingSave ? "status.warning" : "bg.subtle"} color={persistence.pendingSave ? "fg.inverted" : "fg"}>
                  {persistence.pendingSave ? "Yes" : "No"}
                </Badge>
              </ClientOnly>
            </Box>
            <Box>
              <Text fontWeight="medium">Error:</Text>
              <ClientOnly fallback={<Text fontSize="sm" color="fg.muted">Loading...</Text>}>
                <Text fontSize="sm" color={persistence.lastError ? "status.error" : "fg.muted"}>
                  {persistence.lastError || "None"}
                </Text>
              </ClientOnly>
            </Box>
          </Grid>
        </Card.Body>
      </Card.Root>

      {/* Error Handling */}
      {error && (
        <Card.Root borderColor="status.error">
          <Card.Body p={6}>
            <Flex justify="space-between" align="center">
              <Box>
                <Heading size="sm" color="status.error" mb={2}>Current Error</Heading>
                <Text color="status.error">{error}</Text>
              </Box>
              <Button
                onClick={clearError}
                size="sm"
                bg="transparent"
                color="status.error"
                border="1px solid"
                borderColor="status.error"
                _hover={{ bg: "status.error", color: "fg.inverted" }}
              >
                Clear Error
              </Button>
            </Flex>
          </Card.Body>
        </Card.Root>
      )}

      {/* System Info */}
      <Card.Root bg="bg.muted">
        <Card.Body p={6} color="fg">
          <Heading size="sm" mb={4}>System Information</Heading>
          <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap={4}>
            <Box>
              <Text fontWeight="medium">Loading State:</Text>
              <Badge bg={isLoading ? "status.warning" : "bg.subtle"} color={isLoading ? "fg.inverted" : "fg"}>
                {isLoading ? "Loading" : "Idle"}
              </Badge>
            </Box>
            <Box>
              <Text fontWeight="medium">localStorage Available:</Text>
              <ClientOnly fallback={
                <Badge bg="status.error" color="fg.inverted">Unknown</Badge>
              }>
                {() => (
                  <Badge bg={window.localStorage ? "status.success" : "status.error"} color="fg.inverted">
                    {window.localStorage ? "Yes" : "No"}
                  </Badge>
                )}
              </ClientOnly>
            </Box>
            <Box>
              <Text fontWeight="medium">Environment:</Text>
              <Badge bg="bg.subtle" color="fg" px={2} py={1}>{process.env.NODE_ENV}</Badge>
            </Box>
          </Grid>
        </Card.Body>
      </Card.Root>
    </Stack>
  );
} 