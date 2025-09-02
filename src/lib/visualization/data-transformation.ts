import type {
  ValueProfile,
  ValueCategory,
  RawValueScores,
} from "@/lib/schwartz";
import { VALUE_CATEGORIES, getHigherOrderDomainForValue } from "@/lib/schwartz";
import type { GraphData, NetworkNode, NetworkLink, NetworkConfig } from "./types";
import { DOMAIN_COLORS } from "./types";
import {
  calculatePolarAngle,
  calculateDistance,
  calculateNodeSize,
  sphericalToCartesian,
} from "./positioning";

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
const createCenterNode = (maxNodeSize: number): NetworkNode => ({
  id: "center",
  name: "You",
  type: "center",
  val: maxNodeSize * 4, // 4x largest value node radius
  color: "white",
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

  // Debug logging
  if (process.env.NODE_ENV === "development") {
    console.log(
      `Value: ${valueCategory}, Score: ${rawScore}/${maxUserScore}, Size: ${nodeSize}, Radius: ${radius}, Theta: ${theta}`,
    );
  }

  // Convert from spherical to Cartesian coordinates 
  // 2D mode: constrain to XZ-plane with phi = π/2
  const phi = Math.PI / 2;
  const { x, y, z } = sphericalToCartesian(radius, theta, phi);

  if (process.env.NODE_ENV === "development") {
    console.log(`  -> Cartesian: x=${x.toFixed(2)}, y=${y}, z=${z.toFixed(2)}`);
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
    x,
    y,
    z,
    // Pin node so d3 simulation doesn't override spherical positions
    fx: x,
    fy: y,
    fz: z,
  };
};

/**
 * Create primary edges from center to all value nodes
 */
const createPrimaryLinks = (valueNodes: NetworkNode[]): NetworkLink[] => {
  return valueNodes.map(node => ({
    source: "center",
    target: node.id,
    type: "primary" as const,
    visible: true,
    color: "rgba(255, 255, 255, 0.4)",
    width: 1,
  }));
};

/**
 * Transform ValueProfile to GraphData for r3f-forcegraph
 */
export const transformValueProfileToGraphData = (
  valueProfile: ValueProfile,
  config: NetworkConfig = createNetworkConfig(),
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
  const valueNodes = VALUE_CATEGORIES.map(category =>
    createValueNode(category, rawScores[category], maxUserScore, config),
  );

  // Find largest value node size for center node sizing
  const maxNodeSize = Math.max(...valueNodes.map(node => node.val));

  // Create center node
  const centerNode = createCenterNode(maxNodeSize);

  // Create all nodes
  const nodes = [centerNode, ...valueNodes];

  // Create primary links
  const links = createPrimaryLinks(valueNodes);

  return { nodes, links };
};
