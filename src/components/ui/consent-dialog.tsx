"use client";

import {
  Box,
  Button,
  Text,
  VStack,
  Checkbox,
  Dialog
} from "@chakra-ui/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface ConsentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ConsentDialog({ open, onOpenChange }: ConsentDialogProps) {
  const [hasConsented, setHasConsented] = useState(false);
  const router = useRouter();

  const handleProceed = () => {
    onOpenChange(false);
    router.push("/questionnaire");
  };

  const handleDecline = () => {
    onOpenChange(false);
  };

  return (
    <Dialog.Root open={open} onOpenChange={(e) => onOpenChange(e.open)} size="lg">
      <Dialog.Backdrop bg="bg.overlay" />
      <Dialog.Positioner>
        <Dialog.Content bg="bg.muted" borderRadius="md" borderWidth="1px" borderColor="border.subtle">
          <Dialog.Header>
            <Dialog.Title color="fg">
              Research Participation
            </Dialog.Title>
          </Dialog.Header>

          <Dialog.Body>
            <VStack gap={4} align="stretch">
              <Text color="fg" fontSize="lg">
                Quick heads up!
              </Text>

              <Text color="fg">
                This app is part of my bachelor thesis research at FH St. Pölten, where I&apos;m exploring how different visualization styles help people understand their personal values.
              </Text>

              <Text color="fg" fontWeight="medium">
                Here&apos;s what you should know:
              </Text>
              <VStack gap={2} align="start" pl={4}>
                <Text color="fg.muted" fontSize="sm">Everything is completely anonymous - no personal info collected</Text>
                <Text color="fg.muted" fontSize="sm">Your feedback helps me understand how data presentation affects people&apos;s understanding of their values</Text>
                <Text color="fg.muted" fontSize="sm">The whole process takes about 20-30 minutes total</Text>
              </VStack>

              <Box
                p={4}
                bg="bg.muted"
                borderRadius="md"
                borderWidth="1px"
                borderColor="border.subtle"
              >
                <Checkbox.Root
                  checked={hasConsented}
                  onCheckedChange={(details) => setHasConsented(!!details.checked)}
                >
                  <Checkbox.HiddenInput />
                  <Checkbox.Control />
                  <Checkbox.Label>
                    <Text fontSize="sm" color="fg">
                      By checking this box you&apos;re agreeing to participate. Thanks for helping with my research!
                    </Text>
                  </Checkbox.Label>
                </Checkbox.Root>
              </Box>
            </VStack>
          </Dialog.Body>

          <Dialog.Footer>
            <Dialog.ActionTrigger asChild>
              <Button variant="outline" color="fg.muted" borderColor="border.subtle" _hover={{ color: "fg.inverted" }} onClick={handleDecline}>
                Maybe Later
              </Button>
            </Dialog.ActionTrigger>
            <Button
              onClick={handleProceed}
              bg="interactive.primary"
              color="fg.inverted"
              _hover={{ bg: "interactive.hover" }}
              disabled={!hasConsented}
            >
              Let&apos;s Go
            </Button>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  );
}
