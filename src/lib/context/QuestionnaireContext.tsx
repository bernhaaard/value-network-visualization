"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import type {
  QuestionnairePhase,
  SessionMetadata,
  QuestionnaireContextType,
  PersistenceStatus,
} from "../../types/session";
import type {
  PVQRRQuestionnaire,
  QuestionnaireResponses,
  QuestionnaireProgress,
  QuestionId,
  ResponseValue,
  AttentionCheckId,
} from "@/types/questionnaire";
import type { UserDemographics } from "@/types/demographics";
import { STORAGE_KEYS, QUESTIONNAIRE_CONFIG } from "@/types/constants";
import { isAttentionCheckId } from "@/types/questionnaire";
import { storage, isLocalStorageAvailable } from "@/lib/utils";
import { useDebouncedSave } from "@/hooks";
import { validateResponseCompleteness, calculateValueProfile, type ValueProfile } from "@/lib/schwartz";
import { apiCreateSession } from "@/lib/database/api-client";

/**
 * Calculates accurate progress excluding attention checks for user feedback.
 * Essential for showing meaningful completion percentage without confusing validation items.
 * @param responses - Current response collection
 * @returns Progress metrics focused on actual questions
 */
const calculateProgress = (responses: QuestionnaireResponses): QuestionnaireProgress => {
  const allResponseIds = Object.keys(responses);

  // Filter out attention checks for accurate progress tracking
  const actualQuestionResponses = allResponseIds.filter(
    id => !isAttentionCheckId(id as QuestionId | AttentionCheckId),
  );

  const completedQuestions = actualQuestionResponses.length;
  const totalQuestions = QUESTIONNAIRE_CONFIG.TOTAL_QUESTIONS;
  const percentComplete =
    totalQuestions > 0 ? Math.round((completedQuestions / totalQuestions) * 100) : 0;

  return {
    currentQuestionIndex: completedQuestions, // 0-based, actual questions only
    totalQuestions,
    completedQuestions,
    percentComplete,
  };
};

/**
 * Checks if session has exceeded configured timeout for data privacy.
 * @param metadata - Session metadata with timing information
 * @returns True if session should be cleared
 */
const isSessionExpired = (metadata: SessionMetadata): boolean => {
  const now = new Date();
  const hoursSinceLastUpdate = (now.getTime() - metadata.lastUpdated.getTime()) / (1000 * 60 * 60);
  return hoursSinceLastUpdate >= QUESTIONNAIRE_CONFIG.SESSION_TIMEOUT_HOURS;
};

// Create context
const QuestionnaireContext = createContext<QuestionnaireContextType | null>(null);

// Provider component
interface QuestionnaireProviderProps {
  children: React.ReactNode;
}

export const QuestionnaireProvider: React.FC<QuestionnaireProviderProps> = ({ children }) => {
  // Simple useState for each piece of state
  const [questionnaire, setQuestionnaire] = useState<PVQRRQuestionnaire | null>(null);
  const [metadata, setMetadata] = useState<SessionMetadata | null>(null);
  const [demographics, setDemographics] = useState<UserDemographics | null>(null);
  const [responses, setResponses] = useState<QuestionnaireResponses>({} as QuestionnaireResponses);
  const [valueProfile, setValueProfile] = useState<ValueProfile | null>(null);
  const [navigationIndex, setNavigationIndex] = useState<number>(0); // UI navigation separate from progress
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Computed state (derived from responses)
  const progress = calculateProgress(responses);

  // Simple persistence status
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [persistenceError, setPersistenceError] = useState<string | null>(null);


  // Clean debounced save implementation using hybrid approach
  const saveAllData = useCallback(() => {
    let allSuccess = true;

    // Save demographics if present
    if (demographics) {
      const success = storage.save(STORAGE_KEYS.DEMOGRAPHICS, demographics);
      if (!success) allSuccess = false;
    }

    // Save responses if any exist
    if (Object.keys(responses).length > 0) {
      const success = storage.save(STORAGE_KEYS.RESPONSES, responses);
      if (!success) allSuccess = false;
    }

    // Save value profile if calculated
    if (valueProfile) {
      const success = storage.save(STORAGE_KEYS.VALUE_PROFILE, valueProfile);
      if (!success) allSuccess = false;
    }

    // Save metadata with updated timestamp
    if (metadata) {
      const metadataToSave = { ...metadata, lastUpdated: new Date() };
      const success = storage.save(STORAGE_KEYS.SESSION_ID, metadataToSave);
      if (!success) allSuccess = false;
    }

    // Note: Progress is computed from responses, no need to save separately

    // Update persistence status
    if (allSuccess) {
      setLastSaved(new Date());
      setPersistenceError(null);
      if (process.env.NODE_ENV === "development") {
        console.log("🎯 All data saved to localStorage");
      }
    } else {
      setPersistenceError("Failed to save some data to localStorage");
      if (process.env.NODE_ENV === "development") {
        console.warn("🚨 Some data failed to save to localStorage");
      }
    }
  }, [demographics, responses, valueProfile, metadata]);

  // Use simple debounced save hook
  useDebouncedSave(saveAllData, [demographics, responses, valueProfile, metadata]);

  // Session restoration on mount (modular loading)
  useEffect(() => {
    const restoreSession = () => {
      // Load each piece separately
      const savedDemographics = storage.load(STORAGE_KEYS.DEMOGRAPHICS) as UserDemographics | null;
      const savedResponses = storage.load(STORAGE_KEYS.RESPONSES) as QuestionnaireResponses | null;
      const savedValueProfile = storage.load(STORAGE_KEYS.VALUE_PROFILE) as ValueProfile | null;
      const savedSession = storage.load(STORAGE_KEYS.SESSION_ID) as SessionMetadata | null;

      // Check if we have any saved data
      const hasData = savedDemographics || savedResponses || savedValueProfile || savedSession;
      if (!hasData) {
        if (process.env.NODE_ENV === "development") {
          console.log("🎯 No saved session found, starting fresh");
        }
        return;
      }
      if (savedResponses) {
        const responseCount = Object.keys(savedResponses).length;
        if (responseCount > 0 && responseCount <= 59) {
          setNavigationIndex(responseCount - 1);
        }
      }

      // Check session timeout if we have session metadata
      if (savedSession) {
        const sessionMetadata: SessionMetadata = {
          ...savedSession,
          startTime: new Date(savedSession.startTime),
          lastUpdated: new Date(savedSession.lastUpdated),
          questionnaireStartedAt: savedSession.questionnaireStartedAt ? new Date(savedSession.questionnaireStartedAt) : undefined,
          questionnaireCompletedAt: savedSession.questionnaireCompletedAt ? new Date(savedSession.questionnaireCompletedAt) : undefined
        };

        if (isSessionExpired(sessionMetadata)) {
          if (process.env.NODE_ENV === "development") {
            console.log("🎯 Session expired, clearing data");
          }
          storage.clearAll();
          return;
        }

        setMetadata(sessionMetadata);
      }

      // Restore other state pieces
      if (savedDemographics) {
        setDemographics(savedDemographics);
      }

      if (savedResponses) {
        setResponses(savedResponses);
      }

      if (savedValueProfile) {
        setValueProfile(savedValueProfile);
      }

      if (process.env.NODE_ENV === "development") {
        console.log("🎯 Session restored from modular localStorage", {
          demographics: !!savedDemographics,
          responses: Object.keys(savedResponses || {}).length,
          valueProfile: !!savedValueProfile,
          session: !!savedSession
        });
      }
    };

    restoreSession();
  }, []);

  // Load questionnaire data dynamically when entering questionnaire phase
  useEffect(() => {
    const loadQuestionnaireIfNeeded = async () => {
      // Only load if we're in questionnaire phase and don't have it loaded yet
      if (metadata?.currentPhase === "questionnaire" && !questionnaire) {
        try {
          setIsLoading(true);
          const { default: questionnaireData } = await import("@/lib/questionnaire/pvq-rr-data.json");
          setQuestionnaire(questionnaireData.questionnaire);

          if (process.env.NODE_ENV === "development") {
            console.log("🎯 Questionnaire data loaded dynamically");
          }
        } catch (error) {
          setError("Failed to load questionnaire data");
          console.error("Failed to load questionnaire:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadQuestionnaireIfNeeded();
  }, [metadata?.currentPhase, questionnaire]);

  // Convenience methods
  const startSession = (userDemographics: UserDemographics): void => {
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
    const now = new Date();

    setMetadata({
      sessionId,
      startTime: now,
      currentPhase: "instructions",
      lastUpdated: now,
      version: QUESTIONNAIRE_CONFIG.VERSION,
      language: QUESTIONNAIRE_CONFIG.DEFAULT_LANGUAGE
    });

    setDemographics(userDemographics);
    setNavigationIndex(0); // Reset to first question
    setError(null);

    if (process.env.NODE_ENV === "development") {
      console.log("🎯 Session started");
    }
  };

  const canAnswerQuestions = (): boolean => {
    return metadata?.currentPhase === "questionnaire";
  };

  /**
   * Ordered question and attention check IDs (memoized)
   */
  const orderedQuestionIds = useMemo(() => {
    if (!questionnaire) return [];
    return Object.keys(questionnaire.questions) as (QuestionId | AttentionCheckId)[];
  }, [questionnaire]);

  /**
   * Validates that questionnaire has correct number of items (59 total)
   * @returns true if valid count, false if incorrect count
   */
  const validateQuestionnaireLength = (): boolean => {
    return orderedQuestionIds.length === 59; // 57 questions + 2 attention checks
  };

  const answerQuestion = (questionId: QuestionId | AttentionCheckId, value: ResponseValue): void => {
    // Prevent answering outside questionnaire phase (UI should prevent this too)
    if (metadata?.currentPhase !== "questionnaire") {
      if (process.env.NODE_ENV === "development") {
        setError(`Development: Attempted to answer question outside questionnaire phase (current: ${metadata?.currentPhase})`);
      }
      return;
    }

    // Validate response value range (UI should constrain to 1-6)
    if (value < 1 || value > 6) {
      if (process.env.NODE_ENV === "development") {
        setError(`Development: Invalid response value ${value} for question ${questionId}. UI should constrain to 1-6.`);
      }
      return;
    }

    // Validate questionnaire is loaded (could indicate race condition)
    if (!questionnaire) {
      if (process.env.NODE_ENV === "development") {
        setError(`Development: Questionnaire not loaded when answering ${questionId}. Check initialization order.`);
      }
      return;
    }

    // Validate question exists in questionnaire (skip validation for attention checks)
    if (!isAttentionCheckId(questionId) && !questionnaire.questions[questionId as QuestionId]) {
      setError(`Invalid question ID: ${questionId}`);
      return;
    }

    setResponses(prev => ({
      ...prev,
      [questionId]: value
    }));

    setError(null);
  };

  const setPhase = (phase: QuestionnairePhase): void => {
    const now = new Date();
    setMetadata(prev => prev ? {
      ...prev,
      currentPhase: phase,
      lastUpdated: now,
      // Track when questionnaire phase starts for research timing
      ...(phase === "questionnaire" && !prev.questionnaireStartedAt && {
        questionnaireStartedAt: now
      })
    } : null);
  };

  const completeQuestionnaire = async (): Promise<void> => {
    const isResponsesComplete = validateResponseCompleteness(responses);

    if (!isResponsesComplete) {
      throw new Error("Cannot complete questionnaire: responses incomplete");
    }

    const now = new Date();
    const profile = calculateValueProfile(responses);
    setValueProfile(profile);

    // Save session data to database
    try {
      if (metadata && demographics) {
        await apiCreateSession({
          sessionMetadata: {
            ...metadata,
            questionnaireCompletedAt: now,
            lastUpdated: now,
          },
          demographics,
          valueProfile: profile,
          responses,
        });

        if (process.env.NODE_ENV === "development") {
          console.log("🎯 Session data saved to database");
        }
      }
    } catch (error) {
      console.error("Failed to save session to database:", error);
      setError("Failed to save your data. Please check your internet connection and try again.");
      // Don't continue - let user retry
      return;
    }

    // Only set completion phase after successful database save
    setMetadata(prev => prev ? {
      ...prev,
      currentPhase: "complete",
      questionnaireCompletedAt: now,
      lastUpdated: now
    } : null);
  };

  const calculateAndStoreValueProfile = (): void => {
    try {
      if (!validateResponseCompleteness(responses)) {
        throw new Error("Cannot calculate value profile: responses incomplete");
      }

      const profile = calculateValueProfile(responses);
      setValueProfile(profile);

      if (process.env.NODE_ENV === "development") {
        console.log("🎯 Value profile calculated and stored");
      }
    } catch (error) {
      setError(`Failed to calculate value profile: ${error instanceof Error ? error.message : 'Unknown error'}`);
      if (process.env.NODE_ENV === "development") {
        console.error("🚨 Value profile calculation failed:", error);
      }
    }
  };

  const resetSession = (): void => {
    setQuestionnaire(null);
    setMetadata(null);
    setDemographics(null);
    setResponses({} as QuestionnaireResponses);
    setValueProfile(null);
    setNavigationIndex(0);
    setError(null);
    storage.clearAll();

    if (process.env.NODE_ENV === "development") {
      console.log("🎯 Session reset - all modular data cleared");
    }
  };

  // Development helper
  const debugState = (): void => {
    if (process.env.NODE_ENV === "development") {
      console.group("🎯 Questionnaire State Debug");
      console.log("Demographics:", demographics);
      console.log("Responses:", Object.keys(responses).length, "answered");
      console.log("Progress:", progress);
      console.log("Phase:", metadata?.currentPhase);
      console.log("Last saved:", lastSaved);
      console.log("Error:", error);
      console.log("Modular storage status:", {
        demographics: !!storage.load(STORAGE_KEYS.DEMOGRAPHICS),
        responses: Object.keys(storage.load(STORAGE_KEYS.RESPONSES) as QuestionnaireResponses || {}).length,
        session: !!storage.load(STORAGE_KEYS.SESSION_ID)
        // Note: Progress computed from responses, not stored separately
      });
      console.groupEnd();
    }
  };

  // Simple persistence status object
  const persistence: PersistenceStatus = {
    isSupported: isLocalStorageAvailable(),
    lastSaveTime: lastSaved,
    lastError: persistenceError,
    pendingSave: false
  };

  // Context value (focused on questionnaire concerns)
  const contextValue: QuestionnaireContextType = {
    // State values
    questionnaire,
    metadata,
    demographics,
    responses,
    valueProfile,
    progress,
    navigationIndex,
    isLoading,
    error,
    persistence,

    // Simple state setters (React handles the types)
    setQuestionnaire,
    setMetadata,
    setDemographics,
    setResponses,
    setIsLoading,
    setError,

    // Convenience methods
    startSession,
    answerQuestion,
    goToQuestion: (index: number) => {
      // Validate index range
      const totalQuestions = QUESTIONNAIRE_CONFIG.TOTAL_QUESTIONS + QUESTIONNAIRE_CONFIG.ATTENTION_CHECK_COUNT;
      if (index < 0 || index >= totalQuestions) {
        setError(`Invalid question index: ${index}. Must be between 0 and ${totalQuestions - 1}.`);
        return;
      }
      setNavigationIndex(index);
      setError(null);
    },
    setPhase,
    completeQuestionnaire,
    calculateAndStoreValueProfile,
    resetSession,
    canAnswerQuestions,
    validateQuestionnaireLength,
    orderedQuestionIds,
    debugState,
    clearError: () => setError(null)
  };

  return (
    <QuestionnaireContext.Provider value={contextValue}>
      {children}
    </QuestionnaireContext.Provider>
  );
};

// Custom hook
export const useQuestionnaire = (): QuestionnaireContextType => {
  const context = useContext(QuestionnaireContext);

  if (!context) {
    throw new Error("useQuestionnaire must be used within a QuestionnaireProvider");
  }

  return context;
}; 