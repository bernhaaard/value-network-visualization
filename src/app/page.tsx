"use client";

import { Box, Container, Heading, Text, VStack } from "@chakra-ui/react";
import { ColorModeButton } from "@/components/ui";
import Link from "next/link";

export default function Home() {
  return (
    <Container maxW="7xl" py={8}>
      <VStack gap={8} align="stretch">
        {/* Header Section */}
        <Box
          bg="bg.subtle"
          borderRadius="xl"
          p={8}
          borderWidth="1px"
          borderColor="border.subtle"
        >
          <Box display="flex" justifyContent="space-between" alignItems="start" mb={6}>
            <Box>
              <Heading size="2xl" color="fg" mb={3}>
                Value Network Visualization
              </Heading>
              <Text fontSize="lg" color="fg.muted">
                Interactive 2D/3D platform for human value system analysis
              </Text>
            </Box>
            <ColorModeButton />
          </Box>
        </Box>

        {/* Main Content Area */}
        <Box
          bg="bg.subtle"
          borderRadius="xl"
          p={8}
          borderWidth="1px"
          borderColor="border.subtle"
          minH="400px"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <VStack gap={4} textAlign="center">
            <Heading size="lg" color="fg">
              Welcome to the Value Network Study
            </Heading>
            <Text color="fg.muted" maxW="md">
              This platform visualizes human value systems as interactive neural networks,
              helping researchers understand the relationships between different personal values.
            </Text>
            <Box pt={4}>
              <Link href="/questionnaire">
                <Box
                  as="button"
                  bg="interactive.primary"
                  color="fg.inverted"
                  px={8}
                  py={3}
                  borderRadius="md"
                  fontWeight="medium"
                  fontSize="lg"
                  _hover={{ bg: "interactive.hover" }}
                  transition="all 0.2s"
                >
                  Start Assessment
                </Box>
              </Link>
            </Box>
          </VStack>
        </Box>

        {/* Footer */}
        <Box textAlign="center" pt={4}>
          <Text fontSize="sm" color="fg.subtle">
            Built with Next.js 15 • React 19 • Chakra UI v3 • Three.js
          </Text>
        </Box>
      </VStack>
    </Container>
  );
}