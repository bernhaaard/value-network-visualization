"use client";

import { Container, Box, Heading, Text, Button } from "@chakra-ui/react";
import { useQuestionnaire } from "@/lib/context";

/**
 * Instructions component for the PVQ-RR questionnaire.
 * Displays overview and instructions before questionnaire begins.
 * 
 * @returns JSX element containing questionnaire instructions
 */
export function InstructionsView() {
  const { setPhase } = useQuestionnaire();

  return (
    <Container maxW="4xl" py={8}>
      <Box mb={8}>
        <Heading size="xl" mb={4}>
          Welcome to the Study
        </Heading>
        <Text fontSize="lg" color="gray.600">
          Thank you for participating in our research on human values visualization.
        </Text>
      </Box>

      <Box p={8} bg="blue.50" borderRadius="lg" mb={8}>
        <Heading size="lg" mb={4}>
          Instructions for the PVQ-RR Questionnaire
        </Heading>
        <Text mb={4}>
          You will now complete the Portrait Values Questionnaire-Revised (PVQ-RR).
          This questionnaire measures your personal values and what&apos;s important to you in life.
        </Text>
        <Text mb={4}>
          <strong>How it works:</strong>
        </Text>
        <Text as="ul" ml={6} mb={4}>
          <Text as="li" mb={2}>You&apos;ll see 57 short descriptions of different people</Text>
          <Text as="li" mb={2}>For each person, decide how similar they are to you</Text>
          <Text as="li" mb={2}>Use the 6-point scale from &ldquo;Not like me at all&rdquo; to &ldquo;Very much like me&rdquo;</Text>
          <Text as="li" mb={2}>There are no right or wrong answers - just be honest</Text>
          <Text as="li" mb={2}>The questionnaire takes about 10-15 minutes</Text>
        </Text>
        <Text fontSize="sm" color="gray.600">
          Please read each description carefully and answer honestly.
        </Text>
      </Box>

      <Box textAlign="center">
        <Button
          onClick={() => setPhase("questionnaire")}
          colorScheme="blue"
          size="lg"
        >
          Start Questionnaire
        </Button>
      </Box>
    </Container>
  );
} 