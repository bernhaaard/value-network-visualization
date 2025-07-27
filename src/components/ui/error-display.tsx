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
      <Text color="red.500" fontSize="lg" mb={4} fontWeight="medium">
        {title}
      </Text>
      <Text color="gray.600" mb={action ? 4 : 0}>
        {message}
      </Text>
      {action && (
        <Button onClick={action.onClick} colorScheme="blue">
          {action.label}
        </Button>
      )}
    </Box>
  );

  if (variant === "inline") {
    return (
      <Box bg="red.50" borderColor="red.200" borderWidth="1px" rounded="md" p={4}>
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