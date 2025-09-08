import type { ValueCategory, HigherOrderDomain } from "@/lib/schwartz";
import type { NodeObject, LinkObject, GraphData as R3FGraphData } from "r3f-forcegraph";
/**
 * Network node representing either the center "You" node or a value node
 */
export interface NetworkNode extends NodeObject {
  /** Identifier */
  id: string;
  /** Name */
  name: string;
  /** Node type */
  type: "center" | "value";
  /** Value category */
  valueCategory?: ValueCategory;
  /** Higher-order domain */
  domain?: HigherOrderDomain;
  /** Raw importance score */
  rawScore?: number;
  /** Calculated size value */
  val: number;
  /** Node color */
  color: string;
  /** Polar angle in radians */
  theta?: number;
  /** Spherical phi angle in radians */
  phi?: number;
  /** Distance from center */
  radius?: number;
  /** Fixed X position */
  fx?: number;
  /** Fixed Y position */
  fy?: number;
  /** Fixed Z position */
  fz?: number;
  /** X position */
  x?: number;
  /** Y position */
  y?: number;
  /** Z position */
  z?: number;
}

/**
 * Network link connecting nodes
 */
export interface NetworkLink extends LinkObject {
  /** Source node ID */
  source: string;
  /** Target node ID */
  target: string;
  /** Link type for different styling */
  type: "primary" | "secondary";
  /** Whether link is currently visible */
  visible: boolean;
  /** Link color */
  color?: string;
  /** Link width */
  width?: number;
}

/**
 * Value Node Popup Info
 */
export interface HoverScreenInfo {
  id: string;
  name?: string;
  domain?: HigherOrderDomain;
  definition?: string;
}

/**
 * Complete graph data structure for r3f-forcegraph
 */
export interface GraphData extends R3FGraphData<NetworkNode, NetworkLink> {
  /** Array of network nodes */
  nodes: NetworkNode[];
  /** Array of network links */
  links: NetworkLink[];
}

/**
 * Configuration for network visualization
 */
export interface NetworkConfig {
  /** Base distance from center */
  baseDistance: number;
  /** Distance increment per importance point */
  distanceIncrement: number;
  /** Base node size */
  baseSize: number;
  /** Size increment per importance point */
  sizeIncrement: number;
  /** Canvas width for calculations */
  canvasWidth: number;
}

/**
 * Domain color mapping for consistent theming
 */
export const DOMAIN_COLORS: Record<HigherOrderDomain, string> = {
  openness_to_change: "hsl(30, 95%, 52%)",
  self_enhancement: "hsl(0, 95%, 55%)",
  conservation: "hsl(210, 92%, 58%)",
  self_transcendence: "hsl(125, 90%, 48%)",
};

/**
 * Value order around circle (CCW from +Z axis) following Schwartz circumplex
 */
export const VALUE_ORDER: ValueCategory[] = [
  "power_resources",
  "power_dominance",
  "achievement",
  "hedonism",
  "stimulation",
  "self_direction_action",
  "self_direction_thought",
  "benevolence_dependability",
  "benevolence_care",
  "universalism_tolerance",
  "universalism_concern",
  "universalism_nature",
  "humility",
  "conformity_interpersonal",
  "conformity_rules",
  "tradition",
  "security_societal",
  "security_personal",
  "face",
];

/**
 * Calculate anxiety-aversion weight using sin function with π domain splitting
 * @param valueCategory - value category to calculate weight for
 * @returns Weight [-1, 1] for Growth vs Self-Protection
 * @info -1 for Growth, 1 for Self-Protection, 0 for Achievement & Humility
 */
export const calculateAnxietyWeight = (valueCategory: ValueCategory): number => {
  const growthValues: ValueCategory[] = [
    "hedonism",
    "stimulation",
    "self_direction_action",
    "self_direction_thought",
    "benevolence_dependability",
    "benevolence_care",
    "universalism_tolerance",
    "universalism_concern",
    "universalism_nature",
  ];
  const selfProtectionValues: ValueCategory[] = [
    "conformity_interpersonal",
    "conformity_rules",
    "tradition",
    "security_societal",
    "security_personal",
    "face",
    "power_resources",
    "power_dominance",
  ];
  // Growth Values
  if (growthValues.includes(valueCategory)) {
    const index = growthValues.indexOf(valueCategory);
    const totalInSpectrum = growthValues.length + 1;
    const angle = ((index + 1) / totalInSpectrum) * Math.PI;
    const weight = Math.sin(angle);
    return -weight;
  }
  // Self-Protection Values
  if (selfProtectionValues.includes(valueCategory)) {
    const index = selfProtectionValues.indexOf(valueCategory);
    const totalInSpectrum = selfProtectionValues.length + 1;
    const angle = ((index + 1) / totalInSpectrum) * Math.PI;
    const weight = Math.sin(angle);
    return weight;
  }
  // Achievement & Humility
  return 0;
};

/**
 * Domain angle ranges for equal distribution (CCW from +Z)
 */
export const DOMAIN_ANGLES: Record<HigherOrderDomain, { start: number; end: number }> = {
  self_enhancement: { start: 0, end: Math.PI / 2 }, // 0-90°
  openness_to_change: { start: Math.PI / 2, end: Math.PI }, // 90-180°
  self_transcendence: { start: Math.PI, end: (3 * Math.PI) / 2 }, // 180-270°
  conservation: { start: (3 * Math.PI) / 2, end: 2 * Math.PI }, // 270-360°
};
