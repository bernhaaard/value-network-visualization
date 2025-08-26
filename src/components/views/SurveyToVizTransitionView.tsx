"use client";

import { useQuestionnaire } from "@/lib/context";
import NextLink from "next/link";
import { Container, Box, Heading, Text, Button, VStack } from "@chakra-ui/react";

/**
 * Transition view after questionnaire phases.
 * Page between survey completion and visualization page.
 * 
 * @returns JSX element with completion message and next steps
 */
export function SurveyToVizTransitionView() {
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
              <Text as="li" mb={2}>First, you'll explore your values in a 2D network view</Text>
              <Text as="li" mb={2}>Then, you'll explore the same data in 3D space</Text>
              <Text as="li" mb={2}>After each visualization, you'll complete a brief task and provide feedback</Text>
            </Text>
          </Box>

          {/* Continue Button */}
          <Button asChild
            bg="interactive.primary"
            color="fg.inverted"
            size="lg"
            _hover={{ bg: "interactive.hover" }}
          >
            <NextLink href="/visualization">
              Continue to Visualization →
            </NextLink>
          </Button>

          {/* Debug Reset Button */}
          <Button
            onClick={resetSession}
            variant="outline"
            size="sm"
            borderColor="border"
            color="fg.muted"
            _hover={{ bg: "bg.muted", borderColor: "interactive.primary" }}
          >
            Reset Session (Debug)
          </Button>
        </VStack>
      </Box>
    </Container>
  );
}