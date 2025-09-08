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
    <Box>
      {/* Navigation Bar */}
      <Box bg="bg.subtle" borderBottom="1px solid" borderColor="border" py={4} pr={12} mb={6}>
        <Container maxW="8xl">
          <Flex justify="space-between" align="center">
            <Box>
              <Heading size="md" color="fg" mb={1}>
                Development Tools
              </Heading>
              <Text color="fg.muted" fontSize="sm">
                Internal tools for testing & debugging
              </Text>
            </Box>

            <Flex gap={1} flexWrap="wrap">
              <Link
                as={NextLink}
                href="/tests/context"
                px={3}
                py={2}
                borderRadius="md"
                color="fg.muted"
                fontWeight="medium"
                fontSize="sm"
                _hover={{ bg: "bg.muted", color: "fg" }}
                transition="background-color 0.2s"
              >
                Context Tests
              </Link>

              <Box h="6" w="1px" bg="border" mx={2} alignSelf="center" />

              <Link
                as={NextLink}
                href="/"
                px={3}
                py={2}
                borderRadius="md"
                color="fg.subtle"
                fontWeight="medium"
                fontSize="sm"
                _hover={{ bg: "bg.muted", color: "fg" }}
                transition="background-color 0.2s"
              >
                ← App
              </Link>
            </Flex>
          </Flex>
        </Container>
      </Box>

      <Container maxW="8xl">
        {children}
      </Container>
    </Box>
  );
} 