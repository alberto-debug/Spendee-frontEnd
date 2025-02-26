import type React from "react";
import { useState } from "react";
import {
  Box,
  Text,
  Flex,
  Icon,
  IconButton,
  Container,
  Heading,
  VStack,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { FaEye, FaEyeSlash, FaWifi, FaDownload } from "react-icons/fa";
import { RiVisaLine } from "react-icons/ri";

import DownloadPdfButton from "./DownloadPdfButton";

const MotionBox = motion(Box);
const MotionFlex = motion(Flex);

interface HeroSectionProps {
  balance: number;
}

const HeroSection: React.FC<HeroSectionProps> = ({ balance }) => {
  const [showBalance, setShowBalance] = useState(false); // Inicializa como false para censurar o balance por padrão

  return (
    <Box
      bg="linear-gradient(135deg, #1a1a1d 0%, #0C0F15 100%)"
      color="white"
      py={{ base: 8, md: 16 }}
      position="relative"
      overflow="hidden"
      minH={{ base: "50vh", md: "auto" }}
      display="flex"
      alignItems="center"
    >
      <Container maxW="container.xl" py={{ base: 4, md: 8 }}>
        <MotionFlex
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          direction={{ base: "column", lg: "row" }}
          align={{ base: "center", lg: "center" }}
          justify="space-between"
          gap={{ base: 10, lg: 20 }}
        >
          {/* Left Content */}
          <MotionBox
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            flex="1"
            textAlign={{ base: "center", lg: "left" }}
          >
            <VStack
              align={{ base: "center", lg: "flex-start" }}
              spacing={6}
              maxW="600px"
            >
              <Heading
                as="h1"
                fontSize={{ base: "4xl", md: "5xl", lg: "6xl" }}
                fontWeight="bold"
                bgGradient="linear(to-r, #00ff5f, #B3EA1B 100%)"
                bgClip="text"
                lineHeight="1.2"
              >
                Smart Money Management
              </Heading>
              <Text
                fontSize={{ base: "lg", md: "xl" }}
                color="whiteAlpha.800"
                maxW="500px"
              >
                Track your expenses in real-time and make informed financial
                decisions with our intuitive dashboard.
              </Text>
            </VStack>
          </MotionBox>

          {/* Card Container */}
          <MotionBox
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            w={{ base: "100%", sm: "450px", md: "500px" }}
            flexShrink={0}
          >
            <MotionBox
              bg="linear-gradient(135deg, #00ff88 0%, #00ff5f 100%)"
              borderRadius="2xl"
              p={{ base: 6, md: 8 }}
              position="relative"
              boxShadow="2xl"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              {/* Top Section */}
              <Flex
                justify="space-between"
                align="center"
                mb={{ base: 6, md: 8 }}
              >
                <Icon
                  as={RiVisaLine}
                  w={{ base: 12, md: 16 }}
                  h={{ base: 6, md: 8 }}
                  color="gray.800"
                />
                <Icon
                  as={FaWifi}
                  w={{ base: 5, md: 6 }}
                  h={{ base: 5, md: 6 }}
                  transform="rotate(90deg)"
                  color="gray.800"
                  opacity={0.8}
                />
              </Flex>

              {/* Middle Section */}
              <Flex
                justify="space-between"
                align="center"
                mb={{ base: 6, md: 8 }}
              >
                {/* Chip */}
                <Box
                  w={{ base: "40px", md: "45px" }}
                  h={{ base: "30px", md: "35px" }}
                  bg="linear-gradient(135deg, #FFD700 0%, #B8860B 100%)"
                  borderRadius="sm"
                  position="relative"
                  overflow="hidden"
                  _after={{
                    content: '""',
                    position: "absolute",
                    top: "45%",
                    left: 0,
                    right: 0,
                    height: "2px",
                    bg: "rgba(0,0,0,0.2)",
                  }}
                />

                {/* Card Number */}
                <Text
                  color="gray.800"
                  fontSize={{ base: "md", md: "lg" }}
                  letterSpacing={2}
                  fontFamily="monospace"
                >
                  •••• •••• •••• 5466
                </Text>
              </Flex>

              {/* Balance Section */}
              <Flex
                justify="space-between"
                align="flex-end"
                mt={{ base: 6, md: 8 }}
              >
                <Box>
                  <Text
                    color="gray.700"
                    fontSize={{ base: "sm", md: "md" }}
                    fontWeight="medium"
                    mb={2}
                  >
                    Balance
                  </Text>
                  <Text
                    color="gray.900"
                    fontSize={{ base: "2xl", md: "3xl" }}
                    fontWeight="bold"
                    fontFamily="monospace"
                    lineHeight="1"
                    style={{
                      filter: showBalance ? "none" : "blur(2px)",
                    }}
                  >
                    {showBalance ? `$${balance.toFixed(2)}` : "••••••"}
                  </Text>
                </Box>
                <IconButton
                  aria-label="Toggle balance visibility"
                  icon={showBalance ? <FaEyeSlash /> : <FaEye />}
                  variant="ghost"
                  size="md"
                  color="gray.800"
                  _hover={{ bg: "whiteAlpha.300" }}
                  onClick={() => setShowBalance(!showBalance)}
                />
              </Flex>

              {/* Decorative Elements */}
              <Box
                position="absolute"
                top={0}
                right={0}
                bottom={0}
                left={0}
                borderRadius="2xl"
                bg="linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%)"
                pointerEvents="none"
              />

              {/* Holographic Effect */}
              <Box
                position="absolute"
                top={0}
                right={0}
                bottom={0}
                left={0}
                borderRadius="2xl"
                background="linear-gradient(125deg, rgba(255,255,255,0.1) 5%, rgba(255,255,255,0.6) 40%, rgba(255,255,255,0.1) 50%)"
                backgroundSize="250% 100%"
                animation="shine 9s infinite linear"
                boxShadow="0 4px 20px rgba(255, 255, 255, 0.2)"
                sx={{
                  "@keyframes shine": {
                    "0%": { backgroundPosition: "250% 0" },
                    "100%": { backgroundPosition: "-250% 0" },
                  },
                }}
                pointerEvents="none"
              />
            </MotionBox>
          </MotionBox>

          {/* Download History Button */}
        </MotionFlex>
      </Container>

      {/* Background Decorative Elements */}
      <Box
        position="absolute"
        top="-20%"
        right="-10%"
        w={{ base: "300px", md: "600px" }}
        h={{ base: "300px", md: "600px" }}
        bg="radial-gradient(circle, rgba(0,255,255,0.1) 0%, rgba(0,255,255,0) 70%)"
        borderRadius="full"
        filter="blur(60px)"
        zIndex={0}
      />
    </Box>
  );
};

export default HeroSection;
