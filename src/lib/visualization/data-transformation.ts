import type { ValueProfile, ValueCategory, RawValueScores } from "@/lib/schwartz";
import { VALUE_CATEGORIES, getHigherOrderDomainForValue } from "@/lib/schwartz";
import {
  GraphData,
  NetworkNode,
  NetworkLink,
  NetworkConfig,
  DOMAIN_COLORS,
  calculateAnxietyWeight,
  calculatePolarAngle,
  calculateDistance,
  calculateNodeSize,
  sphericalToCartesian,
} from "@/lib/visualization";

/**
 * Create default network configuration
 */
export const createNetworkConfig = (canvasSize: number = 1000): NetworkConfig => ({
  baseDistance: 0.16 * canvasSize,
  distanceIncrement: 0.08 * canvasSize,
  baseSize: 50,
  sizeIncrement: 8,
  canvasWidth: canvasSize,
});

/**
 * Find maximum score in user's value profile
 */
const findMaxUserScore = (rawScores: RawValueScores): number => {
  return Math.max(...Object.values(rawScores));
};

/**
 * Create center "You" node
 */
const createCenterNode = (maxNodeSize: number, colorMode: "light" | "dark"): NetworkNode => ({
  id: "center",
  name: "You",
  type: "center",
  val: maxNodeSize * 4, // 4x largest value node radius
  color: colorMode === "dark" ? "#ffffff" : "#8f8f8f",
  x: 0,
  y: 0,
  z: 0,
  fx: 0,
  fy: 0,
  fz: 0,
});

/**
 * Create value node with correct positioning
 */
const createValueNode = (
  valueCategory: ValueCategory,
  rawScore: number,
  maxUserScore: number,
  config: NetworkConfig,
): NetworkNode => {
  const domain = getHigherOrderDomainForValue(valueCategory);
  const nodeSize = calculateNodeSize(rawScore, maxUserScore, config.baseSize, config.sizeIncrement);
  const radius = calculateDistance(
    rawScore,
    maxUserScore,
    config.baseDistance,
    config.distanceIncrement,
  );
  const theta = calculatePolarAngle(valueCategory);

  // Convert from spherical to Cartesian coordinates
  // 2D mode: constrain to XZ-plane with phi = π/2
  const phi = Math.PI / 2;
  const { x, y, z } = sphericalToCartesian(radius, theta, phi);

  // Debug logging
  if (process.env.NODE_ENV === "development") {
    console.log(
      `ValueId: ${valueCategory}, 
      Score: ${rawScore}/${maxUserScore}, 
      Size: ${nodeSize}, 
      Radius: ${radius}, 
      Theta: ${theta}`,
    );
  }

  return {
    id: valueCategory,
    name: valueCategory.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase()),
    type: "value",
    valueCategory,
    domain,
    rawScore,
    val: nodeSize,
    color: DOMAIN_COLORS[domain],
    radius,
    theta,
    phi,
    x,
    y,
    z,
  };
};

/**
 * Create primary edges from center to all value nodes
 */
const createPrimaryLinks = (
  valueNodes: NetworkNode[],
  colorMode: "light" | "dark",
): NetworkLink[] => {
  return valueNodes.map(node => ({
    source: "center",
    target: node.id,
    type: "primary" as const,
    visible: true,
    color: colorMode === "dark" ? "rgba(255, 255, 255, 0.4)" : "rgba(113, 113, 122, 0.6)",
    width: 1,
  }));
};

/**
 * Transform ValueProfile to GraphData for r3f-forcegraph
 */
export const transformValueProfileToGraphData = (
  valueProfile: ValueProfile,
  config: NetworkConfig = createNetworkConfig(),
  mode: "2d" | "3d" = "2d",
  colorMode: "light" | "dark" = "light",
): GraphData => {
  const { rawScores } = valueProfile;
  const maxUserScore = findMaxUserScore(rawScores);

  // Debug logging
  if (process.env.NODE_ENV === "development") {
    console.log("Raw scores:", rawScores);
    console.log("Max user score:", maxUserScore);
    console.log("Config:", config);
  }

  // Create value nodes
  const baseNodes = VALUE_CATEGORIES.map(category =>
    createValueNode(category, rawScores[category], maxUserScore, config),
  );
  let valueNodes: NetworkNode[] = baseNodes;
  if (mode === "3d") {
    // Map phi using Growth vs Self-Protection weights within [0.25π, 0.75π]
    const phiMin = Math.PI * 0.25; // 45° from +Y
    const phiMax = Math.PI * 0.75; // 135° from +Y
    const phiMid = Math.PI / 2; // plane
    const halfRange = (phiMax - phiMin) / 2; // π/4
    // const jitter = (phiMax - phiMin) * 0.02; // small de-overlap

    valueNodes = baseNodes.map(node => {
      // Calculate weight based on circumplex position
      const w = calculateAnxietyWeight(node.id as ValueCategory); // [-1,1]

      // Map weight to phi range
      let phi = phiMid + w * halfRange;

      // Clamp to bounds
      phi = Math.max(phiMin, Math.min(phiMax, phi));

      const radius = node.radius ?? 0;
      const theta = node.theta ?? 0;
      const { x, y, z } = sphericalToCartesian(radius, theta, phi);
      return { ...node, phi, x, y, z } as NetworkNode;
    });
  } else {
    // 2D: pin positions
    valueNodes = baseNodes.map(node => ({ ...node, fx: node.x, fy: node.y, fz: node.z }));
  }

  // Find largest value node size for center node sizing
  const maxNodeSize = Math.max(...valueNodes.map(node => node.val));

  // Create center node
  const centerNode = createCenterNode(maxNodeSize, colorMode);

  // Create all nodes
  const nodes = [centerNode, ...valueNodes];

  // Create primary links
  const links = createPrimaryLinks(valueNodes, colorMode);

  return { nodes, links };
};
