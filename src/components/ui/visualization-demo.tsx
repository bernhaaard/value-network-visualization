"use client";

import { useState } from 'react';
import { Button, Heading } from '@chakra-ui/react';
import { ThreeScene } from './three-d-scene';
import { TwoDScene } from './two-d-scene';

export function VisualizationDemo() {
  const [is3D, setIs3D] = useState(false);

  return (
    <div className="space-y-4">
      {/* Simple Mode Toggle */}
      <div className="flex justify-between items-center">
        <div>
          <Heading size="md" className="text-gray-800 dark:text-white">
            {is3D ? '3D Test' : '2D Test'}
          </Heading>
        </div>

        <Button
          onClick={() => setIs3D(!is3D)}
          colorPalette="blue"
          size="sm"
        >
          Switch to {is3D ? '2D' : '3D'}
        </Button>
      </div>

      {/* Simple Test Container */}
      {is3D ? <ThreeScene /> : <TwoDScene />}
    </div>
  );
} 