"use client";

import { Container, Box, Heading, Text, Button } from "@chakra-ui/react";
import { useQuestionnaire } from "@/lib/context";

/**
 * Completion view for successful questionnaire submission.
 * Displays thank you message and next steps for the study.
 * 
 * TODO: Enhance in later phases
 * - Data summary display
 * - Link to visualization tasks
 * - Export/download options
 * 
 * @returns JSX element containing completion interface
 */
export function CompleteView() {
  const { resetSession } = useQuestionnaire();

  return (
    <Container maxW="4xl" py={8}>
      <Box textAlign="center">
        <Heading size="xl" mb={4} color="green.600">
          🎉 Questionnaire Complete!
        </Heading>
        <Text fontSize="lg" mb={6}>
          Thank you for completing the PVQ-RR questionnaire.
        </Text>

        <Box p={6} bg="green.50" borderRadius="lg" mb={8}>
          <Text mb={4}>
            <strong>What happens next:</strong>
          </Text>
          <Text as="ul" textAlign="left" maxW="md" mx="auto">
            <Text as="li" mb={2}>• Your responses have been saved securely</Text>
            <Text as="li" mb={2}>• You&apos;ll proceed to the visualization tasks</Text>
            <Text as="li" mb={2}>• Compare 2D vs 3D value network representations</Text>
            <Text as="li" mb={2}>• Provide feedback on your experience</Text>
          </Text>
        </Box>

        <Button
          onClick={resetSession}
          variant="outline"
          size="sm"
        >
          Start New Session (Debug)
        </Button>
      </Box>
    </Container>
  );
} 