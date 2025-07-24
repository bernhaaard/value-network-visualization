import { Box, Container, Flex, Heading, Link, Text } from "@chakra-ui/react";
import NextLink from "next/link";

/**
 * Debug route group layout providing navigation and development context indicators.
 * Enables easy switching between debugging tools during development and thesis evaluation.
 */
export default function DebugLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Container maxW="8xl" py={6}>
      <Box mb={8}>
        <Heading size="lg" mb={2}>
          🔧 Development & Evaluation Tools
        </Heading>
        <Text color="gray.600" mb={4}>
          Internal tools for testing, debugging, and thesis evaluation purposes.
        </Text>

        <Flex gap={6} flexWrap="wrap">
          <Link as={NextLink} href="/tools" color="orange.500" fontWeight="medium">
            🏠 Debug Dashboard
          </Link>
          <Link as={NextLink} href="/tests/context" color="blue.500" fontWeight="medium">
            Context Tests
          </Link>
          <Link as={NextLink} href="/tests/components" color="blue.500" fontWeight="medium">
            Component Tests
          </Link>
          <Link as={NextLink} href="/tools/data-export" color="green.500" fontWeight="medium">
            Data Export
          </Link>
          <Link as={NextLink} href="/tools/system-status" color="green.500" fontWeight="medium">
            System Status
          </Link>
          <Link as={NextLink} href="/" color="gray.500" fontWeight="medium">
            ← Back to App
          </Link>
        </Flex>
      </Box>

      {children}
    </Container>
  );
} 