"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import type {
  StudyPhase,
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
import { storage } from "@/lib/utils";
import { useIsClient, useDebouncedSave } from "@/hooks";

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
 * Checks if session has exceeded 1-week timeout for data privacy.
 * @param metadata - Session metadata with timing information
 * @returns True if session should be cleared
 */
const isSessionExpired = (metadata: SessionMetadata): boolean => {
  const now = new Date();
  const hoursSinceLastUpdate = (now.getTime() - metadata.lastUpdated.getTime()) / (1000 * 60 * 60);
  return hoursSinceLastUpdate >= 168; // 7 days * 24 hours = 168 hours
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
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Computed state (derived from responses)
  const progress = calculateProgress(responses);

  // Simple persistence status
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [persistenceError, setPersistenceError] = useState<string | null>(null);
  const isClient = useIsClient();

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
  }, [demographics, responses, metadata]);

  // Use simple debounced save hook
  useDebouncedSave(saveAllData, [demographics, responses, metadata]);

  // Session restoration on mount (modular loading)
  useEffect(() => {
    const restoreSession = () => {
      // Load each piece separately
      const savedDemographics = storage.load(STORAGE_KEYS.DEMOGRAPHICS) as UserDemographics | null;
      const savedResponses = storage.load(STORAGE_KEYS.RESPONSES) as QuestionnaireResponses | null;
      const savedSession = storage.load(STORAGE_KEYS.SESSION_ID) as SessionMetadata | null;

      // Check if we have any saved data
      const hasData = savedDemographics || savedResponses || savedSession;
      if (!hasData) {
        if (process.env.NODE_ENV === "development") {
          console.log("🎯 No saved session found, starting fresh");
        }
        return;
      }

      // Check session timeout if we have session metadata
      if (savedSession) {
        const sessionMetadata: SessionMetadata = {
          ...savedSession,
          startTime: new Date(savedSession.startTime),
          lastUpdated: new Date(savedSession.lastUpdated),
          completedAt: savedSession.completedAt ? new Date(savedSession.completedAt) : undefined
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

      if (process.env.NODE_ENV === "development") {
        console.log("🎯 Session restored from modular localStorage", {
          demographics: !!savedDemographics,
          responses: Object.keys(savedResponses || {}).length,
          session: !!savedSession
        });
      }
    };

    restoreSession();
  }, []);

  // Convenience methods (synchronous, easy to understand)
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
    setError(null);

    if (process.env.NODE_ENV === "development") {
      console.log("🎯 Session started");
    }
  };

  const answerQuestion = (questionId: QuestionId, value: ResponseValue): void => {
    setResponses(prev => ({
      ...prev,
      [questionId]: value
    }));

    setError(null);
  };

  const setPhase = (phase: StudyPhase): void => {
    setMetadata(prev => prev ? {
      ...prev,
      currentPhase: phase,
      lastUpdated: new Date()
    } : null);
  };

  const completeQuestionnaire = (): void => {
    const now = new Date();
    setMetadata(prev => prev ? {
      ...prev,
      currentPhase: "complete",
      completedAt: now,
      lastUpdated: now
    } : null);
  };

  const resetSession = (): void => {
    setQuestionnaire(null);
    setMetadata(null);
    setDemographics(null);
    setResponses({} as QuestionnaireResponses);
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
    isSupported: isClient && !!window.localStorage,
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
    progress,
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
    goToQuestion: () => { }, // UI navigation only, no state change needed
    setPhase,
    completeQuestionnaire,
    resetSession,
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