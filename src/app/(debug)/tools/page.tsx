import { Box, Container, Heading, Text, Grid } from "@chakra-ui/react";
import { Card } from "@chakra-ui/react";
import NextLink from "next/link";

/**
 * Debug Dashboard - Central hub for all development and evaluation tools.
 * Provides organized access to testing infrastructure for thesis evaluation.
 */
export default function DebugPage() {
  const testingTools = [
    {
      title: "Context Tests",
      description: "Verify QuestionnaireProvider functionality, state management, and localStorage persistence",
      href: "/tests/context",
      category: "Core Testing"
    },
    {
      title: "Component Tests",
      description: "Test individual UI components, forms, and visualization elements",
      href: "/tests/components",
      category: "Core Testing"
    }
  ];

  const developmentTools = [
    {
      title: "Data Export",
      description: "Export collected questionnaire data and session information",
      href: "/tools/data-export",
      category: "Data Management"
    },
    {
      title: "System Status",
      description: "Monitor application health, performance, and error tracking",
      href: "/tools/system-status",
      category: "Monitoring"
    }
  ];

  return (
    <Container maxW="6xl" py={8}>
      <Box mb={8}>
        <Heading size="xl" mb={4}>
          🔧 Development & Evaluation Dashboard
        </Heading>
        <Text fontSize="lg" color="gray.600">
          Comprehensive testing and debugging infrastructure for thesis evaluation and development.
        </Text>
      </Box>

      {/* Testing Tools Section */}
      <Box mb={10}>
        <Heading size="lg" mb={6} color="blue.600">
          Testing Infrastructure
        </Heading>
        <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={6}>
          {testingTools.map((tool) => (
            <NextLink key={tool.href} href={tool.href}>
              <Card.Root _hover={{ transform: "translateY(-2px)", shadow: "lg" }}>
                <Card.Body p={6}>
                  <Text fontSize="sm" fontWeight="medium" color="blue.500" mb={2}>
                    {tool.category}
                  </Text>
                  <Heading size="md" mb={3}>
                    {tool.title}
                  </Heading>
                  <Text color="gray.600">
                    {tool.description}
                  </Text>
                </Card.Body>
              </Card.Root>
            </NextLink>
          ))}
        </Grid>
      </Box>

      {/* Development Tools Section */}
      <Box>
        <Heading size="lg" mb={6} color="green.600">
          Development Tools
        </Heading>
        <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={6}>
          {developmentTools.map((tool) => (
            <NextLink key={tool.href} href={tool.href}>
              <Card.Root _hover={{ transform: "translateY(-2px)", shadow: "lg" }}>
                <Card.Body p={6}>
                  <Text fontSize="sm" fontWeight="medium" color="green.500" mb={2}>
                    {tool.category}
                  </Text>
                  <Heading size="md" mb={3}>
                    {tool.title}
                  </Heading>
                  <Text color="gray.600">
                    {tool.description}
                  </Text>
                </Card.Body>
              </Card.Root>
            </NextLink>
          ))}
        </Grid>
      </Box>

      <Box mt={12} p={6} bg="gray.50" borderRadius="md">
        <Text fontSize="sm" color="gray.600" textAlign="center">
          🎓 These tools demonstrate comprehensive development practices and enable thorough thesis evaluation.
          <br />
          All functionality is designed for academic assessment and debugging purposes.
        </Text>
      </Box>
    </Container>
  );
} 