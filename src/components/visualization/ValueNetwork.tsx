"use client";

import React, { useRef, useEffect, useMemo } from "react";
import { Box } from "@chakra-ui/react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import dynamic from "next/dynamic";
import { useVisualization } from "@/lib/context";
import { type GraphData, transformValueProfileToGraphData, createNetworkConfig } from "@/lib/visualization";
import * as THREE from "three";
import type { Object3D } from "three";
import type { NodeObject } from "r3f-forcegraph"

const R3fForceGraph = dynamic(() => import("r3f-forcegraph"), { ssr: false });

/**
 * Core graph visualization component using r3f-forcegraph
 */
function GraphVisualization({ graphData }: { graphData: GraphData }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const fgRef = useRef<any>(null);

  // Drive the simulation
  useFrame(() => {
    if (fgRef.current) {
      fgRef.current.tickFrame();
    }
  });

  // Configure forces on mount - minimal physics for stability
  useEffect(() => {
    if (fgRef.current && graphData.nodes.length > 0) {
      const fg = fgRef.current;

      // Minimal forces to prevent collapse
      fg.d3Force('charge').strength(-20); // Very weak repulsion
      fg.d3Force('center', null); // No centering force
      fg.d3Force('link').strength(0.1); // Very weak link force
    }
  }, [graphData]);

  return (
    <R3fForceGraph
      ref={fgRef}
      graphData={graphData}
      numDimensions={3}
      nodeId="id"
      nodeVal="val"
      nodeColor="color"
      nodeRelSize={6}
      nodeOpacity={1}
      nodeResolution={32}
      linkSource="source"
      linkTarget="target"
      linkColor={() => "rgba(255, 255, 255, 0.5)"}
      linkWidth={2}
      linkOpacity={0.7}
      cooldownTicks={50}
      cooldownTime={2000}
      d3VelocityDecay={0.3}
      nodePositionUpdate={(nodeObject: Object3D, coords: { x: number; y: number; z: number }, node: NodeObject) => {
        // Enforce our calculated positions; keep radius constant in 3D
        if (node.x !== undefined && node.y !== undefined && node.z !== undefined) {
          nodeObject.position.set(node.x, node.y, node.z);
          return true; // Skip default positioning
        }
        return false;
      }}
    />
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

  // Easing
  const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

  // Compute and kick off animation on mode change
  useEffect(() => {
    // Capture current camera state
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
 * ValueNetwork - Simple 2D ego network visualization with responsive sizing
 */
export function ValueNetwork() {
  const { valueProfile, currentMode } = useVisualization();

  // Transform value profile to graph data
  const graphData = useMemo(() => {
    if (!valueProfile) {
      return { nodes: [], links: [] };
    }

    const config = createNetworkConfig(600); // Fixed internal size
    return transformValueProfileToGraphData(valueProfile, config);
  }, [valueProfile]);

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
    <Box w="full" h="full" position="relative">
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
        <ambientLight intensity={Math.PI * 0.6} />
        <directionalLight
          position={[5, 10, 5]}
          intensity={Math.PI * 0.4}
        />

        {/* Debug: Axes Helper */}
        {process.env.NODE_ENV === "development" && <axesHelper args={[200]} />}

        {/* Controls */}
        <OrbitControls
          enablePan={false}
          enableZoom={true}
          enableRotate={currentMode === "3d"}
          target={[0, 0, 0]}
          maxDistance={500}
          minDistance={150}
          maxPolarAngle={Math.PI * 0.75} // Restrict orbital rotation ~45°
        // minPolarAngle={Math.PI * 0.25}
        />

        {/* Graph */}
        <GraphVisualization graphData={graphData} />
      </Canvas>
    </Box>
  );
}