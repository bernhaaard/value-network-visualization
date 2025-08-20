import { Box, Container, Heading, Text, Stack, Flex } from "@chakra-ui/react";
import Link from "next/link";

/**
 * Debug Dashboard - Central hub for all development and evaluation tools.
 * Provides organized access to testing infrastructure for thesis evaluation.
 */
export default function DebugPage() {
  const tools = [
    {
      title: "Context Tests",
      description: "Verify QuestionnaireProvider functionality and localStorage persistence",
      href: "/tests/context",
      category: "Testing",
      status: "Active"
    },
    {
      title: "Component Tests",
      description: "Test individual UI components and visualization elements",
      href: "/tests/components",
      category: "Testing",
      status: "Planned"
    },
    {
      title: "System Status",
      description: "Monitor application health and performance",
      href: "/tools/system-status",
      category: "Tools",
      status: "Future"
    }
  ];

  return (
    <Container maxW="4xl" py={8}>
      <Stack gap={6}>
        {/* Header */}
        <Box bg="bg.subtle" borderColor="border.subtle" borderWidth="1px" borderRadius="md" p={6}>
          <Heading size="lg" color="fg" mb={3}>
            Development & Evaluation Dashboard
          </Heading>
          <Text color="fg.muted" fontSize="lg">
            Essential development tools for testing and debugging the questionnaire system.
          </Text>
        </Box>

        {/* Tools Grid */}
        {tools.map((tool) => (
          <Link key={tool.href} href={tool.href}>
            <Box
              borderColor="border.subtle"
              borderWidth="1px"
              borderRadius="md"
              p={6}
              _hover={{
                borderColor: "border.accent",
                bg: "bg.subtle",
                transform: "translateY(-1px)",
                transition: "all 0.2s"
              }}
              transition="all 0.2s"
              cursor="pointer"
            >
              <Flex justify="space-between" align="start" mb={3}>
                <Box>
                  <Text
                    fontSize="xs"
                    fontWeight="medium"
                    color="fg.subtle"
                    textTransform="uppercase"
                    letterSpacing="wider"
                    mb={2}
                  >
                    {tool.category}
                  </Text>
                  <Heading size="md" color="fg" mb={2}>
                    {tool.title}
                  </Heading>
                </Box>
                <Box
                  px={2}
                  py={1}
                  bg={tool.status === "Active" ? "status.success" :
                    tool.status === "Planned" ? "status.warning" : "bg.muted"}
                  color={tool.status === "Active" ? "fg.inverted" :
                    tool.status === "Planned" ? "fg.inverted" : "fg"}
                  borderRadius="sm"
                  fontSize="xs"
                  fontWeight="medium"
                >
                  {tool.status}
                </Box>
              </Flex>
              <Text color="fg.muted" lineHeight="tall">
                {tool.description}
              </Text>
            </Box>
          </Link>
        ))}
      </Stack>
    </Container>
  );
}