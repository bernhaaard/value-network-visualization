"use client";

import {
  Box,
  Button,
  Flex,
  Heading,
  Text,
  Stack,
  Grid,
  Badge,
  Code,
  Separator,
} from "@chakra-ui/react";
import { Card } from "@chakra-ui/react";
import { useQuestionnaire } from "@/lib/context";
import { useIsClient } from "@/hooks";
import { useState, useEffect } from "react";
import type { UserDemographics, StudyPhase } from "@/types";

/**
 * Comprehensive QuestionnaireProvider verification page.
 * Tests all context functionality for development and thesis evaluation purposes.
 */
export default function ContextTestPage() {
  const isClient = useIsClient();
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
    // Simulate answering a few questions
    answerQuestion("pvq_rr_en_q01", 4);
    answerQuestion("pvq_rr_en_q02", 3);
    answerQuestion("pvq_rr_en_q03", 5);
    answerQuestion("pvq_rr_en_q04", 2);
    answerQuestion("pvq_rr_en_q05", 4);
    answerQuestion("pvq_rr_en_q06", 3);
    answerQuestion("pvq_rr_en_q07", 2);
    answerQuestion("pvq_rr_en_q08", 4);
    answerQuestion("pvq_rr_en_q09", 3);
    answerQuestion("pvq_rr_en_q10", 2);
    answerQuestion("pvq_rr_en_q11", 4);
    answerQuestion("pvq_rr_en_q12", 3);
  };

  const simulatePhaseProgression = (currentPhase: StudyPhase) => {
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
          QuestionnaireProvider Test Suite
        </Heading>
        <Text color="gray.600">
          Comprehensive testing of Context API state management, localStorage persistence,
          and convenience methods for thesis evaluation.
        </Text>
      </Box>

      {/* Debug Information - NEW */}
      <Card.Root bg="blue.50" borderColor="blue.200">
        <Card.Body p={6}>
          <Heading size="sm" mb={4} color="blue.700">🔧 Debug Information (Verify Fixes)</Heading>
          <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={4}>
            <Box>
              <Text fontWeight="medium">Hydration Safe:</Text>
              <Badge bg={isClient ? "green" : "orange"}>
                {isClient ? "Client Detected" : "SSR/Hydrating"}
              </Badge>
              <Text fontSize="xs" color="gray.600">
                Should be &quot;SSR/Hydrating&quot; initially, then &quot;Client Detected&quot;
              </Text>
            </Box>
            <Box>
              <Text fontWeight="medium">Render Count:</Text>
              <Badge bg="purple" color="white">{renderCount}</Badge>
              <Text fontSize="xs" color="gray.600">
                Should increment slowly, not rapidly
              </Text>
            </Box>
            <Box>
              <Text fontWeight="medium">State Update Test:</Text>
              <Button size="xs" onClick={testStateStability} colorScheme="blue">
                Test Stability (10 rapid updates)
              </Button>
            </Box>
            <Box>
              <Text fontWeight="medium">Debounce Test:</Text>
              <Text fontSize="sm">Last save: {lastDebounceTest || "None"}</Text>
              <Button size="xs" onClick={testDebounce} colorScheme="purple">
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
              colorScheme="green"
              size="sm"
            >
              Start Test Session
            </Button>
            <Button
              onClick={simulateQuestionnaireAnswers}
              colorScheme="blue"
              size="sm"
            >
              Simulate Answers
            </Button>
            <Button
              onClick={() => simulatePhaseProgression(metadata?.currentPhase || "instructions")}
              colorScheme="purple"
              size="sm"
            >
              Test Phase Progression
            </Button>
            <Button
              onClick={completeQuestionnaire}
              colorScheme="orange"
              size="sm"
            >
              Complete Session
            </Button>
            <Button
              onClick={debugState}
              variant="outline"
              size="sm"
            >
              Debug Console
            </Button>
            <Button
              onClick={resetSession}
              colorScheme="red"
              variant="outline"
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
                <Code>{metadata?.sessionId || "None"}</Code>
              </Box>
              <Box>
                <Text fontWeight="medium">Current Phase:</Text>
                <Badge bg={metadata?.currentPhase === "complete" ? "green.500" : "blue.500"} color="white">
                  {metadata?.currentPhase || "None"}
                </Badge>
              </Box>
              <Box>
                <Text fontWeight="medium">Demographics:</Text>
                <Code fontSize="sm">
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
                <Text fontSize="sm" color="gray.600">{progress.percentComplete}% complete</Text>
              </Box>
              <Box>
                <Text fontWeight="medium">Recent Responses:</Text>
                <Code fontSize="sm" maxH="100px" overflowY="auto">
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
              <Badge bg={persistence.isSupported ? "green.500" : "red.500"} color="white">
                {persistence.isSupported ? "Yes" : "No"}
              </Badge>
            </Box>
            <Box>
              <Text fontWeight="medium">Last Save:</Text>
              <Text fontSize="sm">
                {persistence.lastSaveTime?.toLocaleTimeString() || "Never"}
              </Text>
            </Box>
            <Box>
              <Text fontWeight="medium">Pending Save:</Text>
              <Badge bg={persistence.pendingSave ? "yellow.600" : "gray.500"} color="white">
                {persistence.pendingSave ? "Yes" : "No"}
              </Badge>
            </Box>
            <Box>
              <Text fontWeight="medium">Error:</Text>
              <Text fontSize="sm" color={persistence.lastError ? "red.500" : "gray.500"}>
                {persistence.lastError || "None"}
              </Text>
            </Box>
          </Grid>
        </Card.Body>
      </Card.Root>

      {/* Error Handling */}
      {error && (
        <Card.Root borderColor="red.200">
          <Card.Body p={6}>
            <Flex justify="space-between" align="center">
              <Box>
                <Heading size="sm" color="red.600" mb={2}>Current Error</Heading>
                <Text color="red.600">{error}</Text>
              </Box>
              <Button onClick={clearError} size="sm" colorScheme="red" variant="outline">
                Clear Error
              </Button>
            </Flex>
          </Card.Body>
        </Card.Root>
      )}

      {/* System Info */}
      <Card.Root bg="gray.50">
        <Card.Body p={6} color="black">
          <Heading size="sm" mb={4}>System Information</Heading>
          <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap={4}>
            <Box>
              <Text fontWeight="medium">Loading State:</Text>
              <Badge bg={isLoading ? "yellow" : "gray"} color={"white"}>
                {isLoading ? "Loading" : "Idle"}
              </Badge>
            </Box>
            <Box>
              <Text fontWeight="medium">localStorage Available:</Text>
              <Badge bg={isClient && window.localStorage ? "green.500" : "red.500"} color="white">
                {isClient && window.localStorage ? "Yes" : "No"}
              </Badge>
            </Box>
            <Box>
              <Text fontWeight="medium">Environment:</Text>
              <Badge bg={"gray.700"} color={"white"}>{process.env.NODE_ENV}</Badge>
            </Box>
          </Grid>
        </Card.Body>
      </Card.Root>

      <Separator />

      <Box>
        <Text fontSize="sm" color="gray.500" textAlign="center">
          🎓 This page demonstrates comprehensive Context API functionality for thesis evaluation.
          Check browser console for detailed development logs.
        </Text>
      </Box>
    </Stack>
  );
} 