import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Provider as ChakraProvider } from "@/components/ui/provider";
import { QuestionnaireProvider } from "@/lib/context";
import { ColorModeButton } from "@/components/ui";
import { Box } from "@chakra-ui/react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Value Network Visualization",
  description: "Interactive 2D/3D visualization platform for human value system analysis.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ChakraProvider>
          <QuestionnaireProvider>
            <Box minH="100vh" bg="bg" position="relative">
              {/* Global Color Mode Toggle */}
              <Box
                position="fixed"
                top={4}
                right={4}
                zIndex={1000}
                bg="bg.overlay"
                borderRadius="md"
                borderWidth="1px"
                borderColor="border.subtle"
                p={1}
                backdropFilter="blur(8px)"
              >
                <ColorModeButton />
              </Box>
              {children}
            </Box>
          </QuestionnaireProvider>
        </ChakraProvider>
      </body>
    </html>
  );
}
