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
          Development Tools
        </Heading>
        <Text color="fg.muted" mb={4}>
          Internal tools for testing & debugging.
        </Text>

        <Flex gap={6} flexWrap="wrap">
          <Link as={NextLink} href="/tools" color="orange" fontWeight="medium">
            Debug Dashboard
          </Link>
          <Link as={NextLink} href="/tests/context" color="interactive.primary" fontWeight="medium">
            Context Tests
          </Link>
          <Link as={NextLink} href="/tests/components" color="interactive.primary" fontWeight="medium">
            Component Tests
          </Link>
          <Link as={NextLink} href="/tools/data-export" color="status.success" fontWeight="medium">
            Data Export
          </Link>
          <Link as={NextLink} href="/tools/system-status" color="status.success" fontWeight="medium">
            System Status
          </Link>
          <Link as={NextLink} href="/" color="fg.subtle" fontWeight="medium">
            ← Back to App
          </Link>
        </Flex>
      </Box>

      {children}
    </Container>
  );
} 