// Demographics Type Definitions

/**
 * Gender options for displaying appropriate question variants
 */
export type Gender = "male" | "female";

/**
 * Educational attainment levels for demographic analysis of value patterns.
 * Provides context for interpreting individual differences in value priorities across educational backgrounds.
 */
export type EducationLevel =
  | "no_formal_education"
  | "primary_education"
  | "secondary_education"
  | "some_college"
  | "bachelor_degree"
  | "master_degree"
  | "doctoral_degree"
  | "professional_degree"
  | "prefer_not_to_say";

/**
 * Complete demographic profile for contextual analysis and validation
 */
export interface UserDemographics {
  /** Participant ag */
  age: number;
  /** Gender for appropriate question selection */
  gender: Gender;
  /** Educational background */
  education: EducationLevel;
  /** Country of origin */
  nationality: string;
}
