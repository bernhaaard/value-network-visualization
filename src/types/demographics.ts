// Demographics Type Definitions

export type Gender = "male" | "female";

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

export interface UserDemographics {
  age: number;
  gender: Gender;
  education: EducationLevel;
  nationality: string; // ISO country code or free text
}
