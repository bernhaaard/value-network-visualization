"use client";

import React from "react";
import { Container, Box, Heading, Text, VStack, Button } from "@chakra-ui/react";
import { useVisualization } from "@/lib/context";

/**
 * Study completion view displayed after user finishes all visualization tasks.
 * Shows final thank you message and research contribution information.
 * 
 * @returns JSX element with study completion message
 */
export function StudyCompleteView() {
  const { debugState } = useVisualization();

  return (
    <Container maxW="2xl" py={8}>
      <Box
        bg="bg.subtle"
        borderRadius="xl"
        p={8}
        borderWidth="1px"
        borderColor="border.subtle"
      >
        {/* Header */}
        <Box mb={4} textAlign="center">
          <Heading size="xl" mb={4} color="status.success">
            ✓ Study Complete!
          </Heading>
          <Text fontSize="lg" color="fg.muted">
            Thank you for participating in this research study about value network visualizations.
          </Text>
        </Box>

        <VStack gap={6}>
          <Box
            p={{ base: 6, md: 8 }}
            bg="bg.muted"
            borderRadius="md"
            borderWidth="1px"
            borderColor="border.subtle"
            w="full"
          >
            <Text fontWeight="medium" mb={2}>
              Your Contribution
            </Text>
            <Text color="fg.muted">
              Your feedback will contribute to understanding how different visualization approaches
              affect comprehension of personal values. I appreciate your time and effort!
            </Text>
          </Box>

          {process.env.NODE_ENV === "development" && (
            <Button
              onClick={debugState}
              variant="ghost"
              size="sm"
              bg="bg.subtle"
              borderColor="border.subtle"
              color="fg.muted"
              _hover={{ bg: "bg.muted", borderColor: "border" }}
            >
              Debug State (Dev)
            </Button>
          )}
        </VStack>
      </Box>
    </Container>
  );
}
