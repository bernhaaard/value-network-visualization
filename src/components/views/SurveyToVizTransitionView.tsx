"use client";

import NextLink from "next/link";
import { Container, Box, Heading, Text, Button, VStack } from "@chakra-ui/react";

/**
 * Transition view after questionnaire phases.
 * Page between survey completion and visualization page.
 * 
 * @returns JSX element with completion message and next steps
 */
export function SurveyToVizTransitionView() {

  return (
    <Container maxW="2xl" py={8}>
      <Box
        bg="bg.subtle"
        borderRadius="xl"
        p={8}
        borderWidth="1px"
        borderColor="border.subtle"
      >
        <VStack gap={8} align="center" textAlign="left">
          {/* Success Header */}
          <Box textAlign="center">
            <Heading size="xl" mb={4} color="status.success">
              Questionnaire Complete!
            </Heading>
            <Text fontSize="lg" color="fg.muted">
              Your answers just created something unique - a network showing what matters most to you.
            </Text>
          </Box>

          {/* Explanation Box */}
          <Box
            p={6}
            bg="bg.muted"
            borderRadius="md"
            borderWidth="1px"
            borderColor="border.subtle"
            w="full"
            maxW="2xl"
          >
            <Text mb={4} color="fg">
              The closer a value is to the center node, the more important it is to you personally. Essentially, we&apos;re putting your core values close to the center!
            </Text>
            <Text mb={4} color="fg">
              Values that are close to each other in the network, like Hedonism and Stimulation, are similar. Values on opposite sides of the network tend to conflict - it&apos;s rare for someone to highly value both Tradition and Self-Direction of Thought at the same time.
            </Text>
            <Text mb={4} color="fg">
              In 2D mode, you&apos;ll see your values spread around the &quot;you&quot; node like a compass. In 3D mode, they also spread up and down based on whether they focus on Growth or Self Protection.
            </Text>
            <Text mb={4} color="fg.muted" fontSize="sm">
              Growth values (upper hemisphere in 3D) focus on expanding possibilities and self-enhancement, while self-protection values (lower hemisphere in 3D) focus on avoiding threats and maintaining security.
              Neither growth nor self-protection values are better - they just represent the different priorities you have in life.
            </Text>
            <Text color="fg.muted" fontSize="sm">
              You can rotate by dragging, zoom with your mouse wheel, and hover over any value to learn what it means. Take your time exploring - there&apos;s no rush!
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
              Explore Your Values
            </NextLink>
          </Button>
        </VStack>
      </Box>
    </Container>
  );
}