import type { ValueCategory } from "@/lib/schwartz";
import { VALUE_ORDER } from "./types";

/**
 * Calculate polar angle based on position in Schwartz circumplex order
 */
export const calculatePolarAngle = (valueCategory: ValueCategory): number => {
  const index = VALUE_ORDER.indexOf(valueCategory);
  const totalValues = VALUE_ORDER.length;

  // Distribute equally around circle (2π radians)
  return (index / totalValues) * 2 * Math.PI;
};

/**
 * Calculate distance from center based on importance score
 */
export const calculateDistance = (
  rawScore: number,
  maxUserScore: number,
  baseDistance: number,
  distanceIncrement: number,
): number => {
  return baseDistance + (maxUserScore - rawScore) * distanceIncrement;
};

/**
 * Calculate node size based on importance score
 */
export const calculateNodeSize = (
  rawScore: number,
  maxUserScore: number,
  baseSize: number,
  sizeIncrement: number,
): number => {
  return baseSize - (maxUserScore - rawScore) * sizeIncrement;
};

/**
 * Convert spherical (Three.js convention) to Cartesian coordinates
 * @param radius - distance from origin
 * @param theta - azimuthal angle around Y-axis (θ = 0 at +Z, CCW towards +X)
 * @param phi - polar angle from +Y axis (φ = 0 at +Y, φ = π/2 on XZ-plane)
 */
export const sphericalToCartesian = (
  radius: number,
  theta: number,
  phi: number,
): { x: number; y: number; z: number } => {
  return {
    x: radius * Math.sin(phi) * Math.sin(theta),
    y: radius * Math.cos(phi),
    z: radius * Math.sin(phi) * Math.cos(theta),
  };
};
