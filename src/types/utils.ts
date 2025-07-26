/**
 * Utility type generating consecutive numbers 1 to N for type-level validation
 */
export type Enumerate<N extends number, Counter extends number[] = []> = Counter["length"] extends N
  ? Counter[number]
  : Enumerate<N, [...Counter, Counter["length"]]>;

/**
 * Zero-pads single digit numbers for consistent ID formatting.
 * Ensures uniform question IDs (01, 02...57).
 */
export type PadSingleDigit<N extends number> = N extends 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9
  ? `0${N}`
  : `${N}`;