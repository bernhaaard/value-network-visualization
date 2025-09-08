"use client";

import React, { useRef, useEffect, useMemo, useState } from "react";
import { debounce } from "lodash";
import { Box, HStack, Text, Slider } from "@chakra-ui/react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import dynamic from "next/dynamic";
import { useVisualization } from "@/lib/context";
import {
  type GraphData,
  transformValueProfileToGraphData,
  createNetworkConfig,
  type HoverScreenInfo,
  DOMAIN_COLORS,
  calculateAnxietyWeight
} from "@/lib/visualization";
import {
  getNodeColorWithHover,
  getLinkColorWithHover,
  getLinkWidthWithHover
} from "@/lib/utils";
import type { ValueCategory } from "@/lib/schwartz";
import * as THREE from "three";
import type { Object3D } from "three";
import type { LinkObject, NodeObject, GraphMethods } from "r3f-forcegraph";
import { useColorModeValue } from "../ui/color-mode";
import valueDefinitions from "@/lib/visualization/value-definitions.json";

const R3fForceGraph = dynamic(() => import("r3f-forcegraph"), { ssr: false });

function GraphVisualization({ graphData, mode, hoveredNodeId, onHover, onHoveredNodeChange }: {
  graphData: GraphData;
  mode: "2d" | "3d";
  hoveredNodeId?: string | null;
  onHover?: (info: HoverScreenInfo | null) => void;
  onHoveredNodeChange?: (id: string | null) => void;
}) {
  const fgRef = useRef<GraphMethods<NodeObject, LinkObject> | undefined>(undefined);
  const colorMode = useColorModeValue("light", "dark");

  const handleNodeHover = (node?: NodeObject | null) => {
    if (!onHover) return;
    if (!node) {
      onHover(null);
      return;
    }

    const n = node as NodeObject;
    const nodeId = String(n.id);
    const valueDefinition = nodeId !== "center" ? valueDefinitions[nodeId as ValueCategory] : undefined;

    onHover({
      id: nodeId,
      name: n.name,
      domain: (n as NodeObject).domain,
      definition: valueDefinition?.definition,
    });
  };

  // Drive the simulation
  useFrame(() => {
    if (fgRef.current) {
      fgRef.current.tickFrame();
    }
  });

  // Configure forces
  useEffect(() => {
    if (!fgRef.current || fgRef.current === undefined || graphData.nodes.length === 0) return;
    const fg = fgRef.current;
    // All Nodes: no centering force
    fg.d3Force('center', null);

    if (mode === "2d") {
      // 2D nodes are pinned via fx/fy/fz; minimal forces
      fg.d3Force('charge')?.strength(-20);
      const linkForce = fg.d3Force('link');
      if (linkForce && typeof linkForce.strength === 'function') {
        linkForce.strength(0.1);
      }
    } else {
      // 3D: keep radius constant by setting link distance to each value node's radius
      const linkForce = fg.d3Force('link');
      if (linkForce && typeof linkForce.distance === 'function') {
        linkForce
          .distance((l: LinkObject) => {
            const s = typeof l.source === 'object' ? l.source : undefined;
            const t = typeof l.target === 'object' ? l.target : undefined;
            const valueNode = t && t.id !== 'center' ? t : s && s.id !== 'center' ? s : undefined;
            return valueNode?.radius ?? 200;
          })
          .strength(1.0);
      }
      // to avoid overlap
      fg.d3Force('charge')?.strength(-20);
    }

    if (typeof fg.d3ReheatSimulation === 'function') {
      fg.d3ReheatSimulation();
    }
  }, [graphData, mode]);

  return (
    <>
      <R3fForceGraph
        ref={fgRef}
        graphData={graphData}
        numDimensions={3}
        nodeId="id"
        nodeVal="val"
        nodeColor={(node: NodeObject) => getNodeColorWithHover(node, hoveredNodeId)}
        nodeOpacity={1}
        nodeRelSize={6}
        nodeResolution={32}
        linkSource="source"
        linkTarget="target"
        linkOpacity={0.7}
        cooldownTicks={50}
        cooldownTime={2000}
        d3VelocityDecay={0.3}
        onNodeHover={(node: NodeObject | null) => {
          const nodeId = node ? String(node.id) : null;
          if (onHoveredNodeChange) onHoveredNodeChange(nodeId);
          handleNodeHover(node);
          if (fgRef.current) {
            fgRef.current.refresh();
          }
        }}
        linkColor={(link: LinkObject) => getLinkColorWithHover(link, hoveredNodeId, graphData.nodes, colorMode)}
        linkWidth={(link: LinkObject) => getLinkWidthWithHover(link, hoveredNodeId)}
        nodePositionUpdate={(nodeObject: Object3D, coords: { x: number; y: number; z: number }, node: NodeObject) => {
          if (mode === "2d" && node.x !== undefined && node.y !== undefined && node.z !== undefined) {
            nodeObject.position.set(node.x, node.y, node.z);
            return true;
          }
          return false;
        }}
      />
    </>
  );
}

function AlignCameraForMode({ mode }: { mode: "2d" | "3d" }) {
  const { camera } = useThree();

  // Animation refs
  const animStartRef = useRef<number | null>(null);
  const animDurationMs = 500; // 0.5s
  const startPosRef = useRef(new THREE.Vector3());
  const targetPosRef = useRef(new THREE.Vector3());
  const startUpRef = useRef(new THREE.Vector3());
  const targetUpRef = useRef(new THREE.Vector3());
  const isAnimatingRef = useRef(false);

  const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

  // kick off animation
  useEffect(() => {
    // current camera state
    startPosRef.current.copy(camera.position);
    startUpRef.current.copy(camera.up);

    // Targets
    if (mode === "2d") {
      // Top-down onto XZ-plane
      targetPosRef.current.set(0, 400, 0);
      targetUpRef.current.set(0, 0, -1); // +Z down on screen
    } else {
      // 45° between +Y and +Z, radius 400
      const d = 400 / Math.sqrt(2);
      targetPosRef.current.set(0, d, d);
      targetUpRef.current.set(0, 1, 0);
    }

    animStartRef.current = performance.now();
    isAnimatingRef.current = true;
  }, [camera, mode]);

  // Drive animation
  useFrame(() => {
    if (!isAnimatingRef.current || animStartRef.current == null) return;
    const now = performance.now();
    const elapsed = now - animStartRef.current;
    const rawT = Math.min(elapsed / animDurationMs, 1);
    const t = easeInOutCubic(rawT);

    // Lerp position and up vector
    camera.position.lerpVectors(startPosRef.current, targetPosRef.current, t);
    camera.up.lerpVectors(startUpRef.current, targetUpRef.current, t).normalize();
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();

    if (rawT >= 1) {
      isAnimatingRef.current = false;
    }
  });

  return null;
}

/**
 * ValueNetwork - Ego network visualization component
 */
export function ValueNetwork() {
  const { valueProfile, currentMode, trackNodeExploration } = useVisualization();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [hoverHUD, setHoverHUD] = useState<HoverScreenInfo | null>(null);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);

  // Create Y-axis line
  const yAxisLine = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array([0, 0, 0, 0, 300, 0]);
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const material = new THREE.LineBasicMaterial({ color: "hsla(210, 100%, 70%, 0.5)" });
    return new THREE.Line(geometry, material);
  }, []);

  // Debounced node exploration tracking (stable instance)
  const debouncedTrackExploration = useMemo(() => {
    return debounce((nodeId: string) => {
      trackNodeExploration(nodeId);
    }, 500);
  }, [trackNodeExploration]);

  // Cleanup debounced function on unmount
  useEffect(() => {
    return () => {
      debouncedTrackExploration.cancel();
    };
  }, [debouncedTrackExploration]);

  // Transform value profile to graph data
  const colorMode = useColorModeValue("light", "dark");

  const graphData = useMemo(() => {
    if (!valueProfile) {
      return { nodes: [], links: [] };
    }

    const config = createNetworkConfig(600); // Fixed internal size
    return transformValueProfileToGraphData(valueProfile, config, currentMode, colorMode);
  }, [valueProfile, currentMode, colorMode]);

  if (!valueProfile) {
    return (
      <Box
        w="full"
        h="full"
        display="flex"
        alignItems="center"
        justifyContent="center"
        color="fg.muted"
      >
        Loading value profile...
      </Box>
    );
  }

  return (
    <Box
      w="full"
      h="full"
      position="relative"
      ref={containerRef}
      onMouseLeave={() => {
        setHoverHUD(null);
        setHoveredNodeId(null);
      }}
    >
      <Canvas
        orthographic={currentMode === "2d"}
        camera={{
          position: [0, 400, 0],
          zoom: 1
        }}
        style={{
          width: "100%",
          height: "100%",
          background: "transparent"
        }}
      >
        <AlignCameraForMode mode={currentMode} />
        {/* Lighting */}
        <ambientLight intensity={Math.PI * 0.4} />
        <directionalLight
          position={[100, 1000, 500]}
          intensity={Math.PI * 0.5}
        />

        {/* Grid Helper */}
        <gridHelper args={[1000, 300, "hsla(30, 90%, 80%, 0.5)", "hsla(0, 0%, 25%, 0.001)"]} />

        {/* Y-Axis Only */}
        <primitive object={yAxisLine} />

        {/* Controls */}
        <OrbitControls
          enablePan={false}
          enableZoom={true}
          enableRotate={currentMode === "3d"}
          target={[0, 0, 0]}
          maxDistance={500}
          minDistance={150}
          maxPolarAngle={Math.PI * 0.75}
        // minPolarAngle={Math.PI * 0.25}
        />

        {/* Graph */}
        <GraphVisualization
          graphData={graphData}
          mode={currentMode}
          onHover={setHoverHUD}
          hoveredNodeId={hoveredNodeId}
          onHoveredNodeChange={(nodeId: string | null) => {
            setHoveredNodeId(nodeId);
            // Track node exploration for research metrics (first-time only per mode)
            if (nodeId && nodeId !== "center") {
              debouncedTrackExploration(nodeId);
            }
          }}
        />
      </Canvas>
      {hoverHUD && (
        <Box
          position="absolute"
          top={4}
          left={4}
          bg="bg.overlay"
          color="fg"
          borderWidth="1px"
          borderColor={hoverHUD.domain ? DOMAIN_COLORS[hoverHUD.domain] : "border.subtle"}
          boxShadow="lg"
          px={4}
          py={3}
          rounded="lg"
          pointerEvents="none"
          fontSize="sm"
          lineHeight="short"
          maxW="400px"
        >
          <Box fontWeight="semibold" mb={hoverHUD.id === "center" ? 0 : 3} color="fg">
            {hoverHUD.name} {" "}
            <Box as="span" color="fg.muted">
              ({(hoverHUD.domain || '').toString().replaceAll('_', ' ').replace(/\b\w/g, l => l.toUpperCase())})
            </Box>
          </Box>

          {hoverHUD.id !== "center" && (
            <Box opacity={0.95} fontSize="xs" gap={2}>
              {hoverHUD.definition && (
                <Box mb={3} color="fg.muted" lineHeight="relaxed">
                  {hoverHUD.definition}
                </Box>
              )}

              {/* Anxiety-Aversion Dimension Slider */}
              {currentMode === "3d" && (
                <Box mb={3}>
                  <HStack gap={2} alignItems="center">
                    <Text fontSize="2xs" color="fg.subtle" minW="10">Growth</Text>
                    <Box flex={1}>
                      <Slider.Root
                        value={[((calculateAnxietyWeight(hoverHUD.id as ValueCategory) + 1) / 2) * 100]}
                        min={0}
                        max={100}
                        size="sm"
                        disabled
                        colorPalette="gray"
                      >
                        <Slider.Control>
                          <Slider.Track bg="gray.200" _dark={{ bg: "gray.600" }}>
                            <Slider.Range bg="gray.400" _dark={{ bg: "gray.400" }} />
                          </Slider.Track>
                          <Slider.Thumb index={0} bg="fg" boxSize={3} />
                        </Slider.Control>
                      </Slider.Root>
                    </Box>
                    <Text fontSize="2xs" color="fg.subtle" minW="10">Self-Protection</Text>
                  </HStack>
                </Box>
              )}
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
}