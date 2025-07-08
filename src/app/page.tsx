"use client";

import { Box, Button, Heading, Text } from "@chakra-ui/react";
import { ColorModeButton, VisualizationDemo } from "@/components/ui";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="max-w-7xl w-full h-full space-y-6">
        {/* Header */}
        <Box className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-xl p-6 shadow-lg border border-gray-200/20">
          <div className="flex justify-between items-start mb-4">
            <div>
              <Heading size="2xl" className="text-gray-800 dark:text-white mb-2">
                Value Network Visualization
              </Heading>
              <Text className="text-gray-600 dark:text-gray-300">
                Interactive 2D/3D platform for value network analysis
              </Text>
            </div>
            <ColorModeButton />
          </div>

          {/* Setup Status */}
          <Box className="border-l-4 border-green-500 pl-4 mb-4">
            <Heading size="lg" className="text-gray-700 dark:text-gray-200 mb-2">
              ✅ Heading test: works!
            </Heading>
            <Text className="text-gray-600 dark:text-gray-400">
              Next.js 15 + Chakra UI v3 + Tailwind CSS v4 + Three.js
            </Text>
          </Box>

          {/* Simple Actions */}
          <div className="flex gap-3">
            <Button colorPalette="blue" size="lg">
              Button 1
            </Button>
            <Button variant="outline" size="lg">
              Button 2
            </Button>
          </div>
        </Box>

        {/* Visualization Test */}
        <Box className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-xl p-6 shadow-lg border border-gray-200/20 min-h-[600px]">
          <Heading size="lg" className="text-gray-800 dark:text-white mb-4">
            Library Integration Test
          </Heading>
          <VisualizationDemo />
        </Box>

        {/* Tech Stack */}
        <div className="text-center pt-2">
          <Text className="text-gray-500 dark:text-gray-400 text-sm">
            Built with Next.js 15 • React 19 • Chakra UI v3 • Tailwind CSS v4 • Three.js •
            TypeScript
          </Text>
        </div>
      </div>
    </div>
  );
}
