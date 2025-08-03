import React from "react";
import { Container, Box, Text, Button } from "@chakra-ui/react";

export interface ErrorDisplayProps {
  /** Error title/heading */
  title: string;
  /** Error description/message */
  message: string;
  /** Optional action button */
  action?: {
    label: string;
    onClick: () => void;
  };
  /** Container styling variant */
  variant?: "page" | "inline";
}

/**
 * Reusable error display component for consistent error UI
 */
export function ErrorDisplay({ title, message, action, variant = "page" }: ErrorDisplayProps) {
  const content = (
    <Box textAlign="center">
      <Text color="status.error" fontSize="lg" mb={4} fontWeight="medium">
        {title}
      </Text>
      <Text color="fg.muted" mb={action ? 4 : 0}>
        {message}
      </Text>
      {action && (
        <Button onClick={action.onClick} bg="interactive.primary" color="fg.inverted" _hover={{ bg: "interactive.hover" }}>
          {action.label}
        </Button>
      )}
    </Box>
  );

  if (variant === "inline") {
    return (
      <Box bg="bg.subtle" borderColor="border" borderWidth="1px" borderRadius="md" p={4}>
        {content}
      </Box>
    );
  }

  return (
    <Container maxW="4xl" py={8}>
      {content}
    </Container>
  );
} 