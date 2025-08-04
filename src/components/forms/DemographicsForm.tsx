"use client";

import React, { useState } from "react";
import {
  Box,
  Button,
  Container,
  Input,
  NativeSelect,
  Heading,
  Field,
  Fieldset,
  Text,
  Stack,
  ClientOnly,
  Skeleton
} from "@chakra-ui/react";
import { useQuestionnaire } from "@/lib/context";
import type { UserDemographics, DemographicsErrors } from "@/types/demographics";
import { EDUCATION_OPTIONS, COMMON_COUNTRIES } from "@/types/demographics";
import { QUESTIONNAIRE_CONFIG } from "@/types/constants";

/**
 * Demographics Form Component - Collects participant demographic information with validation.
 */
export const DemographicsForm: React.FC = () => {
  const { startSession, setPhase, error: contextError, clearError } = useQuestionnaire();

  // Form state - MUST be called before any conditional returns
  const [formData, setFormData] = useState<Partial<UserDemographics>>({
    age: undefined,
    gender: undefined,
    education: undefined,
    nationality: "",
  });

  const [errors, setErrors] = useState<DemographicsErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * Validates a single form field
   */
  const validateField = (field: keyof UserDemographics, value: unknown): string | undefined => {
    switch (field) {
      case "age":
        const age = Number(value);
        if (!value || isNaN(age)) return "Age is required and must be a number";
        if (age < QUESTIONNAIRE_CONFIG.MIN_AGE) return `Age must be at least ${QUESTIONNAIRE_CONFIG.MIN_AGE}`;
        if (age > QUESTIONNAIRE_CONFIG.MAX_AGE) return `Age must be at most ${QUESTIONNAIRE_CONFIG.MAX_AGE}`;
        return undefined;

      case "gender":
        if (!value) return "Gender selection is required";
        if (value !== "male" && value !== "female") return "Please select a valid gender option";
        return undefined;

      case "education":
        if (!value) return "Education level is required";
        const validEducation = EDUCATION_OPTIONS.some(opt => opt.value === value);
        if (!validEducation) return "Please select a valid education level";
        return undefined;

      case "nationality":
        const nationality = String(value || "").trim();
        if (!nationality) return "Nationality is required";
        if (nationality.length < 2) return "Nationality must be at least 2 characters";
        if (nationality.length > 50) return "Nationality must be at most 50 characters";
        if (nationality !== "other" && !/^[a-zA-Z\s\-']+$/.test(nationality)) {
          return "Nationality contains invalid characters";
        }
        return undefined;

      default:
        return undefined;
    }
  };

  /**
   * Validates the entire form
   */
  const validateForm = (): DemographicsErrors => {
    const newErrors: DemographicsErrors = {};
    newErrors.age = validateField("age", formData.age);
    newErrors.gender = validateField("gender", formData.gender);
    newErrors.education = validateField("education", formData.education);
    newErrors.nationality = validateField("nationality", formData.nationality);
    return newErrors;
  };

  /**
   * Handles input field changes with validation
   */
  const handleInputChange = (field: keyof UserDemographics, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    // Clear any existing error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }

    // Clear context errors
    if (contextError) {
      clearError();
    }
  };

  /**
   * Handles form submission
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    const formErrors = validateForm();
    const hasErrors = Object.values(formErrors).some(error => error);

    if (hasErrors) {
      setErrors(formErrors);
      return;
    }

    // Create complete demographics object
    const demographics: UserDemographics = {
      age: formData.age!,
      gender: formData.gender!,
      education: formData.education!,
      nationality: formData.nationality!.trim(),
    };

    try {
      setIsSubmitting(true);

      // Start session with demographics
      startSession(demographics);

      // Navigate to instructions phase
      setPhase("instructions");

      console.log("🎯 Demographics submitted successfully", demographics);

    } catch (error) {
      console.error("Failed to submit demographics:", error);
      setErrors({
        nationality: "Failed to save demographics. Please try again."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container maxW="2xl" py={8}>
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
            Participant Information
          </Heading>
          <Text fontSize="lg" color="fg.muted">
            Please provide some basic demographic information.
          </Text>
        </Box>
        {/* Privacy Notice */}
        <Box borderLeftWidth="4px" borderLeftColor="orange.dark" mb={4} p={2} shadow="sm">
          <Text fontSize="sm" color="fg.muted" textAlign="left">
            All data is anonymized and used solely for academic analysis.
          </Text>
        </Box>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <Fieldset.Root>
            <ClientOnly fallback={
              <Fieldset.Content>
                <Stack gap={6} align="stretch">
                  {/* Age Field Skeleton */}
                  <Stack gap={2}>
                    <Skeleton height="18px" width="60px" bg="bg.muted" />
                    <Box
                      height="40px"
                      bg="bg.subtle"
                      borderWidth="1px"
                      borderColor="border"
                      borderRadius="md"
                      px={3}
                      display="flex"
                      alignItems="center"
                    >
                      <Skeleton height="16px" width="120px" />
                    </Box>
                    <Skeleton height="14px" width="300px" bg="bg.muted" />
                  </Stack>

                  {/* Gender Field Skeleton */}
                  <Stack gap={2}>
                    <Skeleton height="18px" width="80px" bg="bg.muted" />
                    <Box
                      height="40px"
                      bg="bg.subtle"
                      borderWidth="1px"
                      borderColor="border"
                      borderRadius="md"
                      px={3}
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <Skeleton height="16px" width="100px" />
                      <Skeleton height="12px" width="12px" />
                    </Box>
                    <Skeleton height="14px" width="350px" bg="bg.muted" />
                  </Stack>

                  {/* Education Field Skeleton */}
                  <Stack gap={2}>
                    <Skeleton height="18px" width="120px" bg="bg.muted" />
                    <Box
                      height="40px"
                      bg="bg.subtle"
                      borderWidth="1px"
                      borderColor="border"
                      borderRadius="md"
                      px={3}
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <Skeleton height="16px" width="140px" />
                      <Skeleton height="12px" width="12px" />
                    </Box>
                    <Skeleton height="14px" width="280px" bg="bg.muted" />
                  </Stack>

                  {/* Nationality Field Skeleton */}
                  <Stack gap={2}>
                    <Skeleton height="18px" width="100px" bg="bg.muted" />
                    <Box
                      height="40px"
                      bg="bg.subtle"
                      borderWidth="1px"
                      borderColor="border"
                      borderRadius="md"
                      px={3}
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <Skeleton height="16px" width="160px" />
                      <Skeleton height="12px" width="12px" />
                    </Box>
                    <Skeleton height="14px" width="320px" bg="bg.muted" />
                  </Stack>
                </Stack>
              </Fieldset.Content>
            }>
              <Fieldset.Content>
                <Stack gap={6} align="stretch">

                  {/* Age Field */}
                  <Field.Root invalid={!!errors.age}>
                    <Field.Label>
                      Age
                      <Field.RequiredIndicator />
                    </Field.Label>
                    <Input
                      type="number"
                      min={QUESTIONNAIRE_CONFIG.MIN_AGE}
                      max={QUESTIONNAIRE_CONFIG.MAX_AGE}
                      value={formData.age || ""}
                      onChange={(e) => handleInputChange("age", parseInt(e.target.value) || "")}
                      placeholder={`Age (${QUESTIONNAIRE_CONFIG.MIN_AGE}-${QUESTIONNAIRE_CONFIG.MAX_AGE})`}
                    />
                    <Field.HelperText>
                      Must be between {QUESTIONNAIRE_CONFIG.MIN_AGE} and {QUESTIONNAIRE_CONFIG.MAX_AGE} years old
                    </Field.HelperText>
                    <Field.ErrorText color="status.error">{errors.age}</Field.ErrorText>
                  </Field.Root>

                  {/* Gender Field */}
                  <Field.Root invalid={!!errors.gender}>
                    <Field.Label>
                      Gender
                      <Field.RequiredIndicator />
                    </Field.Label>
                    <NativeSelect.Root>
                      <NativeSelect.Field
                        value={formData.gender || ""}
                        onChange={(e) => handleInputChange("gender", e.target.value)}
                      >
                        <option value="">Select gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                      </NativeSelect.Field>
                      <NativeSelect.Indicator />
                    </NativeSelect.Root>
                    <Field.HelperText>
                      Determines which version of the questionnaire questions you&apos;ll see
                    </Field.HelperText>
                    <Field.ErrorText color="status.error">{errors.gender}</Field.ErrorText>
                  </Field.Root>

                  {/* Education Field */}
                  <Field.Root invalid={!!errors.education}>
                    <Field.Label>
                      Education Level
                      <Field.RequiredIndicator />
                    </Field.Label>
                    <NativeSelect.Root>
                      <NativeSelect.Field
                        value={formData.education || ""}
                        onChange={(e) => handleInputChange("education", e.target.value)}
                      >
                        <option value="">Select education level</option>
                        {EDUCATION_OPTIONS.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </NativeSelect.Field>
                      <NativeSelect.Indicator />
                    </NativeSelect.Root>
                    <Field.HelperText>
                      Select your highest completed level of education
                    </Field.HelperText>
                    <Field.ErrorText color="status.error">{errors.education}</Field.ErrorText>
                  </Field.Root>

                  {/* Nationality Field */}
                  <Field.Root invalid={!!errors.nationality}>
                    <Field.Label>
                      Nationality
                      <Field.RequiredIndicator />
                    </Field.Label>
                    <NativeSelect.Root>
                      <NativeSelect.Field
                        value={formData.nationality || ""}
                        onChange={(e) => handleInputChange("nationality", e.target.value)}
                      >
                        <option value="">Select your nationality</option>
                        {COMMON_COUNTRIES.map((country) => (
                          <option key={country} value={country}>
                            {country}
                          </option>
                        ))}
                        <option value="other">Other (please specify in feedback)</option>
                      </NativeSelect.Field>
                      <NativeSelect.Indicator />
                    </NativeSelect.Root>
                    <Field.HelperText>
                      Select your nationality from the list. Choose &ldquo;Other&rdquo; if not listed.
                    </Field.HelperText>
                    <Field.ErrorText color="status.error">{errors.nationality}</Field.ErrorText>
                  </Field.Root>

                  {/* Context Error Display */}
                  {contextError && (
                    <Box p={4} bg="bg.muted" borderColor="status.error" borderWidth="1px" borderRadius="md">
                      <Text color="status.error" fontSize="sm">
                        {contextError}
                      </Text>
                    </Box>
                  )}

                </Stack>
              </Fieldset.Content>
            </ClientOnly>
          </Fieldset.Root>

          {/* Submit Button */}
          <Box mt={8} textAlign="center">
            <Button
              type="submit"
              bg="interactive.primary"
              color="fg.inverted"
              _hover={{ bg: "interactive.hover" }}
              size="lg"
              loading={isSubmitting}
              disabled={isSubmitting}
              px={8}
            >
              {isSubmitting ? "Saving..." : "Continue to Instructions"}
            </Button>
          </Box>
        </form>
      </Box>
    </Container>
  );
};