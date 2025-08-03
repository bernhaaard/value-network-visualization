"use client";

import { Box, Text, chakra } from "@chakra-ui/react";

// Minimal 2D scene for testing with Orange Neural theme
export function TwoDScene() {
  return (
    <Box
      w="full"
      h="full"
      rounded="lg"
      overflow="hidden"
      borderWidth="1px"
      borderColor="border.subtle"
      bg="bg.subtle"
    >
      <Box p={4}>
        <chakra.svg
          width="100%"
          height="600px"
          viewBox="0 0 200 120"
          borderWidth="1px"
          borderColor="border"
          rounded="md"
          bg="bg"
        >
          {/* Orange themed shapes */}
          <circle cx={50} cy={60} r={15} fill="hsl(30, 95%, 52%)" stroke="hsl(30, 90%, 22%)" strokeWidth={2} />
          <rect x={75} y={45} width={30} height={30} fill="hsl(30, 85%, 38%)" stroke="hsl(30, 90%, 22%)" strokeWidth={2} />
          <circle cx={130} cy={60} r={15} fill="hsl(30, 80%, 68%)" stroke="hsl(30, 90%, 22%)" strokeWidth={2} />

          {/* Orange connection lines */}
          <line x1={65} y1={60} x2={75} y2={60} stroke="hsl(30, 95%, 52%)" strokeWidth={2} />
          <line x1={105} y1={60} x2={115} y2={60} stroke="hsl(30, 95%, 52%)" strokeWidth={2} />
        </chakra.svg>

        <Text fontSize="xs" color="fg.subtle" mt={2}>SVG rendering test with value visualization theme</Text>
      </Box>
    </Box>
  );
}
