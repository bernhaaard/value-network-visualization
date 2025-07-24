import { Box, Container, Heading, Text, Badge } from "@chakra-ui/react";

/**
 * Data Export Tool - Placeholder for exporting questionnaire data
 * Part of the debug infrastructure for thesis evaluation
 */
export default function DataExportPage() {
  return (
    <Container maxW="4xl" py={8}>
      <Box>
        <Heading size="lg" mb={4}>
          📊 Data Export
          <Badge ml={3} bg="green" color="white">Planned</Badge>
        </Heading>
        <Text color="gray.600" fontSize="lg">
          Export functionality for collected questionnaire data and session information.
        </Text>

        <Box mt={8} p={6} bg="green.50" borderRadius="md">
          <Text fontSize="sm" color="green.700">
            🎯 <strong>Implementation Plan:</strong> This tool will provide:
            <br />• CSV export of questionnaire responses
            <br />• JSON export of complete session data
            <br />• Anonymized data export for analysis
            <br />• Data validation and integrity checks
          </Text>
        </Box>
      </Box>
    </Container>
  );
} 