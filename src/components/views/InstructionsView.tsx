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
            Alright, here we go!
          </Heading>
          <Text fontSize="lg" color="fg.muted">
            Thank you for taking part in my research on human value visualizations.
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
          <Text mb={4} color="fg">
            You&apos;re about to take something called the Portrait Values Questionnaire. You will see various descriptions of different people.
          </Text>
          <Text mb={4} color="fg">
            You should rate how much that person is like you using the scale from 1 (Not like me at all) to 6 (Very much like me).
          </Text>
          <Text mb={4} color="fg">
            The key thing is being honest - there are no right or wrong answers, just your authentic responses. Some descriptions might sound a bit formal or repetitive, but that&apos;s normal for these research questionnaires.
          </Text>
          <Text fontSize="sm" color="fg.subtle">
            This part takes about 10-15 minutes, then the fun visualization stuff begins!
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
            Start Questions
          </Button>
        </Box>
      </VStack>
    </Container>
  );
}