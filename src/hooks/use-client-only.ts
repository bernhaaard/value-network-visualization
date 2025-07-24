import { useState, useEffect } from "react";

/**
 * Hook to safely handle client-only values that differ between server and client.
 * Prevents hydration mismatches by returning false during SSR and the actual value after hydration.
 */
export function useClientOnly<T>(clientValue: T, serverValue: T): T {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient ? clientValue : serverValue;
}

/**
 * Hook to check if code is running on the client side.
 * Prevents hydration mismatches for client-only functionality.
 */
export function useIsClient(): boolean {
  return useClientOnly(true, false);
}
