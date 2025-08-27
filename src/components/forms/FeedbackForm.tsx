"use client";

import React from "react";
import {
  Box,
  Button,
  HStack,
  VStack,
  Field,
  Textarea,
  Heading,
  Text,
  Dialog,
} from "@chakra-ui/react";
import { useVisualization } from "@/lib/context";

interface FeedbackFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * Feedback Form Component - Collect user feedback about visualization preferences
 * Renders as a dialog overlay on top of the visualization
 */
export const FeedbackForm: React.FC<FeedbackFormProps> = ({ open, onOpenChange }) => {
  const { userFeedbackData, updateFeedback, nextPhase } = useVisualization();

  const canSubmit = userFeedbackData.feedback.preference && userFeedbackData.feedback.helpfulness;

  const handleGoBack = () => {
    onOpenChange(false);
  };

  const handleComplete = () => {
    nextPhase();
    onOpenChange(false);
  };

  const handleDialogOpenChange = (details: { open: boolean }) => {
    onOpenChange(details.open);
  };

  return (
    <Dialog.Root open={open} onOpenChange={handleDialogOpenChange} placement="center">
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content maxW="2xl" mx={4}>
          <Box
            bg="bg.subtle"
            borderRadius="xl"
            p={8}
            borderWidth="1px"
            borderColor="border.subtle"
          >
            {/* Header */}
            <Box mb={4} textAlign="center">
              <Heading size="xl" mb={4}>
                Your Feedback
              </Heading>
              <Text fontSize="lg" color="fg.muted">
                Please answer these questions about your experience with the visualizations.
              </Text>
            </Box>

            <VStack gap={6}>
              {/* Preference Question */}
              <Field.Root>
                <Field.Label fontWeight="medium">
                  Which visualization did you like better?
                </Field.Label>
                <HStack gap={3} mt={3} flexWrap="wrap">
                  {(["2d", "3d", "no_preference"] as const).map((option) => {
                    const isSelected = userFeedbackData.feedback.preference === option;
                    return (
                      <Button
                        key={option}
                        onClick={() => updateFeedback({ preference: option })}
                        variant={isSelected ? "solid" : "ghost"}
                        bg={isSelected ? "interactive.primary" : "bg.muted"}
                        color={isSelected ? "fg.inverted" : "fg.muted"}
                        borderColor={isSelected ? "bg.muted" : "border"}
                        _hover={{
                          borderColor: isSelected ? "bg.muted" : "interactive.primary"
                        }}
                        size="md"
                        cursor={isSelected ? "default" : "pointer"}
                      >
                        {option === "no_preference" ? "No Preference" : option.toUpperCase()}
                      </Button>
                    );
                  })}
                </HStack>
              </Field.Root>

              {/* Helpfulness Question */}
              <Field.Root>
                <Field.Label fontWeight="medium">
                  Which visualization was more helpful for understanding your values?
                </Field.Label>
                <HStack gap={3} mt={3} flexWrap="wrap">
                  {(["2d", "3d", "no_preference"] as const).map((option) => {
                    const isSelected = userFeedbackData.feedback.helpfulness === option;
                    return (
                      <Button
                        key={option}
                        onClick={() => updateFeedback({ helpfulness: option })}
                        variant={isSelected ? "solid" : "ghost"}
                        bg={isSelected ? "interactive.primary" : "bg.muted"}
                        color={isSelected ? "fg.inverted" : "fg.muted"}
                        borderColor={isSelected ? "bg.muted" : "border"}
                        _hover={{
                          borderColor: isSelected ? "bg.muted" : "interactive.primary"
                        }}
                        size="md"
                        cursor={isSelected ? "default" : "pointer"}
                      >
                        {option === "no_preference" ? "No Preference" : option.toUpperCase()}
                      </Button>
                    );
                  })}
                </HStack>
              </Field.Root>

              {/* Additional Thoughts */}
              <Field.Root>
                <Field.Label fontWeight="medium">
                  What did you think about the visualizations?
                </Field.Label>
                <Field.HelperText color="fg.muted">
                  I&apos;d love to hear your thoughts! Share any insights, comparisons, or suggestions about your experience.
                </Field.HelperText>
                <Textarea
                  value={userFeedbackData.feedback.additionalThoughts}
                  onChange={(e) => updateFeedback({ additionalThoughts: e.target.value })}
                  placeholder="Tell me about your experience using the app..."
                  rows={4}
                  mt={2}
                />
              </Field.Root>


              <HStack mt={4} textAlign="center">
                {/* Back to Exploration Button */}
                <Button
                  onClick={handleGoBack}
                  variant={"ghost"}
                  bg={"bg.muted"}
                  color={"fg.muted"}
                  borderColor={"border"}
                  _hover={{
                    borderColor: "interactive.primary"
                  }}
                  px={4}
                  size="lg"
                >
                  ← Go back to exploration
                </Button>

                {/* Submit Button */}
                <Button
                  onClick={handleComplete}
                  bg="interactive.primary"
                  color="fg.inverted"
                  borderColor={"bg.muted"}
                  _hover={{ bg: "interactive.hover" }}
                  size="lg"
                  disabled={!canSubmit}
                  px={8}
                >
                  Complete Study →
                </Button>
              </HStack>
            </VStack>
          </Box>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  );
};
