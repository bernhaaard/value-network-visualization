"use client";

import { Container, Box, Heading, Text } from "@chakra-ui/react";

/**
 * PVQ-RR Questionnaire component for displaying individual questions.
 * Handles 57 questions + 2 attention checks with 6-point Likert scale.
 * 
 * TODO: Implement in Phase 3
 * - Single question display with gender-appropriate text
 * - 6-point Likert scale interaction
 * - Progress tracking and navigation
 * - Attention check validation
 * 
 * @returns JSX element containing questionnaire interface
 */
export function QuestionnaireView() {
  return (
    <Container maxW="4xl" py={8}>
      <Box textAlign="center">
        <Heading size="xl" mb={4}>
          PVQ-RR Questionnaire
        </Heading>
        <Text fontSize="lg" color="gray.600">
          Phase 3: Implementation coming next...
        </Text>
        <Text mt={4} color="gray.500">
          This will include:
        </Text>
        <Text as="ul" mt={2} color="gray.500" textAlign="left" maxW="md" mx="auto">
          <Text as="li">• Single question per page with navigation</Text>
          <Text as="li">• 6-point Likert scale (Not like me at all → Very much like me)</Text>
          <Text as="li">• Progress tracker excluding attention checks</Text>
          <Text as="li">• Gender-appropriate question text</Text>
          <Text as="li">• Response validation before next question</Text>
        </Text>
      </Box>
    </Container>
  );
} 