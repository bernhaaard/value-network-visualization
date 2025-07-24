import { useEffect, useRef } from "react";
import { debounce } from "lodash";

/**
 * Generic debounced save hook using useEffect + lodash.debounce
 * 
 * Clean, simple, and reusable across any context that needs debounced operations.
 * Perfect balance of simplicity and reusability for academic projects.
 * 
 * @param saveFunction - Function to call when data should be saved
 * @param dependencies - Values to watch for changes (will trigger debounced save)
 * @param delay - Debounce delay in milliseconds (default: 500)
 * 
 * @example
 * ```typescript
 * // In QuestionnaireContext
 * const saveAllData = useCallback(() => {
 *   if (demographics) storage.save('demo_key', demographics);
 *   if (responses) storage.save('resp_key', responses);
 *   setLastSaved(new Date());
 * }, [demographics, responses]);
 * 
 * useDebouncedSave(saveAllData, [demographics, responses, metadata]);
 * 
 * // In other contexts
 * const saveSettings = useCallback(() => {
 *   storage.save('user_settings', settings);
 * }, [settings]);
 * 
 * useDebouncedSave(saveSettings, [settings], 1000);
 * ```
 */
export function useDebouncedSave(
  saveFunction: () => void,
  dependencies: unknown[],
  delay = 500
): void {
  // Store latest function in ref to avoid stale closures
  const saveFunctionRef = useRef(saveFunction);
  saveFunctionRef.current = saveFunction;

  // Create stable debounced function once
  const debouncedSaveRef = useRef<(() => void) | null>(null);

  if (!debouncedSaveRef.current) {
    debouncedSaveRef.current = debounce(() => {
      saveFunctionRef.current();
    }, delay);
  }

  // Trigger debounced save when dependencies change
  useEffect(() => {
    if (debouncedSaveRef.current) {
      debouncedSaveRef.current();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies); // Intentionally using dependencies array directly

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debouncedSaveRef.current) {
        // @ts-expect-error - lodash debounce has cancel method
        debouncedSaveRef.current.cancel();
      }
    };
  }, []);
} 