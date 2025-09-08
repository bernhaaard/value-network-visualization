"use client";

import { useState } from "react";
import { Box, Container, Heading, Text, VStack, Image } from "@chakra-ui/react";
import { ConsentDialog } from "@/components/ui";

export default function Home() {
  const [isConsentOpen, setIsConsentOpen] = useState(false);

  return (
    <Container maxW="7xl" py={8}>
      <Box
        bg="bg.subtle"
        borderRadius="xl"
        p={{ base: 6, md: 12 }}
        borderWidth="1px"
        borderColor="border.subtle"
        position="relative"
        overflow="hidden"
      >
        {/* Background Accent */}
        <Box
          position="absolute"
          top={0}
          right={0}
          w="40%"
          h="100%"
          bgGradient="linear(to-l, interactive.primary/10, transparent)"
          display={{ base: "none", lg: "block" }}
        />

        {/* Decorative Network Examples - Responsive Positioning */}
        {/* Top Right - Network Example 1 (Hidden on xs) */}
        <Box
          position="absolute"
          top={{ base: 4, md: 8, lg: 12, xl: 16 }}
          right={{ base: 2, md: 6, lg: 12, xl: 20 }}
          w={{ base: "100px", md: "120px", lg: "140px" }}
          h={{ base: "100px", md: "120px", lg: "140px" }}
          borderRadius="xl"
          overflow="hidden"
          display={{ base: "none", lg: "block" }}
          opacity="0.75"
        >
          <Image
            src="/ValueNetworkExample01.png"
            alt="Network visualization example"
            w="100%"
            h="100%"
            objectFit="cover"
          />
        </Box>

        {/* Bottom Right - Network Example 2 */}
        <Box
          position="absolute"
          bottom={{ base: 12, md: 16, lg: 24, xl: 28 }}
          right={{ base: 1, md: 4, lg: 8, xl: 16 }}
          w={{ base: "100px", md: "150px", lg: "200px" }}
          h={{ base: "100px", md: "150px", lg: "200px" }}
          borderRadius="lg"
          overflow="hidden"
          display={{ base: "none", md: "block" }}
          opacity="0.75"
        >
          <Image
            src="/ValueNetworkExample02.png"
            alt="Network visualization example"
            w="100%"
            h="100%"
            objectFit="cover"
          />
        </Box>

        {/* Bottom Left - Network Example 3 */}
        <Box
          position="absolute"
          bottom={{ base: 28, md: 10, lg: 14, xl: 18 }}
          left={{ base: 1, md: 6, lg: 12, xl: 24 }}
          w={{ base: "100px", md: "120px", lg: "200px" }}
          h={{ base: "100px", md: "120px", lg: "200px" }}
          borderRadius="lg"
          overflow="hidden"
          display={{ base: "none", md: "block" }}
          opacity="0.75"
        >
          <Image
            src="/ValueNetworkExample03.png"
            alt="Network visualization example"
            w="100%"
            h="100%"
            objectFit="cover"
          />
        </Box>

        <VStack gap={{ base: 8, md: 12 }} position="relative" zIndex={1}>
          {/* Main Hero */}
          <VStack gap={4} textAlign="center" maxW="4xl">
            <Heading
              size={{ base: "2xl", md: "3xl", lg: "4xl" }}
              color="fg"
              fontWeight="bold"
              lineHeight="shorter"
            >
              Discover What Really Drives You
            </Heading>
            <Text
              fontSize={{ base: "lg", md: "xl" }}
              color="fg.muted"
              maxW="2xl"
              lineHeight="relaxed"
            >
              With this app you can explore your personal values as an interactive network
            </Text>
          </VStack>

          {/* Topic Introduction */}
          <VStack gap={6} textAlign="center" maxW="4xl" py={6}>
            <VStack gap={4}>
              <Text fontSize={{ base: "lg", md: "xl" }} color="fg" fontWeight="medium" lineHeight="shorter">
                Have you ever wondered what drives your decisions? What you truly value?
              </Text>
              <Text fontSize={{ base: "md", md: "lg" }} color="fg.muted" lineHeight="relaxed" maxW="3xl">
                I have designed this interactive experience to help you explore your personal unique value system as a visual network. Discover your core motivations as well as how they connect and conflict with each other.
              </Text>
              <Text fontSize={{ base: "sm", md: "md" }} color="fg.subtle" mt={2}>
                See your values from new perspectives and understand what makes you tick
              </Text>
            </VStack>
          </VStack>

          {/* Mobile Warning */}
          <Box
            display={{ base: "block", lg: "none" }}
            p={4}
            bg="status.warning/10"
            borderWidth="1px"
            borderColor="status.warning/30"
            borderRadius="lg"
            textAlign="center"
            maxW="md"
            mx="auto"
            zIndex={99}
          >
            <Text color="status.warning" fontSize="sm" fontWeight="medium" mb={1}>
              📱 Use this app on Desktop
            </Text>
            <Text color="fg.muted" fontSize="xs">
              This experience works best on a computer or laptop for optimal interaction.
            </Text>
            <Text color="fg.muted" fontSize="xs">The app will still work, but there are scaling issues on mobile.</Text>
          </Box>

          {/* CTA */}
          <VStack gap={3}>
            <Box
              as="button"
              onClick={() => setIsConsentOpen(true)}
              bg="interactive.primary"
              color="fg.inverted"
              px={10}
              py={4}
              borderRadius="lg"
              fontWeight="bold"
              fontSize="xl"
              _hover={{
                bg: "interactive.hover",
                transform: "translateY(-2px)",
                shadow: "lg"
              }}
              transition="all 0.3s ease"
              shadow="md"
            >
              Start Your Discovery
            </Box>
            <VStack gap={1}>
              <Text color="fg.muted" fontSize="sm" textAlign="center">
                20-30 minutes to discover your unique value system
              </Text>
              <Text color="fg.subtle" fontSize="sm">
                Desktop/laptop recommended
              </Text>
            </VStack>
          </VStack>
        </VStack>
      </Box>

      {/* Footer */}
      <Box textAlign="center" pt={4}>
        <Text fontSize="sm" color="fg.subtle">
          Part of my bachelor thesis research on how we understand personal values
        </Text>
      </Box>

      {/* Consent Dialog */}
      <ConsentDialog
        open={isConsentOpen}
        onOpenChange={setIsConsentOpen}
      />
    </Container>
  );
}