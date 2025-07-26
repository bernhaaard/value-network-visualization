// Demographics Type Definitions

/**
 * Gender options for displaying appropriate question variants
 */
export type Gender = "male" | "female";

/**
 * Education level options with user-friendly labels.
 * Runtime accessible array that maintains type safety with EducationLevel.
 */
export const EDUCATION_OPTIONS = [
  { value: "no_formal_education", label: "No formal education" },
  { value: "primary_education", label: "Primary education" },
  { value: "lower_secondary", label: "Lower secondary school" },
  { value: "upper_secondary", label: "Upper secondary school" },
  { value: "bachelor_degree", label: "Bachelor's degree" },
  { value: "master_degree", label: "Master's degree" },
  { value: "doctoral_degree", label: "Doctoral degree" },
  { value: "professional_degree", label: "Professional degree" },
  { value: "prefer_not_to_say", label: "Prefer not to say" },
] as const;

/**
 * Education levels derived from EDUCATION_OPTIONS.
 * Used for type safety in the questionnaire.
 */
export type EducationLevel = (typeof EDUCATION_OPTIONS)[number]["value"];

/**
 * Validation errors for demographics form fields
 */
export interface DemographicsErrors {
  age?: string;
  gender?: string;
  education?: string;
  nationality?: string;
}

/**
 * Most common countries/nationalities for academic research participants.
 * Covers major research populations globally for thesis data collection.
 */
export const COMMON_COUNTRIES = [
  "Austrian",
  "German",
  "Swiss",
  "Italian",
  "French",
  "Spanish",
  "Portuguese",
  "Dutch",
  "Belgian",
  "British",
  "Irish",
  "Scottish",
  "Welsh",
  "English",
  "Swedish",
  "Norwegian",
  "Danish",
  "Finnish",
  "Polish",
  "Czech",
  "Hungarian",
  "Romanian",
  "Bulgarian",
  "Croatian",
  "Serbian",
  "Slovenian",
  "American",
  "Canadian",
  "Mexican",
  "Brazilian",
  "Argentinian",
  "Chilean",
  "Colombian",
  "Australian",
  "New Zealander",
  "South African",
  "Egyptian",
  "Moroccan",
  "Nigerian",
  "Kenyan",
  "Indian",
  "Chinese",
  "Japanese",
  "Korean",
  "Thai",
  "Vietnamese",
  "Filipino",
  "Indonesian",
  "Turkish",
  "Israeli",
  "Iranian",
  "Saudi Arabian",
  "Emirati",
  "Russian",
  "Ukrainian",
] as const;

/**
 * Complete demographic profile for contextual analysis and validation
 */
export interface UserDemographics {
  /** Participant age */
  age: number;
  /** Gender for appropriate question selection */
  gender: Gender;
  /** Educational background */
  education: EducationLevel;
  /** Country of origin */
  nationality: string;
}
