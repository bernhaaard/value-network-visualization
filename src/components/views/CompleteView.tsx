"use client";

import { useQuestionnaire } from "@/lib/context";
import { Container, Box, Heading, Text, Button, VStack } from "@chakra-ui/react";

/**
 * Completion view displayed after user finishes all questionnaire phases.
 * Shows thank you message and next steps.
 * 
 * @returns JSX element with completion message
 */
export function CompleteView() {
  const { resetSession } = useQuestionnaire();

  return (
    <Container maxW="2xl" py={8}>
      <Box
        bg="bg.subtle"
        borderRadius="xl"
        p={8}
        borderWidth="1px"
        borderColor="border.subtle"
      >
        <VStack gap={8} align="center" textAlign="center">
          {/* Success Header */}
          <Box>
            <Heading size="xl" mb={4} color="status.success">
              ✓ Thank You!
            </Heading>
            <Text fontSize="lg" color="fg.muted">
              You&apos;ve successfully completed the Portrait Values Questionnaire
            </Text>
          </Box>

          {/* Next Steps Box */}
          <Box
            p={6}
            bg="bg.muted"
            borderRadius="md"
            borderWidth="1px"
            borderColor="border.subtle"
            w="full"
          >
            <Heading size="md" mb={3} color="fg">
              What Happens Next?
            </Heading>
            <Text as="ul" textAlign="left" maxW="md" mx="auto" color="fg.muted">
              <Text as="li" mb={2}>Your responses have been saved</Text>
              <Text as="li" mb={2}>The data will be used for value network visualization research</Text>
              <Text as="li" mb={2}>All information remains anonymous and confidential</Text>
            </Text>
          </Box>

          {/* Debug Reset Button */}
          <Button
            onClick={resetSession}
            variant="outline"
            size="sm"
            borderColor="border"
            color="fg.muted"
            _hover={{ bg: "bg.muted", borderColor: "border.accent" }}
          >
            Start New Session (Debug)
          </Button>
        </VStack>
      </Box>
    </Container>
  );
}