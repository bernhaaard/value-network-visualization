"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import type {
  VisualizationMode,
  VisualizationPhase,
  UserFeedbackData,
  UserFeedback,
  ModeSwap,
  VisualizationContextType,
} from "@/types/visualization";
import type { ValueProfile } from "@/lib/schwartz";
import { STORAGE_KEYS } from "@/types/constants";
import { storage } from "@/lib/utils";
import { useDebouncedSave } from "@/hooks";

/**
 * Creates initial user feedback data structure
 */
const createInitialUserFeedbackData = (): UserFeedbackData => ({
  modeSwaps: [],
  feedback: {
    preference: null,
    helpfulness: null,
    additionalThoughts: "",
  },
  startedAt: new Date(),
});

// Create context
const VisualizationContext = createContext<VisualizationContextType | null>(null);

// Provider component
interface VisualizationProviderProps {
  children: React.ReactNode;
}

export const VisualizationProvider: React.FC<VisualizationProviderProps> = ({ children }) => {
  // Persistent state (saved to localStorage)
  const [valueProfile, setValueProfile] = useState<ValueProfile | null>(null);
  const [userFeedbackData, setUserFeedbackData] = useState<UserFeedbackData>(createInitialUserFeedbackData);

  // UI state (non-persistent, resets on reload)
  const [currentMode, setCurrentMode] = useState<VisualizationMode>("2d");
  const [currentPhase, setCurrentPhase] = useState<VisualizationPhase>("exploration");

  // Save only persistent data (feedback needs debouncing for text input)
  const saveUserFeedbackData = useCallback(() => {
    const success = storage.save(STORAGE_KEYS.FEEDBACK_DATA, userFeedbackData);
    if (process.env.NODE_ENV === "development") {
      if (success) {
        console.log("🎯 User feedback data saved");
      } else {
        console.warn("🚨 Failed to save user feedback data");
      }
    }
  }, [userFeedbackData]);

  // Debounce saving for feedback text (user typing)
  useDebouncedSave(saveUserFeedbackData, [userFeedbackData], 500);

  // Load persistent data on mount
  useEffect(() => {
    const restoreData = () => {
      // Load value profile (calculated in QuestionnaireContext)
      const savedProfile = storage.load(STORAGE_KEYS.VALUE_PROFILE) as ValueProfile | null;
      if (savedProfile) {
        setValueProfile(savedProfile);
      }

      // Load user feedback data
      const savedUserFeedbackData = storage.load(STORAGE_KEYS.FEEDBACK_DATA) as UserFeedbackData | null;
      if (savedUserFeedbackData) {
        // Restore dates from JSON
        const restoredData: UserFeedbackData = {
          ...savedUserFeedbackData,
          startedAt: new Date(savedUserFeedbackData.startedAt),
          completedAt: savedUserFeedbackData.completedAt ? new Date(savedUserFeedbackData.completedAt) : undefined,
          modeSwaps: savedUserFeedbackData.modeSwaps.map(swap => ({
            ...swap,
            timestamp: new Date(swap.timestamp),
          })),
        };
        setUserFeedbackData(restoredData);
      }

      if (process.env.NODE_ENV === "development") {
        console.log("🎯 Visualization data restored", {
          valueProfile: !!savedProfile,
          userFeedbackData: !!savedUserFeedbackData,
        });
      }
    };

    restoreData();
  }, []);



  // Actions
  const switchMode = useCallback((mode: VisualizationMode): void => {
    setCurrentMode(mode);

    // Track mode swap for exploration time analysis
    const modeSwap: ModeSwap = {
      mode,
      timestamp: new Date(),
    };

    setUserFeedbackData(prev => ({
      ...prev,
      modeSwaps: [...prev.modeSwaps, modeSwap],
    }));

    if (process.env.NODE_ENV === "development") {
      console.log(`🎯 Mode switched to ${mode}`);
    }
  }, []);

  const updateFeedback = useCallback((feedback: Partial<UserFeedback>): void => {
    setUserFeedbackData(prev => ({
      ...prev,
      feedback: { ...prev.feedback, ...feedback },
    }));
  }, []);

  const nextPhase = useCallback((): void => {
    if (currentPhase === "exploration") {
      setCurrentPhase("feedback");
    } else if (currentPhase === "feedback") {
      setCurrentPhase("complete");
      setUserFeedbackData(prev => ({
        ...prev,
        completedAt: new Date(),
      }));
    }

    if (process.env.NODE_ENV === "development") {
      console.log(`🎯 Phase transition to ${currentPhase === "exploration" ? "feedback" : "complete"}`);
    }
  }, [currentPhase]);

  const initializeWithProfile = useCallback((profile: ValueProfile): void => {
    setValueProfile(profile);

    if (process.env.NODE_ENV === "development") {
      console.log("🎯 Visualization initialized with value profile");
    }
  }, []);

  const resetVisualization = useCallback((): void => {
    setValueProfile(null);
    setUserFeedbackData(createInitialUserFeedbackData());
    setCurrentMode("2d");
    setCurrentPhase("exploration");

    // Clear localStorage
    storage.remove(STORAGE_KEYS.VALUE_PROFILE);
    storage.remove(STORAGE_KEYS.FEEDBACK_DATA);

    if (process.env.NODE_ENV === "development") {
      console.log("🎯 Visualization reset");
    }
  }, []);

  // Development helper
  const debugState = useCallback((): void => {
    if (process.env.NODE_ENV === "development") {
      console.group("🎯 Visualization State Debug");
      console.log("Value Profile:", !!valueProfile);
      console.log("Current Mode:", currentMode);
      console.log("Current Phase:", currentPhase);
      console.log("Mode Swaps:", userFeedbackData.modeSwaps.length);
      console.log("Feedback:", userFeedbackData.feedback);
      console.groupEnd();
    }
  }, [valueProfile, currentMode, currentPhase, userFeedbackData]);

  // Context value
  const contextValue: VisualizationContextType = {
    // Persistent state
    valueProfile,
    userFeedbackData,

    // UI state
    currentMode,
    currentPhase,

    // Actions
    switchMode,
    updateFeedback,
    nextPhase,
    initializeWithProfile,
    resetVisualization,
    debugState,
  };

  return (
    <VisualizationContext.Provider value={contextValue}>
      {children}
    </VisualizationContext.Provider>
  );
};

// Custom hook
export const useVisualization = (): VisualizationContextType => {
  const context = useContext(VisualizationContext);

  if (!context) {
    throw new Error("useVisualization must be used within a VisualizationProvider");
  }

  return context;
};

