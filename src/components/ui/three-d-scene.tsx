"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Box } from "@react-three/drei";
import { Suspense, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Mesh } from "three";

// Simple rotating cube component
function RotatingCube() {
  const meshRef = useRef<Mesh>(null);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.5;
      meshRef.current.rotation.y += delta * 0.3;
    }
  });

  return (
    <Box ref={meshRef} args={[1, 1, 1]}>
      <meshStandardMaterial color="#4a90e2" />
    </Box>
  );
}

// Minimal 3D scene for testing
export function ThreeDScene() {
  return (
    <div className="w-full h-full rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
      <div className="p-4">
        <div className="w-full border rounded" style={{ height: "600px" }}>
          <Canvas camera={{ position: [3, 3, 3], fov: 50 }}>
            <Suspense fallback={null}>
              {/* Basic lighting */}
              <ambientLight intensity={0.5} />
              <pointLight position={[10, 10, 10]} intensity={1} />

              {/* Test cube */}
              <RotatingCube />

              {/* Camera controls from Drei */}
              <OrbitControls enableZoom={true} enableRotate={true} />
            </Suspense>
          </Canvas>
        </div>
      </div>
    </div>
  );
}
