"use client";

import { Box, Button, Heading, Text } from "@chakra-ui/react";
import { ColorModeButton } from "@/components/ui/color-mode";

export default function Home() {
  return (
    <Box
      minH="100vh"
      bg="gray.50"
      _dark={{ bg: "gray.900" }}
      p={8}
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Box
        maxW="lg"
        w="full"
        bg="white"
        _dark={{ bg: "gray.800" }}
        borderRadius="xl"
        boxShadow="xl"
        p={10}
        borderWidth={1}
        borderColor="gray.200"
      >
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={8}>
          <Heading
            size="2xl"
            color="gray.800"
            _dark={{ color: "white" }}
            fontWeight="bold"
          >
            Value Network Viz
          </Heading>
          <ColorModeButton />
        </Box>

        <Text
          fontSize="lg"
          color="gray.600"
          _dark={{ color: "gray.300" }}
          mb={8}
          lineHeight="tall"
        >
          Interactive platform for value network analysis
        </Text>

        <Box spaceY={4} mb={8}>
          <Button
            colorPalette="orange"
            size="lg"
            w="full"
            py={6}
            fontSize="md"
            fontWeight="semibold"
          >
            Button 1
          </Button>
          <Button
            variant="outline"
            size="lg"
            w="full"
            py={6}
            fontSize="md"
            colorPalette="orange"
          >
            Button 2
          </Button>
          <Button
            variant="ghost"
            size="lg"
            w="full"
            py={6}
            fontSize="md"
            colorPalette="orange"
          >
            Button 3
          </Button>
        </Box>

        <Text
          fontSize="sm"
          color="gray.500"
          _dark={{ color: "gray.400" }}
          textAlign="center"
          fontStyle="italic"
        >
          Chakra UI + Tailwind CSS integration test
        </Text>
      </Box>
    </Box>
  )
}
