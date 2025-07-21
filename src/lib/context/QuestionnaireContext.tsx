"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { debounce } from "lodash";
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
} from "../../types/questionnaire";
import type { UserDemographics } from "../../types/demographics";
import { STORAGE_KEYS, QUESTIONNAIRE_CONFIG } from "../../types/constants";
import { isAttentionCheckId } from "../../types/questionnaire";

/**
 * Modular localStorage utilities for independent data persistence.
 * Prevents data loss and enables selective loading/saving of different concerns.
 */
const storage = {
  /**
   * Saves data to localStorage with error handling.
   * @param key - Storage key identifier
   * @param data - Data to serialize and store
   * @returns Success status for error handling
   */
  save: (key: string, data: unknown): boolean => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
      return true;
    } catch (error) {
      console.warn(`localStorage save failed for ${key}:`, error);
      return false;
    }
  },

  /**
   * Loads data from localStorage with error handling.
   * @param key - Storage key identifier
   * @returns Parsed data or null if not found/error
   */
  load: (key: string): unknown => {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.warn(`localStorage load failed for ${key}:`, error);
      return null;
    }
  },

  /**
   * Removes data from localStorage with error handling.
   * @param key - Storage key identifier
   */
  remove: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.warn(`localStorage remove failed for ${key}:`, error);
    }
  },

  // Modular save functions for each concern
  /** Persists user demographic data independently */
  saveDemographics: (demographics: UserDemographics): boolean => {
    return storage.save(STORAGE_KEYS.DEMOGRAPHICS, demographics);
  },

  /** Persists question responses independently */
  saveResponses: (responses: QuestionnaireResponses): boolean => {
    return storage.save(STORAGE_KEYS.RESPONSES, responses);
  },

  /** Persists progress tracking data independently */
  saveProgress: (progress: QuestionnaireProgress): boolean => {
    return storage.save(STORAGE_KEYS.PROGRESS, progress);
  },

  /** Persists session metadata independently */
  saveSession: (metadata: SessionMetadata): boolean => {
    return storage.save(STORAGE_KEYS.SESSION_ID, metadata);
  },

  // Modular load functions
  /** Loads user demographic data with type safety */
  loadDemographics: (): UserDemographics | null => {
    return storage.load(STORAGE_KEYS.DEMOGRAPHICS) as UserDemographics | null;
  },

  /** Loads question responses with type safety */
  loadResponses: (): QuestionnaireResponses | null => {
    return storage.load(STORAGE_KEYS.RESPONSES) as QuestionnaireResponses | null;
  },

  /** Loads progress tracking data with type safety */
  loadProgress: (): QuestionnaireProgress | null => {
    return storage.load(STORAGE_KEYS.PROGRESS) as QuestionnaireProgress | null;
  },

  /** Loads session metadata with type safety */
  loadSession: (): SessionMetadata | null => {
    return storage.load(STORAGE_KEYS.SESSION_ID) as SessionMetadata | null;
  },

  /** Removes all questionnaire-related data for clean reset */
  clearAllQuestionnaire: (): void => {
    storage.remove(STORAGE_KEYS.DEMOGRAPHICS);
    storage.remove(STORAGE_KEYS.RESPONSES);
    storage.remove(STORAGE_KEYS.PROGRESS);
    storage.remove(STORAGE_KEYS.SESSION_ID);
  }
};

/**
 * Calculates accurate progress excluding attention checks for user feedback.
 * Essential for showing meaningful completion percentage without confusing validation items.
 * @param responses - Current response collection
 * @returns Progress metrics focused on actual questions
 */
const calculateProgress = (responses: QuestionnaireResponses): QuestionnaireProgress => {
  const allResponseIds = Object.keys(responses);

  // Filter out attention checks for accurate progress tracking
  const actualQuestionResponses = allResponseIds.filter(id => !isAttentionCheckId(id as QuestionId | AttentionCheckId));

  const completedQuestions = actualQuestionResponses.length;
  const totalQuestions = QUESTIONNAIRE_CONFIG.TOTAL_QUESTIONS;
  const percentComplete = totalQuestions > 0 ? Math.round((completedQuestions / totalQuestions) * 100) : 0;

  return {
    currentQuestionIndex: completedQuestions, // 0-based, actual questions only
    totalQuestions,
    completedQuestions,
    percentComplete
  };
};

/**
 * Checks if session has exceeded 24-hour timeout for data privacy.
 * @param metadata - Session metadata with timing information
 * @returns True if session should be cleared
 */
const isSessionExpired = (metadata: SessionMetadata): boolean => {
  const now = new Date();
  const hoursSinceLastUpdate = (now.getTime() - metadata.lastUpdated.getTime()) / (1000 * 60 * 60);
  return hoursSinceLastUpdate >= 24;
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

  // Debounced modular save function
  const debouncedSave = debounce(() => {
    let allSuccess = true;

    // Save each piece modularly
    if (demographics) {
      const success = storage.saveDemographics(demographics);
      if (!success) allSuccess = false;
    }

    if (Object.keys(responses).length > 0) {
      const success = storage.saveResponses(responses);
      if (!success) allSuccess = false;
    }

    if (progress.completedQuestions > 0) {
      const success = storage.saveProgress(progress);
      if (!success) allSuccess = false;
    }

    if (metadata) {
      // Update lastUpdated before saving
      const updatedMetadata = { ...metadata, lastUpdated: new Date() };
      setMetadata(updatedMetadata);
      const success = storage.saveSession(updatedMetadata);
      if (!success) allSuccess = false;
    }

    const now = new Date();
    if (allSuccess) {
      setLastSaved(now);
      setPersistenceError(null);
      if (process.env.NODE_ENV === "development") {
        console.log("🎯 Modular state saved to localStorage");
      }
    } else {
      setPersistenceError("Failed to save some data to localStorage");
    }
  }, 500);

  // Auto-save effect (triggers on state changes)
  useEffect(() => {
    if (demographics || Object.keys(responses).length > 0 || metadata) {
      debouncedSave();
    }
  }, [demographics, responses, metadata, debouncedSave]);

  // Session restoration on mount (modular loading)
  useEffect(() => {
    const restoreSession = () => {
      // Load each piece separately
      const savedDemographics = storage.loadDemographics();
      const savedResponses = storage.loadResponses();
      const savedSession = storage.loadSession();

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
          storage.clearAllQuestionnaire();
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
    storage.clearAllQuestionnaire();

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
        demographics: !!storage.loadDemographics(),
        responses: Object.keys(storage.loadResponses() || {}).length,
        progress: !!storage.loadProgress(),
        session: !!storage.loadSession()
      });
      console.groupEnd();
    }
  };

  // Simple persistence status object
  const persistence: PersistenceStatus = {
    isSupported: !!window.localStorage,
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