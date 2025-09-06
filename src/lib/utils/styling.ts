import type { NetworkNode } from "@/lib/visualization";
import { NodeObject, LinkObject } from "r3f-forcegraph";

/**
 * Dim HSL color
 * @param hslColor - HSL color string
 * @param saturationReduction - Percentage amount to reduce saturation
 * @returns Dimmed HSL color string
 */
export const dimHSLColor = (hslColor: string, saturationReduction: number = 30): string => {
  const [h, s, l] = hslColor
    .replaceAll("%", "")
    .replace("hsl(", "")
    .replace(")", "")
    .split(",")
    .map(v => v.trim());

  const newSaturation = Math.max(0, parseInt(s) - saturationReduction);
  return `hsl(${h}, ${newSaturation}%, ${l}%)`;
};

/**
 * Get node color based on hover state
 */
export const getNodeColorWithHover = (
  node: NodeObject,
  hoveredNodeId: string | null | undefined,
): string => {
  if (!hoveredNodeId) return node.color;
  if (hoveredNodeId === node.id || node.id === "center") {
    return node.color;
  }

  return dimHSLColor(node.color, 40);
};

/**
 * Get link color based on hover state
 */
export const getLinkColorWithHover = (
  link: LinkObject,
  hoveredNodeId: string | null | undefined,
  nodes: NetworkNode[],
  colorMode: "light" | "dark",
): string => {
  if (hoveredNodeId === "center") {
    return colorMode === "dark" ? "rgba(255, 255, 255, 0.5)" : "rgba(135, 135, 135, 0.5)";
  }

  const targetId = typeof link.target === "object" ? link.target.id : link.target;

  if (hoveredNodeId && targetId === hoveredNodeId) {
    const hoveredNode = nodes.find(n => n.id === hoveredNodeId);
    return (
      hoveredNode?.color ||
      (colorMode === "dark" ? "rgba(255, 255, 255, 0.5)" : "rgba(155, 155, 155, 0.5)")
    );
  }

  return colorMode === "dark" ? "rgba(255, 255, 255, 0.5)" : "rgba(155, 155, 155, 0.5)";
};

/**
 * Get link width based on hover state
 */
export const getLinkWidthWithHover = (
  link: LinkObject,
  hoveredNodeId: string | null | undefined,
): number => {
  if (hoveredNodeId === "center") {
    return 2;
  }

  const targetId = typeof link.target === "object" ? link.target.id : link.target;
  return hoveredNodeId && targetId === hoveredNodeId ? 3 : 2;
};
