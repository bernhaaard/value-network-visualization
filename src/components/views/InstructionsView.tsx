"use client";

import { Container, Box, Heading, Text, Button, VStack } from "@chakra-ui/react";
import { useQuestionnaire } from "@/lib/context";

export function InstructionsView() {
  const { setPhase } = useQuestionnaire();

  return (
    <Container maxW="4xl" py={8}>
      <VStack gap={8} align="stretch">
        {/* Header */}
        <Box textAlign="center">
          <Heading size="2xl" mb={4} color="fg">
            Welcome to the Study
          </Heading>
          <Text fontSize="lg" color="fg.muted">
            Thank you for participating in my research on human value visualizations.
          </Text>
        </Box>

        {/* Instructions Box */}
        <Box
          p={8}
          bg="bg.subtle"
          borderRadius="md"
          borderWidth="1px"
          borderColor="border.subtle"
        >
          <Heading size="lg" mb={4} color="fg">
            Instructions for the PVQ-RR Questionnaire
          </Heading>
          <Text mb={4} color="fg">
            You will now complete the Portrait Values Questionnaire-Revised (PVQ-RR).
            This questionnaire measures your personal values and what&apos;s important to you in life.
          </Text>
          <Text mb={4} color="fg" fontWeight="medium">
            How it works:
          </Text>
          <Text as="ul" ml={1} mb={4} color="fg.muted" pl={4} borderLeftWidth="4px" borderLeftColor="orange.dark">
            <Text as="li" mb={2}>You&apos;ll see 57 short descriptions of different people</Text>
            <Text as="li" mb={2}>For each person, decide how similar they are to you</Text>
            <Text as="li" mb={2}>Use the 6-point scale from &ldquo;Not like me at all&rdquo; to &ldquo;Very much like me&rdquo;</Text>
            <Text as="li" mb={2}>There are no right or wrong answers - just be honest</Text>
            <Text as="li" mb={2}>The questionnaire takes about 10-15 minutes</Text>
          </Text>
          <Text fontSize="sm" color="fg.subtle">
            Please read each description carefully and answer honestly.
          </Text>
        </Box>

        {/* Action Button */}
        <Box textAlign="center">
          <Button
            onClick={() => setPhase("questionnaire")}
            bg="interactive.primary"
            color="fg.inverted"
            size="lg"
            px={8}
            fontSize="lg"
            _hover={{ bg: "interactive.hover" }}
          >
            Start Questionnaire
          </Button>
        </Box>
      </VStack>
    </Container>
  );
}